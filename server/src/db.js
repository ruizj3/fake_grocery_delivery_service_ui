const { Pool } = require("pg");

/**
 * Creates and returns a PostgreSQL connection pool.
 * Supports both a full DATABASE_URL (for Render.com / hosted DBs)
 * and individual env vars (for local development).
 */
function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    return new Pool({
      connectionString,
      ssl:
        process.env.DB_SSL === "true"
          ? { rejectUnauthorized: false }
          : false,
    });
  }

  return new Pool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl:
      process.env.DB_SSL === "true"
        ? { rejectUnauthorized: false }
        : false,
  });
}

const pool = createPool();

// Without this, an idle client error (e.g. DB closing an idle connection)
// becomes an uncaught exception and crashes the whole process.
pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err.message);
});

module.exports = pool;
