import { Rating } from '../models/Rating.js';

export const setRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetModel, targetId, value } = req.body;

        if ('User' !== targetModel) {
            return res.status(400).json({ error: 'Invalid target model' });
        }

        if (![-1, 1].includes(value)) {
            return res.status(400).json({ error: 'Rating value must be -1 or 1' });
        }

        if (targetModel === 'User' && userId.toString() === targetId) {
            return res.status(403).json({ error: "You can't rate yourself" });
        }

        // Is it already rated?
        const existing = await Rating.findOne({
            user: userId,
            target: targetId,
            targetModel
        });
        // If user updated once we update rating
        if (existing) {
            existing.value = value;
            await existing.save();
            return res.json({ message: 'Rating updated', rating: existing });
        }
        // create new rating If we don't have that one
        const newRating = await Rating.create({
            user: userId,
            target: targetId,
            targetModel,
            value
        });

        res.status(201).json({ message: 'Rating created', rating: newRating });
        
    } catch (err) {
        console.error('Rating error:', err);
        res.status(500).json({ error: 'Server error' });
    }

}
