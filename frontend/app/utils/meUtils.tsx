export const getUserExperience = (createdAt: string): string => {
        const createdDate = new Date(createdAt);
        const now = new Date();

        const diffInMs = now.getTime() - createdDate.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        const years = Math.floor(diffInDays / 365);
        const months = Math.floor((diffInDays % 365) / 30);
        const days = diffInDays % 30;

        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''}`;
        } else if (months > 0) {
            return `${months} month${months > 1 ? 's' : ''}`;
        } else {
            return `${days} day${days > 1 ? 's' : ''}`;
        }
};