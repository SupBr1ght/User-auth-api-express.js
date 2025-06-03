import express from "express";
import { register, login } from '../controllers/authController.js';
import protect from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;