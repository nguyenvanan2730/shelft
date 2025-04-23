const db = require('./db');

/**
 * Get books in the user's library ordered by newest added
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} - Array of books in the user's library with relevant details
 */
async function getUserLibraryBooks(userId) {
    try {
        console.log(`Fetching library books for user ID: ${userId}`);
        
        // SQL query to get books from the user's library
        // Joins with Books table to get book details
        // Orders by added_at date in descending order (newest first)
        const query = `
            SELECT b.book_id, b.title, b.author, b.published_year, b.summary, b.cover_image, 
                   l.added_at, IFNULL(AVG(r.rating), 0) as average_rating
            FROM Libraries l
            JOIN Books b ON l.book_id = b.book_id
            LEFT JOIN Reviews r ON b.book_id = r.book_id
            WHERE l.user_id = ?
            GROUP BY b.book_id, l.added_at
            ORDER BY l.added_at DESC
        `;
        
        // Execute the query
        const libraryBooks = await db.query(query, [userId]);
        
        console.log(`Found ${libraryBooks.length} books in user's library`);
        
        // Debug: Log complete information about each book
        libraryBooks.forEach((book, index) => {
            console.log(`Book ${index + 1}:`, {
                id: book.book_id,
                title: book.title,
                author: book.author,
                cover_image: book.cover_image,
                added_at: book.added_at
            });
        });
        
        return libraryBooks;
    } catch (err) {
        console.error('Error fetching user library books:', err);
        throw new Error('Failed to fetch books from your library');
    }
}

/**
 * Get user's book reviews with ratings
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} - Array of reviews by the user
 */
async function getUserReviews(userId) {
    try {
        console.log(`Fetching reviews for user ID: ${userId}`);
        
        // SQL query to get reviews with book details
        const query = `
            SELECT r.review_id, r.rating, r.review_content, r.created_at,
                   b.book_id, b.title, b.author, b.cover_image
            FROM Reviews r
            JOIN Books b ON r.book_id = b.book_id
            WHERE r.user_id = ? AND r.review_content IS NOT NULL
            ORDER BY r.created_at DESC
        `;
        
        // Execute the query
        const reviews = await db.query(query, [userId]);
        
        console.log(`Found ${reviews.length} reviews by user`);
        return reviews;
    } catch (err) {
        console.error('Error fetching user reviews:', err);
        throw new Error('Failed to fetch your reviews');
    }
}

/**
 * Get user's book ratings without full reviews
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} - Array of ratings by the user
 */
async function getUserRatings(userId) {
    try {
        console.log(`Fetching ratings for user ID: ${userId}`);
        
        // SQL query to get ratings with book details
        const query = `
            SELECT r.review_id, r.rating, r.created_at,
                   b.book_id, b.title, b.author, b.cover_image
            FROM Reviews r
            JOIN Books b ON r.book_id = b.book_id
            WHERE r.user_id = ? AND r.rating IS NOT NULL
            ORDER BY r.created_at DESC
        `;
        
        // Execute the query
        const ratings = await db.query(query, [userId]);
        
        console.log(`Found ${ratings.length} ratings by user`);
        return ratings;
    } catch (err) {
        console.error('Error fetching user ratings:', err);
        throw new Error('Failed to fetch your ratings');
    }
}

/**
 * Get count of books in user's library
 * @param {number} userId - The ID of the user
 * @returns {Promise<number>} - Count of books
 */
async function getUserBookCount(userId) {
    try {
        const query = 'SELECT COUNT(*) as count FROM Libraries WHERE user_id = ?';
        const result = await db.query(query, [userId]);
        return result[0].count || 0;
    } catch (err) {
        console.error('Error fetching user book count:', err);
        throw new Error('Failed to fetch book count');
    }
}

module.exports = {
    getUserLibraryBooks,
    getUserReviews,
    getUserRatings,
    getUserBookCount
}; 