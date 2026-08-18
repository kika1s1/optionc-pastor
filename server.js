'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const { Store } = require('./lib/store');
const { verifyPassword } = require('./lib/passwords');
const {
  signSession,
  readSession,
  setSessionCookie,
  clearSessionCookie,
} = require('./lib/auth');

const ROLES = [
  'Pastor',
  'Parochial Vicar',
  'Parish Administrator',
  'Principal',
  'President',
  'Business Manager',
  'Director of Religious Education',
  'Other',
];
const INTENTS = new Set(['overview', 'walkthrough']);
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 10;

function resolveRuntimeOptions(env = process.env) {
  const isProd = env.NODE_ENV === 'production';
  const staffEmail = String(env.STAFF_EMAIL || 'staff@optionc.com').trim().toLowerCase();
  const staffPassword = env.STAFF_PASSWORD || env.DASHBOARD_PASSWORD || (isProd ? '' : 'ParishOffice2026');

  if (isProd) {
    if (!staffPassword || staffPassword.length < 12) {
      throw new Error('STAFF_PASSWORD must be at least 12 characters in production.');
    }
    if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
      throw new Error('SESSION_SECRET must be at least 32 characters in production.');
    }
  }

  return {
    secret: env.SESSION_SECRET || 'optionc-dev-secret',
    secureCookies: isProd,
    seedUser: {
      name: env.STAFF_NAME || 'Clare Brennan',
      email: staffEmail,
      role: env.STAFF_ROLE || 'Director of Parish Relations',
      password: staffPassword,
    },
  };
}

function createApp(options) {
  const store = new Store(options.dbFile, options.seedUser);
  const secret = options.secret;
  const secureCookies = Boolean(options.secureCookies);
  const staticDir = options.staticDir || path.join(__dirname, 'dist');
  const hits = new Map();
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });
  app.use(express.json({ limit: '32kb' }));
  app.use(express.urlencoded({ extended: false, limit: '32kb' }));

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/login', (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const user = store.findUserByEmail(email);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Email or password is incorrect.' });
    }
    setSessionCookie(res, signSession(secret, user.id), { secure: secureCookies });
    res.json({ ok: true, user: store.publicUser(user) });
  });

  app.post('/api/logout', (_req, res) => {
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  app.get('/api/session', (req, res) => {
    const user = currentUser(req, secret, store);
    if (!user) return res.status(401).json({ error: 'Sign in to continue.' });
    res.json({ user: store.publicUser(user) });
  });

  app.patch('/api/profile', (req, res) => {
    const user = currentUser(req, secret, store);
    if (!user) return res.status(401).json({ error: 'Sign in to edit your profile.' });
    const parsed = parseProfile(req.body, user, store);
    if (parsed.error) return res.status(parsed.status || 400).json({ error: parsed.error });
    const updated = store.updateUser(user.id, parsed);
    res.json({ ok: true, user: store.publicUser(updated) });
  });

  app.post('/api/inquiries', (req, res) => {
    if (overLimit(hits, clientKey(req))) {
      return res.status(429).json({ error: 'Please wait a few minutes and try again.' });
    }
    const parsed = parseInquiry(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const item = store.create(parsed);
    res.status(201).json({ ok: true, id: item.id, intent: item.intent });
  });

  app.get('/api/inquiries', (req, res) => {
    if (!currentUser(req, secret, store)) return res.status(401).json({ error: 'Sign in to view inquiries.' });
    res.json({ inquiries: store.list() });
  });

  app.patch('/api/inquiries/:id', (req, res) => {
    if (!currentUser(req, secret, store)) return res.status(401).json({ error: 'Sign in to update inquiries.' });
    const item = store.updateStatus(req.params.id, String(req.body.status || ''));
    if (!item) return res.status(400).json({ error: 'Could not update that inquiry.' });
    res.json({ inquiry: item });
  });

  if (fs.existsSync(staticDir)) {
    app.use(express.static(staticDir, { index: false, maxAge: options.cacheStatic ? '7d' : 0 }));
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      if (req.path.startsWith('/api') || req.path === '/health') return next();
      if (path.extname(req.path)) return next();
      res.sendFile(path.join(staticDir, 'index.html'));
    });
  }

  app.locals.store = store;
  return app;
}

