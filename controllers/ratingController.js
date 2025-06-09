import { Rating } from '../models/Rating.js';
import { User } from '../models/User.js';


export const setRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetModel, targetId, value } = req.body;

        if ('User' !== targetModel) {
            return res.status(400).json({ error: 'Invalid target model' });
        }

        if (![-1, 1, 0].includes(value)) {
            return res.status(400).json({ error: 'Rating value must be -1, 0 or 1' });
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

        if (existing) {
            existing.value = value;
            await existing.save();
            return res.json({ message: 'Rating updated', rating: existing });
        }



    }
}