// ============================================================
//  config/database.js
//  Crée un pool de connexions MySQL réutilisable.
//  Un "pool" gère plusieurs connexions en parallèle —
//  bien plus efficace qu'une seule connexion.
// ============================================================

require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Nombre max de connexions simultanées
  connectionLimit: 10,

  // Reconnexion automatique si la connexion tombe
  waitForConnections: true,
  queueLimit: 0
});

// On exporte la version "promise" du pool
// pour pouvoir utiliser async/await dans les routes
const promisePool = pool.promise();
module.exports = pool.promise();

// Test de connexion au démarrage
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur de connexion MySQL :', err.message);
    console.error('   Vérifiez votre fichier .env et que MySQL est démarré.');
    return;
  }
  console.log('✅ Connecté à MySQL — base :', process.env.DB_NAME);
  connection.release(); // libérer la connexion après le test
});

module.exports = promisePool;
