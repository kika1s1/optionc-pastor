# OptionC pastor site

React + Tailwind frontend with a Node.js API, SQLite database, and staff dashboard.

## Local development

```bash
npm install
npm run dev
```

- Site (Vite): http://localhost:5173
- API + built site: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard

Staff accounts live in `data/optionc.db` only. They are not stored in this repository. Create or reset a desk user with environment variables if the database has none yet:

```bash
STAFF_EMAIL=you@example.com STAFF_PASSWORD=at-least-12-chars npm start
```

## Production

```bash
npm run build
SESSION_SECRET=at-least-32-character-secret npm start
```

`NODE_ENV=production` refuses to start without `SESSION_SECRET`, and refuses to start if `dist/` has not been built.
