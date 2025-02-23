// public/js/dbTest.js
const db = require('./db');

async function getDbTestResults() {
    const sql = 'select * from test_table';
    try {
        const results = await db.query(sql);
        console.log(results);
        return results;
    } catch (err) {
        console.error(err);
        throw new Error('Database query failed');
    }
}

module.exports = {
    getDbTestResults,
};