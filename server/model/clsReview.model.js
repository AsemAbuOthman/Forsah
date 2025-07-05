const { getConnection } = require("../config/clsConfig");

class clsReview{

    static async createReview(reviewData) {
        let result = null;
        console.log('reviewData:', reviewData);

        try {
            const pool = await getConnection();

            result = await pool.request()
                .input('userId', reviewData.userId)
                .input('receiverId', reviewData.receiverId)
                .input('projectId', reviewData.projectId)
                .input('proposalId', reviewData.proposalId)
                .input('rating', reviewData.rating)
                .input('review', reviewData.review)
                .query(`
                    INSERT INTO Reviews (userId, receiverId, projectId, proposalId, rating, review)
                    VALUES (@userId, @receiverId, @projectId, @proposalId, @rating, @review)
                `);

        } catch (error) {
            console.error('Error inserting review:', error);
        }

        return result;
    }

    static async getReviews(receiverId) {
        let reviews = [];

        try {
            const pool = await getConnection();

            const result = await pool.request()
                .input('receiverId', receiverId)
                .query(`
                    SELECT 
                        r.reviewId,
                        r.userId,
                        r.receiverId,
                        r.projectId,
                        r.proposalId,
                        r.rating,
                        r.review,
                        r.createdAt,

                        u.firstName,
                        u.lastName,
                        u.username,

                        p.profileDescription,
                        img.imageUrl AS profileImageUrl

                    FROM Reviews r
                    LEFT JOIN Users u ON r.userId = u.userId
                    LEFT JOIN Profiles p ON u.userId = p.userId
                    LEFT JOIN Images img ON img.imageableId = p.profileId AND img.imageableType = 'profile'

                    WHERE r.receiverId = @receiverId
                    ORDER BY r.createdAt DESC
                `);

            reviews = result.recordset;

        } catch (error) {
            console.error('Error fetching reviews:', error);
        }

        return reviews;
    }

}

module.exports = clsReview;