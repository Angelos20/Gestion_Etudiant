-- ============================================================
--  config/init.sql
--  Exécutez ce fichier UNE SEULE FOIS pour créer la base
--  et la table Etudiant dans MySQL.
--
--  Commande : mysql -u root -p < config/init.sql
-- ============================================================

-- Créer la base si elle n'existe pas encore
CREATE DATABASE IF NOT EXISTS gestion_etudiant
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gestion_etudiant;

-- Créer la table Etudiant
CREATE TABLE IF NOT EXISTS Etudiant (
  numEt      VARCHAR(10)   NOT NULL PRIMARY KEY,   -- Numéro étudiant unique
  nom        VARCHAR(100)  NOT NULL,                -- Nom complet
  note_math  DECIMAL(4,2)  NOT NULL                 -- Note entre 0.00 et 20.00
               CHECK (note_math  BETWEEN 0 AND 20),
  note_phys  DECIMAL(4,2)  NOT NULL
               CHECK (note_phys  BETWEEN 0 AND 20),
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Insérer des données de démonstration
INSERT IGNORE INTO Etudiant (numEt, nom, note_math, note_phys) VALUES
  ('E001', 'Rakoto Jean',   14.00, 12.00),
  ('E002', 'Rabe Marie',     8.00,  9.00),
  ('E003', 'Rasoa Luc',     16.00, 18.00),
  ('E004', 'Andry Paul',     7.00,  6.00),
  ('E005', 'Hery Noeline',  13.00, 15.00),
  ('E006', 'Tiana Feno',    11.00, 10.50);

SELECT CONCAT('✅ Table Etudiant créée — ', COUNT(*), ' étudiants insérés.') AS status
FROM Etudiant;
