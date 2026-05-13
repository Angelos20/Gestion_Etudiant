// ============================================================
//  routes/etudiants.js
//  Routes CRUD — toutes les requêtes passent par MySQL
// ============================================================

const express = require('express');
const router  = express.Router();
const db      = require('../config/database');

// Calcul de la moyenne
const moy = (m, p) => parseFloat(((parseFloat(m) + parseFloat(p)) / 2).toFixed(2));

// ── Statistiques de la classe ────────────────────────────
async function getStats() {
  const [rows] = await db.query('SELECT note_math, note_phys FROM Etudiant');
  if (!rows.length) return null;

  const moyennes = rows.map(r => moy(r.note_math, r.note_phys));
  return {
    moyenne_classe:  parseFloat((moyennes.reduce((a,b)=>a+b,0) / moyennes.length).toFixed(2)),
    moyenne_min:     Math.min(...moyennes),
    moyenne_max:     Math.max(...moyennes),
    total:           rows.length,
    admis:           moyennes.filter(m => m >= 10).length,
    redoublants:     moyennes.filter(m => m <  10).length
  };
}

// ── GET /etudiants — liste complète ─────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT *, (note_math + note_phys)/2 AS moyenne FROM Etudiant ORDER BY numEt'
    );
    const stats = await getStats();
    res.json({ etudiants: rows, stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /etudiants/stats — statistiques seules ───────────
router.get('/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /etudiants/:numEt — un seul étudiant ────────────
router.get('/:numEt', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT *, (note_math + note_phys)/2 AS moyenne FROM Etudiant WHERE numEt = ?',
      [req.params.numEt]
    );
    if (!rows.length)
      return res.status(404).json({ error: `Étudiant ${req.params.numEt} introuvable` });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /etudiants — créer ──────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { numEt, nom, note_math, note_phys } = req.body;

    // Validation
    if (!numEt || !nom || note_math === undefined || note_phys === undefined)
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });

    const nm = parseFloat(note_math), np = parseFloat(note_phys);
    if (isNaN(nm)||isNaN(np)||nm<0||nm>20||np<0||np>20)
      return res.status(400).json({ error: 'Les notes doivent être entre 0 et 20.' });

    await db.query(
      'INSERT INTO Etudiant (numEt, nom, note_math, note_phys) VALUES (?, ?, ?, ?)',
      [numEt, nom, nm, np]
    );
    res.status(201).json({ message: 'Étudiant ajouté.', moyenne: moy(nm, np) });
  } catch (err) {
    // Code 1062 = doublon MySQL (clé primaire)
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: `Le numéro ${req.body.numEt} existe déjà.` });
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /etudiants/:numEt — modifier ────────────────────
router.put('/:numEt', async (req, res) => {
  try {
    const { nom, note_math, note_phys } = req.body;
    const nm = parseFloat(note_math), np = parseFloat(note_phys);

    if (isNaN(nm)||isNaN(np)||nm<0||nm>20||np<0||np>20)
      return res.status(400).json({ error: 'Notes invalides (0–20).' });

    const [result] = await db.query(
      'UPDATE Etudiant SET nom=?, note_math=?, note_phys=? WHERE numEt=?',
      [nom, nm, np, req.params.numEt]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: `Étudiant ${req.params.numEt} introuvable.` });

    res.json({ message: 'Étudiant modifié.', moyenne: moy(nm, np) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /etudiants/:numEt — supprimer ────────────────
router.delete('/:numEt', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM Etudiant WHERE numEt = ?',
      [req.params.numEt]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: `Étudiant ${req.params.numEt} introuvable.` });

    res.json({ message: `Étudiant ${req.params.numEt} supprimé.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
