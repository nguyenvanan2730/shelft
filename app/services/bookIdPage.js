// public/js/dbTest.js
const db = require('./db');
const authorization = require('../middlewares/authorization.js').methods;

// Fetching individual book details from the database
async function getBookById(req, bookId) {
    const user = await authorization.checkCookie(req);
    const userId = user ? user.user_id : null;

    const bookSql = 'SELECT * FROM Books WHERE book_id = ?';
    const reviewsSql = `
        SELECT Users.username, Reviews.rating, Reviews.review_content, Reviews.created_at 
        FROM Reviews 
        INNER JOIN Users ON Reviews.user_id = Users.user_id
        WHERE Reviews.book_id = ?
        ORDER BY Reviews.created_at DESC
    `;

    const userReviewSql = `
        SELECT rating FROM Reviews WHERE book_id = ? AND user_id = ? LIMIT 1
    `;
    try {
        console.log("Fetching book with ID:", bookId); 
        const bookResults = await db.query(bookSql, [bookId]);

        const reviewResults = await db.query(reviewsSql, [bookId]);
    

        // No book found with that ID.
        if (bookResults.length === 0) {
            console.warn("No book found for ID:", bookId);
            return null; 
        }
        let userRating = null;
        if (userId) {
            const result = await db.query(userReviewSql, [bookId, userId]);
            if (result.length > 0) {
                userRating = result[0].rating;
            }
        }



        return {
            book: bookResults[0],
            reviews: reviewResults,
            userRating
        };
    } catch (err) {
        console.error("Error fetching book detail:", err);
        throw new Error('Failed to fetch book detail');
    }
}

module.exports = { getBookById };