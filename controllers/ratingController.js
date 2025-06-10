import { Rating } from '../models/rating.js';
import { validateRatingInput, canUpdateRatingUser } from '../middleware/index.js';
import mongoose from 'mongoose'; 


export const setRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetModel, targetId: rawTargetId, value } = req.body; // Змінено ім'я для сирого ID

        const now = new Date();

        let parsedTargetId;
        try {
            parsedTargetId = new mongoose.Types.ObjectId(rawTargetId);
        } catch (castError) {
            return res.status(400).json({ error: `Invalid targetId format: ${castError.message}` });
        }

        const validationError = validateRatingInput({ targetModel, targetId: parsedTargetId, value }, userId);
        if (validationError) {
            return res.status(validationError.status).json({ error: validationError.error });
        }

        const existing = await Rating.findOne({ user: userId, targetId: parsedTargetId, targetModel });

        if (existing) {
            const cooldownError = canUpdateRatingUser(existing, now);
            if (cooldownError) {
                return res.status(cooldownError.status).json({ error: cooldownError.error });
            }

            if (value === 0) {
                await existing.deleteOne();
                return res.json({ message: 'Vote withdrawn' });
            } else {
                existing.value = value;
                await existing.save();
                return res.json({ message: 'Vote updated', rating: existing });
            }
        }

        if (value === 0) {
            return res.status(400).json({ error: 'No existing vote to withdraw' });
        }

        const newRating = await Rating.create({
            user: userId,
            targetId: parsedTargetId, 
            targetModel,
            value
        });

        return res.status(201).json({ message: 'Rating created', rating: newRating });

    } catch (err) {
        res.status(500).json({ error: 'Server error occurred during rating operation.' });
    }
};
