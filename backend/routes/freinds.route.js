import express from "express";

import { protectRoute } from "../middleware/protectRoute.js";

import { acceptFriend, addFriend, blockFriend, cancelFriendRequest, getBlockedFriends, getFriend, getFriendRequests, getFriends, getSentFriendRequests, rejectFriend, removeFriend, searchFriends, unblockFriend } from "../controllers/friends.controller.js";
import friendRequestLimiter from "../middleware/friendRequestLimiter.js";

const router = express.Router();


router.get("/", protectRoute, getFriends);  // get friends for sidebar
router.post("/add", protectRoute,friendRequestLimiter, addFriend);   // search knke add friend k liye
router.delete("/remove/:id", protectRoute, removeFriend); // remove friend button
router.post("/accept/:id", protectRoute, acceptFriend);  // accept friend request incoming 
router.post("/reject/:id", protectRoute, rejectFriend);  // reject friend request incoming
router.post("/block/:id", protectRoute, blockFriend);    // block existing friend
router.post("/unblock/:id", protectRoute, unblockFriend); // unblock friend existing friend
router.get("/requests", protectRoute, getFriendRequests); // get friend requests incoming
router.get("/blocked", protectRoute, getBlockedFriends); // get blocked friends
router.get("/search", protectRoute, searchFriends); // search friends
router.get("/:id", protectRoute, getFriend); // get friend profile
router.get("/sent-requests", protectRoute, getSentFriendRequests); // get sent requests
router.delete("/sent-requests/:requestId", protectRoute, cancelFriendRequest); // get sent requests



export default router;