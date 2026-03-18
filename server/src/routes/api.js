const express = require("express");
const pool = require("../db");
const { isReadOnlyQuery } = require("../queryValidator");

const router = express.Router();

// ---------------------------------------------------------------
// GET /api/tables — list all user tables in the public schema
// ---------------------------------------------------------------
router.get("/tables", async (_req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT table_name
         FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
        ORDER BY table_name`
    );
    res.json({ tables: result.rows.map((r) => r.table_name) });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------
// GET /api/tables/:name — return all rows for a given table
//   Supports ?limit=N&offset=N for pagination (defaults: 100 / 0)
// ---------------------------------------------------------------
router.get("/tables/:name", async (req, res, next) => {
  try {
    const tableName = req.params.name;

    // Whitelist check: make sure the table actually exists
    const tableCheck = await pool.query(
      `SELECT 1
         FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
          AND table_name = $1`,
      [tableName]
    );

    if (tableCheck.rowCount === 0) {
      return res.status(404).json({ error: "Table not found" });
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 1000);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    // Safe: table name is validated above against information_schema
    const countResult = await pool.query(
      `SELECT COUNT(*) AS total FROM "${tableName}"`
    );
    const dataResult = await pool.query(
      `SELECT * FROM "${tableName}" LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      table: tableName,
      total: parseInt(countResult.rows[0].total, 10),
      limit,
      offset,
      columns: dataResult.fields.map((f) => f.name),
      rows: dataResult.rows,
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------
// POST /api/query — execute a custom read-only SQL query
//   Body: { sql: "SELECT ...", params: [] }
//   Only SELECT / WITH statements are allowed.
//   Use $1, $2, … placeholders for parameterised queries.
// ---------------------------------------------------------------
router.post("/query", async (req, res, next) => {
  try {
    const { sql, params = [] } = req.body;

    if (!isReadOnlyQuery(sql)) {
      return res
        .status(403)
        .json({ error: "Only read-only SELECT queries are allowed." });
    }

    const result = await pool.query(sql, params);

    res.json({
      columns: result.fields.map((f) => f.name),
      rows: result.rows,
      rowCount: result.rowCount,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
