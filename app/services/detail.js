const db = require('./db');
const authorization = require('../middlewares/authorization.js').methods;

async function submitReview(req, res) {
    try {
        console.log('submitReview route hit!');
        const user = await authorization.checkCookie(req);
        
        if (!user) {
            return res.status(401).json({ message: 'You must be logged in to leave a review.' });
        }

        const { book_id, user_read_date, review_content, rating } = req.body;
        
        if (!book_id || !review_content || !user_read_date || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Please complete all fields including a star rating.' });
        }

        const selectedDate = new Date(user_read_date);
        const today = new Date();
        if (selectedDate > today) {
            return res.status(400).json({ message: 'Read date cannot be in the future.' });
        }

        const now = new Date();

        // Check for existing review
        const existingReviews = await db.query(
            'SELECT * FROM Reviews WHERE user_id = ? AND book_id = ?',
            [user.user_id, book_id]
        );

        if (Array.isArray(existingReviews) && existingReviews.length > 0) {
            // Update existing review
            await db.query(
                `UPDATE Reviews
                 SET review_content = ?, user_read_date = ?, rating = ?, updated_at = ?
                 WHERE user_id = ? AND book_id = ?`,
                [review_content, user_read_date, rating, now, user.user_id, book_id]
            );
            // Get updated review with username
            const [updatedReview] = await db.query(
                `SELECT Users.username, Reviews.rating, Reviews.review_content, Reviews.created_at 
                 FROM Reviews 
                 INNER JOIN Users ON Reviews.user_id = Users.user_id
                 WHERE Reviews.book_id = ? AND Reviews.user_id = ?
                 ORDER BY Reviews.updated_at DESC
                 LIMIT 1`,
                [book_id, user.user_id]);

            return res.json({
                success: true,
                message: 'Review updated!',
                review: updatedReview
            });
        }

        // Insert new review
        await db.query(
            `INSERT INTO Reviews (user_id, book_id, review_content, user_read_date, rating, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user.user_id, book_id, review_content, user_read_date, rating, now, now]
        );

        // Get the full review with username
        const [newReview] = await db.query(`
            SELECT Users.username, Reviews.rating, Reviews.review_content, Reviews.created_at 
             FROM Reviews 
             INNER JOIN Users ON Reviews.user_id = Users.user_id
             WHERE Reviews.book_id = ? AND Reviews.user_id = ?
             ORDER BY Reviews.created_at DESC
             LIMIT 1`,          
            [book_id, user.user_id]);

        return res.json({ success: true, message: 'Review submitted!',  review: newReview });

    } catch (err) {
        console.error('Error in submitReview:', err);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
}

module.exports = { submitReview };