# Fake Grocery Delivery Service — UI

A read-only React/Redux dashboard for browsing data in the Fake Grocery Delivery Service PostgreSQL database.

## Architecture

```
├── server/          Express API (Node.js + pg)
│   └── src/
│       ├── index.js          Server entry point
│       ├── db.js             PostgreSQL connection pool
│       ├── queryValidator.js SQL validation (SELECT-only)
│       └── routes/api.js     REST endpoints
├── client/          React + Redux frontend
│   └── src/
│       ├── App.js            Root component
│       ├── api.js            Fetch wrapper
│       ├── store.js          Redux store
│       ├── slices/           Redux Toolkit slices
│       └── components/       UI components
```

## Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment variables

```bash
# Server — copy the example and fill in your credentials
cp server/.env.example server/.env

# Client (optional — defaults work for local dev)
cp client/.env.example client/.env
```

Edit `server/.env` with your database credentials:

- **Local PostgreSQL**: set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- **Render.com**: set `DATABASE_URL` to your external connection string and `DB_SSL=true`

> ⚠️ **Never commit `.env` files.** They are already in `.gitignore`.

### 3. Run in development

```bash
# Start both server (port 3001) and client (port 3000)
npm run dev
```

Or run them separately:

```bash
npm run dev:server   # Express API on :3001
npm run dev:client   # React dev server on :3000
```

## API Endpoints

| Method | Path               | Description                          |
| ------ | ------------------ | ------------------------------------ |
| GET    | `/api/tables`      | List all tables in `public` schema   |
| GET    | `/api/tables/:name`| Fetch rows (supports `?limit=&offset=`) |
| POST   | `/api/query`       | Execute a custom SELECT query        |
| GET    | `/health`          | Health check                         |

## Security

- **SELECT-only enforcement** — the query validator rejects any SQL containing mutation keywords (`INSERT`, `UPDATE`, `DELETE`, `DROP`, etc.)
- **Parameterised queries** — all user-supplied values go through `pg`'s parameterised query interface (`$1`, `$2`, …) to prevent SQL injection
- **Table name whitelisting** — the `/tables/:name` endpoint validates table names against `information_schema` before querying
- **Helmet** — sets secure HTTP headers
- **CORS** — restricted to the configured origin
- **Rate limiting** — 60 requests per minute per IP
- **Environment variables** — credentials stored in `.env`, excluded from version control

> **Tip:** For maximum safety, connect to the database with a PostgreSQL role that only has `SELECT` privileges.
