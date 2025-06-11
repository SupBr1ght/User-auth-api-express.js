import { Rating } from '../models/rating.js';
import { User } from '../models/user.js';
import { validateRatingInput, canUpdateRatingUser } from '../middleware/index.js';
import mongoose from 'mongoose';

export const setRating = async (req, res) => {
    try {
        let ratingChange = 0;
        const voterId = req.user.id;
        const { targetModel, targetId: rawTargetId, value } = req.body;

        const now = new Date();

        let parsedTargetId;
        // try parse string id into object id
        try {
            parsedTargetId = new mongoose.Types.ObjectId(rawTargetId);
        } catch (castError) {
            return res.status(400).json({ error: `Invalid targetId format: ${castError.message}` });
        }

        // check that user can't rate more than one time per hour, target user exist, user can't rate yourself
        const validationError = validateRatingInput({ targetModel, targetId: parsedTargetId, value }, voterId);
        if (validationError) {
            return res.status(validationError.status).json({ error: validationError.error });
        }

        const existing = await Rating.findOne({ voter: voterId, targetId: parsedTargetId, targetModel });

        if (existing) {
            // cooldown user
            // const cooldownError = canUpdateRatingUser(existing, now);
            // if (cooldownError) {
            //     return res.status(cooldownError.status).json({ error: cooldownError.error });
            // }

            const initialTargetEntity = await User.findById(parsedTargetId); // Отримайте початковий рейтинг
            if (initialTargetEntity) {
                console.log('Initial rating of target entity:', initialTargetEntity.rating);
            } else {
                console.log('Target entity not found before operation!');
            }

            if (value === 0) {
                // current value - old value
                ratingChange = value;
                console.log('Rating change for new vote:', ratingChange); // Тут має бути 1
                ratingChange = -existing.value;

                // remove old value
                await existing.deleteOne();

                // update new rating's value
                await User.findByIdAndUpdate(parsedTargetId, { $inc: { rating: ratingChange } });

                // get new target value for answer
                const updatedTargetEntity = await User.findById(parsedTargetId);
                console.log('Updated rating of target entity:', updatedTargetEntity.rating); // Тут має бути 1
                console.log('--- КІНЕЦЬ ЗАПИТУ ---');
                return res.json({ message: 'You\'ve succsessfuly withdraw voice', rating: updatedTargetEntity.rating });
            } else {
                // check if existing value = new one
                if (existing.value === value) {
                    return res.status(400).json({ error: 'It\'s the same result as before ' });
                }
                // to know the difference betwen old and new values
                ratingChange = value - existing.value;
                existing.value = value;
                // save new value 
                await existing.save();

                // update current rating in User
                await User.findByIdAndUpdate(parsedTargetId, { $inc: { rating: ratingChange } });
                const updatedTargetEntity = await User.findById(parsedTargetId);
                return res.json({ message: 'The rating succsessfuly updated!', rating: updatedTargetEntity.rating });
            }
        } else {

            if (value === 0) {
                return res.status(400).json({ error: 'We don\'t have vote to withdraw .' });
            }

            const newRatingRecord = await Rating.create({
                voter: voterId,
                targetId: parsedTargetId,
                targetModel,
                value,
                lastModified: now
            });

            ratingChange = value;

            // update current rating in User and show it 
            await User.findByIdAndUpdate(parsedTargetId, { $inc: { rating: ratingChange } });
            const updatedTargetEntity = await User.findById(parsedTargetId);
            return res.status(201).json({ message: 'Vote succsessfuly added', rating: updatedTargetEntity.rating });
        }

    } catch (err) {
        console.error('Error during rating operation:', err);
        res.status(500).json({ error: 'Server error occurred during rating operation.' });
    }
};