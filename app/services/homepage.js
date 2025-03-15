// public/js/dbTest.js
const db = require('./db');

// Main process to fetch books along with their review and save counts
async function getBooks() {
    // SQL query to select all books from the Books table
    const booksSql = 'SELECT * FROM Books';
    
    // SQL query to calculate the average rating for each book from the Reviews table
    const reviewCountSql = `
        SELECT book_id, AVG(rating) AS rating
        FROM Reviews 
        GROUP BY book_id
    `;
    
    // SQL query to count the number of saves for each book based on non-null review content
    const saveCountSql = `
        SELECT book_id, COUNT(CASE WHEN review_content IS NOT NULL THEN 1 END) AS review_num 
        FROM Reviews 
        GROUP BY book_id
    `;

    try {
        console.log('Fetching books...');
        // Execute the query to get all books
        const books = await db.query(booksSql);
        
        console.log('Fetching review counts...');
        // Execute the query to get average ratings for books
        const reviewCounts = await db.query(reviewCountSql);
        
        console.log('Fetching save counts...');
        // Execute the query to get save counts for books
        const saveCounts = await db.query(saveCountSql);

        // Create a map for review counts to easily access ratings by book_id
        const reviewCountMap = reviewCounts.reduce((map, row) => {
            map[row.book_id] = parseFloat(row.rating).toFixed(1);
            return map;
        }, {});

        // Create a map for save counts to easily access save counts by book_id
        const saveCountMap = saveCounts.reduce((map, row) => {
            map[row.book_id] = row.review_num;
            return map;
        }, {});

        console.log('Review count map:', reviewCountMap);
        console.log('Save count map:', saveCountMap);

        // Combine book data with their respective ratings and save counts
        const booksWithCounts = books.map(book => ({
            ...book,
            rating: reviewCountMap[book.book_id] || 0,
            review_num: saveCountMap[book.book_id] || 0 
        }));

        console.log('Books with counts:', booksWithCounts);
        return booksWithCounts;
    } catch (err) {
        console.error(err);
        throw new Error('Database query failed');
    }
}

module.exports = {
    getBooks,
};