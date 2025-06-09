import express from "express";
import { register, login, updateUserById, deleteUserById } from '../controllers/auth/authController.js';
import { setRating } from "../controllers/ratingController.js";
import {protect, permitRoles} from "../middleware/index.js"


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, (req, res) => {
  res.status(200).json({ user: req.user });
});


// Protected routes
router.put('/users/:id', protect, permitRoles('admin', 'moderator'), updateUserById);
router.delete('/users/:id', protect, permitRoles('admin', 'moderator'), deleteUserById);
//  Only registered users can vote
router.post('/users/vote', protect, setRating)

export default router;