import express from "express";
import { register, login, updateUserById, deleteUserById } from '../controllers/auth/authController.js';
import { setRating } from "../controllers/ratingController.js";
import { protect, permitRoles } from "../middleware/index.js"
import { User } from "../models/user.js";
import loger from "../logger.js"

const router = express.Router();
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.put('/users/:id', protect, permitRoles('admin', 'moderator'), updateUserById);
router.delete('/users/:id', protect, permitRoles('admin', 'moderator'), deleteUserById);
//  Only registered users can vote
router.post('/users/vote', protect, setRating)
router.get('/me', protect, (req, res) => {
  res.status(200).json({ user: req.user });
});
router.get('/me/rating', protect, async (req, res) => {
  try {

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User is undefined.' });
    }
    res.status(200).json({ rating: user.rating });

  } catch (error) {
    loger.error(error)
    res.status(500).json({ message: 'Server errror', error });
  }
})

export default router;