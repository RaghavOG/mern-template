import express from 'express';
import { deleteAccount, updateProfile } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { getProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/profile", protectRoute, getProfile);
router.put("/update-profile", protectRoute, updateProfile);
router.delete("/delete-account", protectRoute, deleteAccount);




export default router;