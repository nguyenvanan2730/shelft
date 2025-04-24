// public/js/dbTest.js
const db = require('./db');

// Fetching individual book details from the database
async function getBookById(bookId) {
    const bookSql = 'SELECT * FROM Books WHERE book_id = ?';
    const reviewsSql = `
        SELECT Users.username, Reviews.rating, Reviews.review_content, Reviews.created_at 
        FROM Reviews 
        INNER JOIN Users ON Reviews.user_id = Users.user_id
        WHERE Reviews.book_id = ?
        ORDER BY Reviews.created_at DESC
    `;
    try {
        console.log("Fetching book with ID:", bookId); 
        const bookResults = await db.query(bookSql, [bookId]);
        console.log("Book query result:", bookResults);

        const reviewResults = await db.query(reviewsSql, [bookId]);
        console.log("Review query result:", reviewResults);

        // No book found with that ID.
        if (bookResults.length === 0) {
            console.warn("No book found for ID:", bookId);
            return null; 
        }

        return {
            book: bookResults[0],
            reviews: reviewResults
        };
    } catch (err) {
        console.error("Error fetching book detail:", err);
        throw new Error('Failed to fetch book detail');
    }
}

module.exports = { getBookById };