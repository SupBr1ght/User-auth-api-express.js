import express from "express";
import { register, login, updateUserById, deleteUserById } from '../controllers/authController.js';
import protect from '../middleware/AuthMiddleware.js';
import permitRoles from "../middleware/RolesVerify.js";


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, (req, res) => {
  res.status(200).json({ user: req.user });
});


// Protected routes
router.put('/users/:id', protect, permitRoles('admin', 'moderator'), updateUserById);
router.delete('/users/:id', protect, permitRoles('admin', 'moderator'), deleteUserById);

export default router;