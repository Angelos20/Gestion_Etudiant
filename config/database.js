require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  connectTimeout: 10000
});

// test connexion
(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ MySQL connecté :', process.env.DB_NAME);
    conn.release();
  } catch (err) {
    console.error('❌ Erreur MySQL :', err.message);
  }
})();

module.exports = db;
