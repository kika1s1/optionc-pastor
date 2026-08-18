'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');
const { hashPassword } = require('./passwords');

const STATUSES = new Set(['new', 'contacted']);

class Store {
  constructor(dbFile, seedUser) {
    fs.mkdirSync(path.dirname(dbFile), { recursive: true });
    this.db = new DatabaseSync(dbFile);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL,
        phone TEXT NOT NULL DEFAULT '',
        parish TEXT NOT NULL DEFAULT '',
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        status TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        parish TEXT NOT NULL,
        role TEXT NOT NULL,
        note TEXT NOT NULL DEFAULT '',
        intent TEXT NOT NULL
      );
    `);
    this.ensureUserColumns();
    if (seedUser) this.ensureUser(seedUser);
  }

  ensureUserColumns() {
    const cols = new Set(this.db.prepare('PRAGMA table_info(users)').all().map((col) => col.name));
    if (!cols.has('phone')) this.db.exec("ALTER TABLE users ADD COLUMN phone TEXT NOT NULL DEFAULT ''");
    if (!cols.has('parish')) this.db.exec("ALTER TABLE users ADD COLUMN parish TEXT NOT NULL DEFAULT ''");
  }

  close() {
    this.db.close();
  }

  ensureUser(user) {
    const email = String(user.email).trim().toLowerCase();
    const existing = this.findUserByEmail(email);
    if (existing) return existing;
    const row = {
      id: crypto.randomUUID(),
      name: user.name,
      email,
      role: user.role,
      password_hash: hashPassword(user.password),
      created_at: new Date().toISOString(),
    };
    this.db
      .prepare(
        'INSERT INTO users (id, name, email, role, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      )
      .run(row.id, row.name, row.email, row.role, row.password_hash, row.created_at);
    return this.findUserByEmail(email);
  }

  findUserById(id) {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) || null;
  }

  findUserByEmail(email) {
    return this.db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).toLowerCase()) || null;
  }

  publicUser(user) {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      parish: user.parish || '',
    };
  }

  updateUser(id, fields) {
    const user = this.findUserById(id);
    if (!user) return null;
    const passwordHash = fields.password ? hashPassword(fields.password) : user.password_hash;
    this.db
      .prepare(
        'UPDATE users SET name = ?, email = ?, role = ?, phone = ?, parish = ?, password_hash = ? WHERE id = ?',
      )
      .run(fields.name, fields.email, fields.role, fields.phone, fields.parish, passwordHash, id);
    return this.findUserById(id);
  }

  list() {
    return this.db
      .prepare('SELECT * FROM inquiries ORDER BY created_at DESC')
      .all()
      .map(mapInquiry);
  }

  create(fields) {
    const item = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      status: 'new',
      name: fields.name,
      email: fields.email,
      parish: fields.parish,
      role: fields.role,
      note: fields.note || '',
      intent: fields.intent,
    };
    this.db
      .prepare(
        'INSERT INTO inquiries (id, created_at, status, name, email, parish, role, note, intent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .run(
        item.id,
        item.created_at,
        item.status,
        item.name,
        item.email,
        item.parish,
        item.role,
        item.note,
        item.intent,
      );
    return mapInquiry(item);
  }

  updateStatus(id, status) {
    if (!STATUSES.has(status)) return null;
    const result = this.db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, id);
    if (result.changes === 0) return null;
    return mapInquiry(this.db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id));
  }
}

function mapInquiry(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    name: row.name,
    email: row.email,
    parish: row.parish,
    role: row.role,
    note: row.note,
    intent: row.intent,
  };
}

module.exports = { Store, STATUSES };
