export const canUpdateRatingUser = (existing, now) => {
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    if (existing.updatedAt > oneHourAgo) {
        const minutesLeft = Math.ceil((existing.updatedAt.getTime() + 60 * 60 * 1000 - now.getTime()) / 60000);
        return {
            error: `You can rate this target again in ${minutesLeft} minutes`,
            status: 429
        };
    }
    return null;
}