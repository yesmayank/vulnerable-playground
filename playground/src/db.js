// INTENTIONALLY VULNERABLE — DO NOT DEPLOY

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DEFAULT_DB_PATH = path.join(__dirname, '..', 'data', 'lab.db');

function getDatabasePath() {
  return process.env.DATABASE_PATH || DEFAULT_DB_PATH;
}

function initDatabase() {
  const dbPath = getDatabasePath();
  const dataDir = path.dirname(dbPath);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const isNew = !fs.existsSync(dbPath);
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT DEFAULT 'guest',
      body TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  if (isNew) {
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const seedPath = path.join(__dirname, '..', 'db', 'seed.sql');
    db.exec(fs.readFileSync(schemaPath, 'utf8'));
    db.exec(fs.readFileSync(seedPath, 'utf8'));
  }

  return db;
}

module.exports = { initDatabase, getDatabasePath };
