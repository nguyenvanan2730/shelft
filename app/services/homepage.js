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


 // Fetches the book genres preferred by the user and returns a list of book IDs
async function getBookGenres(user) {
    try {
        console.log("Fetching book recommendations for user:", user.user_id);
        
        // SQL query to get user's preferred genres
        const userGenresSql = `
            SELECT genre_id 
            FROM User_Genres 
            WHERE user_id = ?
        `;
        
        // Execute query to get user's genres
        const userGenres = await db.query(userGenresSql, [user.user_id]);
        
        // If user has no genres, return an empty array
        if (userGenres.length === 0) {
            console.log("User has no preferred genres");
            return [];
        }
        
        // Extract genre IDs from the result
        const genreIds = userGenres.map(genre => genre.genre_id);
        console.log("User's preferred genres:", genreIds);
        
        // SQL query to get books matching user's genres
        // Using IN operator with placeholders for the genre IDs
        const bookGenresSql = `
            SELECT DISTINCT book_id 
            FROM Book_Genres 
            WHERE genre_id IN (${genreIds.map(() => '?').join(',')})
        `;
        
        // Execute query to get matching books
        const matchingBooks = await db.query(bookGenresSql, genreIds);
        
        // Extract book IDs from the result
        const bookIds = matchingBooks.map(book => book.book_id);
        console.log("Found matching books:", bookIds.length);
        
        return bookIds;
    } catch (err) {
        console.error("Error fetching book recommendations:", err);
        throw new Error('Failed to fetch book recommendations');
    }
}

module.exports = {
    getBooks,
    getBookGenres,
};