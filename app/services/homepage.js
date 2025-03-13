// public/js/dbTest.js
const db = require('./db');

async function getBooks() {
    const booksSql = 'SELECT * FROM Books';
    const reviewCountSql = `
        SELECT book_id, AVG(rating) AS rating 
        FROM Reviews 
        GROUP BY book_id
    `;
    const saveCountSql = `
        SELECT book_id, COUNT(*) AS save_count 
        FROM Libraries 
        GROUP BY book_id
    `;

    try {
        console.log('Fetching books...');
        const books = await db.query(booksSql);
        console.log('Fetching review counts...');
        const reviewCounts = await db.query(reviewCountSql);
        console.log('Fetching save counts...');
        const saveCounts = await db.query(saveCountSql);

        // Create a map for review counts
        const reviewCountMap = reviewCounts.reduce((map, row) => {
            map[row.book_id] = parseFloat(row.rating).toFixed(1);
            return map;
        }, {});

        // Create a map for save counts
        const saveCountMap = saveCounts.reduce((map, row) => {
            map[row.book_id] = row.save_count;
            return map;
        }, {});

        console.log('Review count map:', reviewCountMap);
        console.log('Save count map:', saveCountMap);

        // Add rating and save_count to each book
        const booksWithCounts = books.map(book => ({
            ...book,
            rating: reviewCountMap[book.book_id] || 0,
            save_count: saveCountMap[book.book_id] || 0
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