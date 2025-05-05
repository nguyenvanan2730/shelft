const db = require('./db');

async function searchBooksByTitle(query) {
    const sql = `SELECT * FROM Books WHERE title LIKE ?`;
    const results = await db.query(sql, [`%${query}%`]);
    return results;
}

module.exports = { searchBooksByTitle };
