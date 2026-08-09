require('dotenv').config(); 

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 4000,
    multipleStatements: process.env.DB_MULTIPLE_STATEMENTS === 'true',
    ssl: process.env.DB_HOST === 'localhost' ? false : {
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promisify để dùng async/await hoặc dùng callback bình thường
const db = pool;

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Lỗi kết nối database pool:', err.stack);
        return;
    }
    console.log('Kết nối database pool thành công với ID ' + connection.threadId);
    connection.release(); // Giải phóng connection ngay sau khi test
});

module.exports = db;
