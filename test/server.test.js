'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createApp } = require('../server');

const STAFF = {
  name: 'Test Desk',
  email: 'desk@example.test',
  role: 'Parish desk',
  password: 'TestDeskPassword1',
};

function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

async function start() {
  const dbFile = path.join(os.tmpdir(), `optionc-${Date.now()}-${Math.random()}.db`);
  const app = createApp({
    dbFile,
    secret: 'test-secret',
    seedUser: STAFF,
    staticDir: path.join(__dirname, '..', 'dist'),
  });
  const server = await listen(app);
  const { port } = server.address();
  return {
    dbFile,
    store: app.locals.store,
    server,
    base: `http://127.0.0.1:${port}`,
  };
}

function cleanup(ctx) {
  ctx.store.close();
  fs.rmSync(ctx.dbFile, { force: true });
  fs.rmSync(`${ctx.dbFile}-wal`, { force: true });
  fs.rmSync(`${ctx.dbFile}-shm`, { force: true });
}

test('serves the redesigned landing page and dashboard', async (t) => {
  const ctx = await start();
  t.after(async () => {
    await close(ctx.server);
    cleanup(ctx);
  });

  const home = await fetch(ctx.base + '/');
  const html = await home.text();
  assert.equal(home.status, 200);
  assert.match(html, /id="root"/);
  assert.match(html, /OptionC connects the family/);
  assert.doesNotMatch(html, /Nobody knows the family/);

  const dash = await fetch(ctx.base + '/dashboard');
  assert.equal(dash.status, 200);
  assert.match(await dash.text(), /id="root"/);

  const health = await fetch(ctx.base + '/health');
  assert.equal(health.status, 200);
});

test('accepts a form and shows it on the dashboard after login', async (t) => {
  const ctx = await start();
  t.after(async () => {
    await close(ctx.server);
    cleanup(ctx);
  });

  const created = await fetch(ctx.base + '/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Fr. Michael Dolan',
      email: 'pastor@stathanasius.example',
      parish: 'St. Athanasius Parish',
      role: 'Pastor',
      note: 'Please send the Saturday overview.',
      intent: 'overview',
    }),
  });
  assert.equal(created.status, 201);

  const locked = await fetch(ctx.base + '/api/inquiries');
  assert.equal(locked.status, 401);

  const denied = await fetch(ctx.base + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: STAFF.email, password: 'wrong-password' }),
  });
  assert.equal(denied.status, 401);

  const missingEmail = await fetch(ctx.base + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: STAFF.password }),
  });
  assert.equal(missingEmail.status, 401);

  const login = await fetch(ctx.base + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: STAFF.email, password: STAFF.password }),
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie');
  assert.ok(cookie && cookie.includes('oc_dash='));
  assert.equal((await login.json()).user.email, STAFF.email);

  const session = await fetch(ctx.base + '/api/session', { headers: { Cookie: cookie } });
  assert.equal(session.status, 200);
  assert.equal((await session.json()).user.name, STAFF.name);

  const list = await fetch(ctx.base + '/api/inquiries', { headers: { Cookie: cookie } });
  assert.equal(list.status, 200);
  const payload = await list.json();
  assert.equal(payload.inquiries.length, 1);
  assert.equal(payload.inquiries[0].name, 'Fr. Michael Dolan');
  assert.equal(payload.inquiries[0].intent, 'overview');
  assert.equal(payload.inquiries[0].status, 'new');

  const updated = await fetch(ctx.base + '/api/inquiries/' + payload.inquiries[0].id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ status: 'contacted' }),
  });
  assert.equal(updated.status, 200);
  assert.equal((await updated.json()).inquiry.status, 'contacted');
});

test('production start refuses weak secrets', () => {
  const { resolveRuntimeOptions } = require('../server');
  assert.throws(
    () => resolveRuntimeOptions({ NODE_ENV: 'production', SESSION_SECRET: 'tiny' }),
    /SESSION_SECRET/,
  );
  assert.throws(
    () =>
      resolveRuntimeOptions({
        NODE_ENV: 'production',
        STAFF_EMAIL: 'desk@example.test',
        STAFF_PASSWORD: 'short',
        SESSION_SECRET: 'a'.repeat(32),
      }),
    /STAFF_PASSWORD/,
  );
  const runtime = resolveRuntimeOptions({
    NODE_ENV: 'production',
    SESSION_SECRET: 'a'.repeat(32),
  });
  assert.equal(runtime.secureCookies, true);
  assert.equal(runtime.seedUser, null);
});

test('updates staff profile details and password', async (t) => {
  const ctx = await start();
  t.after(async () => {
    await close(ctx.server);
    cleanup(ctx);
  });

  ctx.store.ensureUser({
    name: 'Second Desk',
    email: 'other@optionc.com',
    role: 'Office',
    password: 'TestDeskPassword1',
  });

  const locked = await fetch(ctx.base + '/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'No One' }),
  });
  assert.equal(locked.status, 401);

  const login = await fetch(ctx.base + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: STAFF.email, password: STAFF.password }),
  });
  const cookie = login.headers.get('set-cookie');

  const details = await fetch(ctx.base + '/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      name: 'Clare M. Brennan',
      email: STAFF.email,
      role: 'Parish Relations Director',
      phone: '(216) 555-0142',
      parish: 'OptionC parish desk',
    }),
  });
  assert.equal(details.status, 200);
  const saved = await details.json();
  assert.equal(saved.user.name, 'Clare M. Brennan');
  assert.equal(saved.user.role, 'Parish Relations Director');
  assert.equal(saved.user.phone, '(216) 555-0142');
  assert.equal(saved.user.parish, 'OptionC parish desk');

  const taken = await fetch(ctx.base + '/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      name: 'Clare M. Brennan',
      email: 'other@optionc.com',
      role: 'Parish Relations Director',
      currentPassword: STAFF.password,
    }),
  });
  assert.equal(taken.status, 409);

  const badPassword = await fetch(ctx.base + '/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      name: 'Clare M. Brennan',
      email: STAFF.email,
      role: 'Parish Relations Director',
      currentPassword: 'wrong-password',
      newPassword: 'NewParishDesk1',
      confirmPassword: 'NewParishDesk1',
    }),
  });
  assert.equal(badPassword.status, 400);

  const changed = await fetch(ctx.base + '/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      name: 'Clare M. Brennan',
      email: 'clare@optionc.com',
      role: 'Parish Relations Director',
      phone: '(216) 555-0142',
      parish: 'OptionC parish desk',
      currentPassword: STAFF.password,
      newPassword: 'NewParishDesk1',
      confirmPassword: 'NewParishDesk1',
    }),
  });
  assert.equal(changed.status, 200);
  assert.equal((await changed.json()).user.email, 'clare@optionc.com');

  const oldLogin = await fetch(ctx.base + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: STAFF.email, password: STAFF.password }),
  });
  assert.equal(oldLogin.status, 401);

  const newLogin = await fetch(ctx.base + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'clare@optionc.com', password: 'NewParishDesk1' }),
  });
  assert.equal(newLogin.status, 200);
});

test('rejects an incomplete form', async (t) => {
  const ctx = await start();
  t.after(async () => {
    await close(ctx.server);
    cleanup(ctx);
  });

  const res = await fetch(ctx.base + '/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'A', email: 'not-an-email', parish: '', role: '', intent: 'demo' }),
  });
  assert.equal(res.status, 400);
});
