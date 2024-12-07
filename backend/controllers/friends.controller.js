import User from '../models/user.model.js';
import logger from '../utils/logger.js';

// Get Friends for Sidebar
export async function getFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).populate("friends", "username profilePicture");
        if (!user) {
            logger.error(`User not found for ID: ${req.user.id}`);
            return res.status(404).json({ success: false, message: "User not found." });
        }

        logger.info(`Fetched friends for user ID: ${req.user.id}`);
        res.status(200).json({ success: true, friends: user.friends });
    } catch (error) {
        logger.error(`Error fetching friends: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// Add Friend (Send Friend Request)
export async function addFriend(req, res) {
    try {
        const { username } = req.body;

        const targetUser = await User.findOne({ username }).populate("friendRequests.from", "username");
        if (!targetUser) {
            logger.error(`User not found for username: ${username}`);
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Check if already friends or request already sent
        const alreadyFriend = req.user.friends.includes(targetUser._id);
        const requestExists = targetUser.friendRequests.some(
            (req) => req.from.toString() === req.user.id
        );

        if (alreadyFriend || requestExists) {
            logger.warn(`Friend request already sent or user is already a friend for user ID: ${req.user.id} and target user ID: ${targetUser._id}`);
            return res.status(400).json({ success: false, message: "Friend request already sent or user is already a friend." });
        }

        // Check cooldown period
        const cooldownPeriod = 60 * 1000; // 1 minute
        if (req.user.lastFriendRequest && (Date.now() - new Date(req.user.lastFriendRequest).getTime()) < cooldownPeriod) {
            logger.warn(`Cooldown period not met for user ID: ${req.user.id}`);
            return res.status(429).json({ success: false, message: "You can only send one friend request per minute." });
        }

        // Add request to target user's friendRequests
        targetUser.friendRequests.push({ from: req.user.id, status: "pending" });
        await targetUser.save();

        // Add the friend request to the current user's friendRequestsSent
        req.user.friendRequestsSent.push({ to: targetUser._id, status: "pending" });
        req.user.lastFriendRequest = new Date(); // Update the last friend request timestamp
        await req.user.save();

        logger.info(`Friend request sent from user ID: ${req.user.id} to user ID: ${targetUser._id}`);
        res.status(200).json({ success: true, message: "Friend request sent." });
    } catch (error) {
        logger.error(`Error sending friend request: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// Accept Friend Request
export async function acceptFriend(req, res) {
    try {
        const { requestId } = req.params;
        const user = await User.findById(req.user.id).populate("friendRequests.from", "username");

        const requestIndex = user.friendRequests.findIndex(
            (req) => req._id.toString() === requestId
        );

        if (requestIndex === -1) {
            logger.error(`Friend request not found for user ID: ${req.user.id} and request ID: ${requestId}`);
            return res.status(404).json({ success: false, message: "Request not found." });
        }

        const { from } = user.friendRequests[requestIndex];
        user.friends.push(from);
        user.friendRequests.splice(requestIndex, 1);

        const sender = await User.findById(from);
        sender.friends.push(req.user.id);

        await user.save();
        await sender.save();

        logger.info(`User ${req.user.username} accepted friend request from ${sender.username} at ${new Date()}`);
        res.status(200).json({ success: true, message: "Friend request accepted." });
    } catch (error) {
        logger.error(`Error accepting friend request: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}


// Reject Friend Request
export async function rejectFriend(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user.id);
        if (!user) {
            logger.error(`User not found for ID: ${req.user.id}`);
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const requestIndex = user.friendRequests.findIndex(
            (req) => req.from.toString() === id && req.status === "pending"
        );
        if (requestIndex === -1) {
            logger.error(`Friend request not found for user ID: ${req.user.id} and request ID: ${id}`);
            return res.status(400).json({ success: false, message: "Friend request not found." });
        }

        // Remove the request from the user's friendRequests array
        user.friendRequests.splice(requestIndex, 1);
        await user.save();

        logger.info(`Friend request rejected by user ID: ${req.user.id} for request ID: ${id}`);
        res.status(200).json({ success: true, message: "Friend request rejected." });
    } catch (error) {
        logger.error(`Error rejecting friend request: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// Remove Friend
export async function removeFriend(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user.id);
        if (!user) {
            logger.error(`User not found for ID: ${req.user.id}`);
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const targetUser = await User.findById(id);
        if (!targetUser) {
            logger.error(`Friend not found for ID: ${id}`);
            return res.status(404).json({ success: false, message: "Friend not found." });
        }

        user.friends = user.friends.filter((friendId) => friendId.toString() !== id);
        targetUser.friends = targetUser.friends.filter((friendId) => friendId.toString() !== req.user.id);

        await user.save();
        await targetUser.save();

        logger.info(`Friend removed by user ID: ${req.user.id} for friend ID: ${id}`);
        res.status(200).json({ success: true, message: "Friend removed successfully." });
    } catch (error) {
        logger.error(`Error removing friend: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// Block Friend
export async function blockFriend(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user.id);
        if (!user) {
            logger.error(`User not found for ID: ${req.user.id}`);
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Add to blocked list and remove from friends
        if (!user.blockedUsers.includes(id)) {
            user.blockedUsers.push(id);
        }
        user.friends = user.friends.filter((friendId) => friendId.toString() !== id);

        await user.save();

        logger.info(`User blocked by user ID: ${req.user.id} for blocked user ID: ${id}`);
        res.status(200).json({ success: true, message: "User blocked successfully." });
    } catch (error) {
        logger.error(`Error blocking user: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// Unblock Friend
export async function unblockFriend(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user.id);
        if (!user) {
            logger.error(`User not found for ID: ${req.user.id}`);
            return res.status(404).json({ success: false, message: "User not found." });
        }

        user.blockedUsers = user.blockedUsers.filter((blockedId) => blockedId.toString() !== id);
        await user.save();

        logger.info(`User unblocked by user ID: ${req.user.id} for unblocked user ID: ${id}`);
        res.status(200).json({ success: true, message: "User unblocked successfully." });
    } catch (error) {
        logger.error(`Error unblocking user: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// Get Friend Requests
export async function getFriendRequests(req, res) {
    try {
        const user = await User.findById(req.user.id).populate(
            "friendRequests.from",
            "username name profilePicture"
        );

        const pendingRequests = user.friendRequests.filter(
            (req) => req.status === "pending"
        );

        logger.info(`Fetched friend requests for user ID: ${req.user.id}`);
        res.status(200).json({ success: true, requests: pendingRequests });
    } catch (error) {
        logger.error(`Error fetching friend requests: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// Get Blocked Friends
export async function getBlockedFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).populate(
            "blockedUsers",
            "username name profilePicture"
        );

        logger.info(`Fetched blocked users for user ID: ${req.user.id}`);
        res.status(200).json({ success: true, blockedUsers: user.blockedUsers });
    } catch (error) {
        logger.error(`Error fetching blocked users: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// Search Friends
export async function searchFriends(req, res) {
    try {
        const { username } = req.query;

        const users = await User.find(
            { username: { $regex: username, $options: "i" } },
            "username name profilePicture"
        );

        logger.info(`Searched for users with username: ${username}`);
        res.status(200).json({ success: true, users });
    } catch (error) {
        logger.error(`Error searching for users: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// Get Friend Profile
export async function getFriend(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("username name profilePicture");

        if (!user) {
            logger.error(`User not found for ID: ${id}`);
            return res.status(404).json({ success: false, message: "User not found." });
        }

        logger.info(`Fetched profile for user ID: ${id}`);
        res.status(200).json({ success: true, user });
    } catch (error) {
        logger.error(`Error fetching user profile: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// View Sent Friend Requests
export async function getSentFriendRequests(req, res) {
    try {
        const user = await User.findById(req.user.id).populate(
            "friendRequestsSent.to",
            "username name profilePicture"
        );

        if (!user) {
            logger.error(`User not found for ID: ${req.user.id}`);
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Format the response for sent requests
        const sentRequests = user.friendRequestsSent.map((req) => ({
            id: req._id,
            to: req.to,
            status: req.status, // "pending", "rejected"
        }));

        logger.info(`Fetched sent friend requests for user ID: ${req.user.id}`);
        res.status(200).json({ success: true, sentRequests });
    } catch (error) {
        logger.error(`Error fetching sent friend requests: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}

// Cancel Sent Friend Request
export async function cancelFriendRequest(req, res) {
    try {
        const { requestId } = req.params;

        const user = await User.findById(req.user.id);
        if (!user) {
            logger.error(`User not found for ID: ${req.user.id}`);
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const requestIndex = user.friendRequestsSent.findIndex(
            (req) => req._id.toString() === requestId && req.status === "pending"
        );

        if (requestIndex === -1) {
            logger.error(`Request not found or already processed for user ID: ${req.user.id} and request ID: ${requestId}`);
            return res.status(404).json({ success: false, message: "Request not found or already processed." });
        }

        const { to } = user.friendRequestsSent[requestIndex];

        // Remove the request from the logged-in user
        user.friendRequestsSent.splice(requestIndex, 1);

        // Remove the corresponding request from the target user's friendRequests array
        const targetUser = await User.findById(to);
        if (targetUser) {
            targetUser.friendRequests = targetUser.friendRequests.filter(
                (req) => req.from.toString() !== req.user.id
            );
            await targetUser.save();
        }

        await user.save();

        logger.info(`Friend request canceled by user ID: ${req.user.id} for request ID: ${requestId}`);
        res.status(200).json({ success: true, message: "Friend request canceled." });
    } catch (error) {
        logger.error(`Error canceling friend request: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error." });
    }
}
