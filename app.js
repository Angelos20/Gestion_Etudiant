require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./config/database');
const etudiantsRouter = require('./routes/etudiants');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ─────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ── Routes API ───────────────────────────
app.use('/etudiants', etudiantsRouter);

// ── Pages ────────────────────────────────
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/pages/accueil.html'))
);

app.get('/liste', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/pages/liste.html'))
);

app.get('/ajouter', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/pages/ajouter.html'))
);

app.get('/statistiques', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/pages/statistiques.html'))
);

// ── API statistiques ─────────────────────
app.get('/api/statistiques', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        AVG((note_math + note_phys)/2) AS moyenne_classe,
        MIN((note_math + note_phys)/2) AS moyenne_min,
        MAX((note_math + note_phys)/2) AS moyenne_max,
        SUM((note_math + note_phys)/2 >= 10) AS admis,
        SUM((note_math + note_phys)/2 < 10) AS redoublants
      FROM Etudiant
    `);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── Error handler ────────────────────────
app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err.message);
  res.status(500).json({ error: err.message });
});

// ── Sécurité crash ───────────────────────
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

// ── Start server ─────────────────────────
app.listen(PORT, () => {
  console.log("================================================");
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log("================================================");
});
