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

// ==========================================================
// Graphiques
// ==========================================================

let chartBar = null;
let chartPie = null;

// =========================
// Charger stats API
// =========================
async function chargerStats() {
  try {
    const res = await fetch('/api/statistiques');
    const stats = await res.json();
    console.log(stats);

    mettreAJourGraphiques(stats);

  } catch (err) {
    console.error(err);
  }
}

// =========================
// Graphiques
// =========================
function mettreAJourGraphiques(stats) {

  // BAR CHART
  const barData = {
    labels: ['Moy. Classe', 'Min', 'Max'],
    datasets: [{
      label: 'Moyennes',
      data: [
        stats.moyenne_classe,
        stats.moyenne_min,
        stats.moyenne_max
      ],
      backgroundColor: ['#6366f1', '#f87171', '#34d399'],
      borderRadius: 8
    }]
  };

  if (!chartBar) {
    chartBar = new Chart(document.getElementById('chartBar'), {
      type: 'bar',
      data: barData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });
  } else {
    chartBar.data = barData;
    chartBar.update();
  }

  // PIE CHART
  const pieData = {
    labels: ['Admis', 'Redoublants'],
    datasets: [{
      data: [stats.admis, stats.redoublants],
      backgroundColor: ['#34d399', '#f87171']
    }]
  };

  if (!chartPie) {
    chartPie = new Chart(document.getElementById('chartPie'), {
      type: 'pie',
      data: pieData,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  } else {
    chartPie.data = pieData;
    chartPie.update();
  }
}

// =========================
// Switch graphique (optionnel)
// =========================
function switchChart(type) {
  const bar = document.getElementById('chart-bar-wrap');
  const pie = document.getElementById('chart-pie-wrap');

  if (bar && pie) {
    bar.style.display = type === 'bar' ? 'block' : 'none';
    pie.style.display = type === 'pie' ? 'block' : 'none';
  }
}

// =========================
// Auto load
// =========================
document.addEventListener('DOMContentLoaded', () => {
  chargerStats();
});
