const db = require('./db');
const authorization = require('../middlewares/authorization.js');


export async function submitReview(req, res) {
    const user = await authorization.checkCookie(req);
    if (!user) {
        return res.status(401).json({ message: 'You must be logged in to leave a review.' });
    }

    const { book_id, user_read_date, review_content, rating } = req.body;

    if (!book_id || !review_content || !user_read_date || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Please complete all fields including a star rating.' });
    }

    try {
        const selectedDate = new Date(user_read_date);
        const today = new Date();
        if (selectedDate > today) {
            return res.status(400).json({ message: 'Read date cannot be in the future.' });
        }

        const now = new Date();

        const [existing] = await db.query(
            'SELECT * FROM Reviews WHERE user_id = ? AND book_id = ?',
            [user.user_id, book_id]
        );

        if (existing.length > 0) {
            await db.query(
                `UPDATE Reviews
                 SET review_content = ?, user_read_date = ?, rating = ?, updated_at = ?
                 WHERE user_id = ? AND book_id = ?`,
                [review_content, user_read_date, rating, now, user.user_id, book_id]
            );
            return res.json({ success: true, message: 'Review updated!' });
        }

        await db.query(
            `INSERT INTO Reviews (user_id, book_id, review_content, user_read_date, rating, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user.user_id, book_id, review_content, user_read_date, rating, now, now]
        );

        return res.json({ success: true, message: 'Review submitted!' });

    } catch (err) {
        console.error('Error in submitReview:', err);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
}