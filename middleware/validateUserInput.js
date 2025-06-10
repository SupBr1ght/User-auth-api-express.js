export const validateRatingInput = ({ targetModel, targetId, value }, userId) => {
    if (targetModel !== 'User') {
        return { error: 'Invalid target model', status: 400 };
    }

    if (![-1, 0, 1].includes(value)) {
        return { error: 'Rating value must be -1 or 1', status: 400 };
    }

    if (userId.toString() === targetId) {
        return { error: "You can't rate yourself", status: 403 };
    }

    return null;
}