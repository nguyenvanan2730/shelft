const db = require('./db');
const authorization = require('../middlewares/authorization.js');


exports.submitReview = async (req, res) => {
    const user = await authorization.checkCookie(req);
    if (!user) {
        return res.status(401).json({ message: 'You must be logged in to leave a review.' });
    }

    const { book_id, user_read_date, review_content, rating } = req.body;

    if (!book_id || !review_content || !user_read_date || !rating) {
        return res.status(400).json({ message: 'Please fill in all fields including your rating.' });
    }

    const parsedRating = parseInt(rating);
    if (parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        const selectedDate = new Date(user_read_date);
        const now = new Date();

        if (selectedDate > now) {
            return res.status(400).json({ message: 'Read date cannot be in the future.' });
        }

        const [existing] = await db.query(
            'SELECT * FROM Reviews WHERE user_id = ? AND book_id = ?',
            [user.user_id, book_id]
        );

        if (existing.length > 0) {
            await db.query(
                `UPDATE Reviews
                 SET review_content = ?, user_read_date = ?, rating = ?, updated_at = ?
                 WHERE user_id = ? AND book_id = ?`,
                [review_content, user_read_date, parsedRating, now, user.user_id, book_id]
            );
            return res.json({ message: 'Review updated with rating!', success: true });
        }

        await db.query(
            `INSERT INTO Reviews (user_id, book_id, review_content, user_read_date, rating, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user.user_id, book_id, review_content, user_read_date, parsedRating, now, now]
        );

        res.json({ message: 'Review and rating submitted!', success: true });
    } catch (err) {
        console.error('Error submitting review:', err);
        res.status(500).json({ message: 'Error submitting review.' });
    }
};