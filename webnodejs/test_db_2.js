require('dotenv').config({path: '.env'});
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 4000,
    ssl: { rejectUnauthorized: true }
});

db.query('SELECT * FROM employee LIMIT 5', (err, results) => {
    if (err) console.error(err);
    else console.log('Employees:', results);
    process.exit(0);
});