function currentUser(req, secret, store) {
  const session = readSession(req, secret);
  if (!session) return null;
  return store.findUserById(session.userId);
}

function clientKey(req) {
  return req.ip || req.headers['x-forwarded-for'] || 'local';
}

function overLimit(hits, key) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((time) => now - time < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > RATE_LIMIT;
}

function parseProfile(body, user, store) {
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const role = String(body.role || '').trim();
  const phone = String(body.phone || '').trim();
  const parish = String(body.parish || '').trim();
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '');
  const confirmPassword = String(body.confirmPassword || '');

  if (name.length < 2 || name.length > 120) return { error: 'Please enter your name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return { error: 'Please enter a valid work email.' };
  }
  if (role.length < 2 || role.length > 120) return { error: 'Please enter your job title.' };
  if (phone && !/^[0-9+().\s-]{7,40}$/.test(phone)) return { error: 'Please enter a valid phone number.' };
  if (parish.length > 200) return { error: 'Please keep the parish or office name shorter.' };

  const other = store.findUserByEmail(email);
  if (other && other.id !== user.id) return { status: 409, error: 'That email is already in use.' };

  const emailChanged = email !== user.email;
  const changingPassword = Boolean(newPassword || confirmPassword);

  if (emailChanged || changingPassword) {
    if (!verifyPassword(currentPassword, user.password_hash)) {
      return { error: 'Current password is incorrect.' };
    }
  }

  if (changingPassword) {
    if (newPassword.length < 12) return { error: 'New password must be at least 12 characters.' };
    if (newPassword.length > 200) return { error: 'Please choose a shorter password.' };
    if (newPassword !== confirmPassword) return { error: 'New password and confirmation do not match.' };
    if (verifyPassword(newPassword, user.password_hash)) {
      return { error: 'New password must be different from the current password.' };
    }
  }

  return {
    name,
    email,
    role,
    phone,
    parish,
    password: changingPassword ? newPassword : '',
  };
}

function parseInquiry(body) {
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const parish = String(body.parish || '').trim();
  const role = String(body.role || '').trim();
  const note = String(body.note || '').trim();
  const intent = String(body.intent || 'overview').trim();

  if (name.length < 2 || name.length > 120) return { error: 'Please enter your name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return { error: 'Please enter a valid email.' };
  }
  if (parish.length < 2 || parish.length > 200) return { error: 'Please enter your parish or school.' };
  if (!ROLES.includes(role)) return { error: 'Please select your role.' };
  if (!INTENTS.has(intent)) return { error: 'Please choose the overview or a walkthrough.' };
  if (note.length > 2000) return { error: 'Please keep your note under 2,000 characters.' };

  return { name, email, parish, role, note, intent };
}

if (require.main === module) {
  const runtime = resolveRuntimeOptions();
  const dist = path.join(__dirname, 'dist');
  if (process.env.NODE_ENV === 'production' && !fs.existsSync(path.join(dist, 'index.html'))) {
    throw new Error('Run `npm run build` before starting in production.');
  }
  const port = Number(process.env.PORT) || 3000;
  createApp({
    dbFile: path.join(__dirname, 'data', 'optionc.db'),
    staticDir: dist,
    cacheStatic: process.env.NODE_ENV === 'production',
    ...runtime,
  }).listen(port, () => {
    console.log(`OptionC listening on http://localhost:${port}`);
    console.log(`Dashboard: http://localhost:${port}/dashboard`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Staff login: ${runtime.seedUser.email} / ${runtime.seedUser.password}`);
    }
  });
}

module.exports = { createApp, ROLES, resolveRuntimeOptions };
