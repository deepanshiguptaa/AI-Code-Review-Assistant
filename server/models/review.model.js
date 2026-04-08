// Dummy Review model for demo (MongoDB disabled)

const Review = {
    async findOne() {
        return null;
    },

    async create(data) {
        console.log("Review saved (demo mode):", data);
        return data;
    }
};

export default Review;