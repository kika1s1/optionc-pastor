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

### Staff login

| Field | Value |
| --- | --- |
| Email | `staff@optionc.com` |
| Password | `ParishOffice2026` |

The first start creates that user in `data/optionc.db`. Change it with `STAFF_EMAIL`, `STAFF_PASSWORD`, `STAFF_NAME`, and `STAFF_ROLE`.

## Production

```bash
npm run build
STAFF_PASSWORD=at-least-12-chars SESSION_SECRET=at-least-32-character-secret npm start
```

`NODE_ENV=production` refuses to start without those secrets, and refuses to start if `dist/` has not been built.
