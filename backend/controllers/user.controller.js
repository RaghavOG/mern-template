import User from '../models/user.model.js'; // Importing the User model
import logger from '../utils/logger.js'; // Importing the logger

// Controller for getting the profile of a logged-in user
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        logger.error(`Error getting profile: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Controller for updating the profile of a logged-in user
export const updateProfile = async (req, res) => {
    try {
        const { bio, profilePicture } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update fields in the user profile
        if (bio) user.bio = bio;
        if (profilePicture) user.profilePicture = profilePicture;

        await user.save();

        logger.info(`User ${req.user.username} updated their profile at ${new Date().toISOString()}`);

        res.status(200).json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        logger.error(`Error updating profile: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Controller for deleting the account of a logged-in user
export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Delete the user from the database
        await User.deleteOne({ _id: req.user.id });

        logger.info(`User ${req.user.username} deleted their account at ${new Date().toISOString()}`);

        res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        logger.error(`Error deleting account: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
