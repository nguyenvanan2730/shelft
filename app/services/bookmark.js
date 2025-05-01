const db = require('./db');
const authorization = require('../middlewares/authorization.js').methods;

async function addToLibrary(req, res) {
    try {
        const user = await authorization.checkCookie(req);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Please log in.' });
        }

        const { book_id } = req.body;
        if (!book_id) {
            return res.status(400).json({ success: false, message: 'Missing book ID.' });
        }

        const now = new Date();

        await db.query(
            `INSERT INTO Libraries (user_id, book_id, added_at)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE added_at = VALUES(added_at)`,
            [user.user_id, book_id, now]
        );

        res.json({ success: true, message: 'Book added to your library!' });
    } catch (err) {
        console.error('Error adding to library:', err);
        res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
}

async function removeFromLibrary(req, res) {
    try {
        const user = await authorization.checkCookie(req);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Please log in.' });
        }

        const { book_id } = req.body;
        if (!book_id) {
            return res.status(400).json({ success: false, message: 'Missing book ID.' });
        }

        await db.query(
            `DELETE FROM Libraries WHERE user_id = ? AND book_id = ?`,
            [user.user_id, book_id]
        );

        res.json({ success: true, message: 'Book removed from your library.' });
    } catch (err) {
        console.error('Error removing from library:', err);
        res.status(500).json({ success: false, message: 'Something went wrong.' });
    }
}

// Check if a book is in the user's library
async function isBookInLibrary(userId, bookId) {
    try {
        if (!userId || !bookId) {
            return false;
        }
        
        const result = await db.query(
            `SELECT * FROM Libraries WHERE user_id = ? AND book_id = ?`,
            [userId, bookId]
        );
        
        return result.length > 0;
    } catch (err) {
        console.error('Error checking if book is in library:', err);
        return false;
    }
}

module.exports = { addToLibrary, removeFromLibrary, isBookInLibrary };