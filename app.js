// ============================================================
//  app.js — Serveur Express principal
// ============================================================

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const etudiantsRouter = require('./routes/etudiants');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ── API Routes ───────────────────────────────────────────
app.use('/etudiants', etudiantsRouter);

// ── Pages frontend — chaque URL sert son propre HTML ────
// Express sert directement les fichiers statiques depuis /public
// Les pages sont dans /public/pages/
app.get('/liste',       (req, res) => res.sendFile(path.join(__dirname, 'public/pages/liste.html')));
app.get('/ajouter',     (req, res) => res.sendFile(path.join(__dirname, 'public/pages/ajouter.html')));
app.get('/statistiques',(req, res) => res.sendFile(path.join(__dirname, 'public/pages/statistiques.html')));
app.get('/',            (req, res) => res.sendFile(path.join(__dirname, 'public/pages/accueil.html')));
app.get('/api/statistiques', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        AVG(moyenne) AS moyenne_classe,
        MIN(moyenne) AS moyenne_min,
        MAX(moyenne) AS moyenne_max,
        SUM(moyenne >= 10) AS admis,
        SUM(moyenne < 10) AS redoublants
      FROM etudiants
    `);

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ── Gestion des erreurs ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err.message);
  res.status(500).json({ error: err.message });
});

// ── Démarrage ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n================================================');
  console.log(`  🚀 Serveur     : http://192.168.43.45:${PORT}`);
  console.log(`  📋 Liste       : http://192.168.43.45:${PORT}/liste`);
  console.log(`  ➕ Ajouter     : http://192.168.43.45:${PORT}/ajouter`);
  console.log(`  📊 Statistiques: http://192.168.43.45:${PORT}/statistiques`);
  console.log('================================================\n');
});
