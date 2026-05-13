// ==========================================================
//  public/js/app.js — Fonctions utilitaires partagées
// ==========================================================

const API = '/etudiants';

// ── Marquer le lien actif dans la nav ──────────────────
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === path) link.classList.add('active');
  });
});

// ── Notification ───────────────────────────────────────
function notif(msg, type = 'success') {
  let el = document.getElementById('notif');
  if (!el) {
    el = document.createElement('div');
    el.id = 'notif';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = type;
  el.style.display = 'block';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.style.display = 'none', 3500);
}

// ── Fetch helpers ───────────────────────────────────────
async function apiGet(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur serveur');
  return data;
}

async function apiPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur serveur');
  return data;
}

async function apiPut(url, body) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur serveur');
  return data;
}

async function apiDelete(url) {
  const res = await fetch(url, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur serveur');
  return data;
}

// ── Spinner ─────────────────────────────────────────────
function showLoading(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="loading"><div class="spinner"></div>Chargement...</div>`;
}

// Graphiques
let chartBar, chartPie;

function mettreAJourGraphiques(stats) {

  const barData = {
    labels: ['Moy. Classe', 'Min', 'Max'],
    datasets: [{
      data: [stats.moyenne_classe, stats.moyenne_min, stats.moyenne_max]
    }]
  };

  if (!chartBar) {
    chartBar = new Chart(document.getElementById('chartBar'), {
      type: 'bar',
      data: barData
    });
  } else {
    chartBar.data = barData;
    chartBar.update();
  }

  const pieData = {
    labels: ['Admis', 'Redoublants'],
    datasets: [{
      data: [stats.admis, stats.redoublants]
    }]
  };

  if (!chartPie) {
    chartPie = new Chart(document.getElementById('chartPie'), {
      type: 'pie',
      data: pieData
    });
  } else {
    chartPie.data = pieData;
    chartPie.update();
  }
}

async function chargerStats() {
  try {
    const res = await fetch('/api/statistiques');
    const stats = await res.json();
    mettreAJourGraphiques(stats);
  } catch (err) {
    console.error(err);
  }
}
// Auto load
document.addEventListener('DOMContentLoaded', () => {
  chargerStats();
});
