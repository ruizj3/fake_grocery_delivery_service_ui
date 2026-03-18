/**
 * SQL query validation utilities.
 *
 * Only SELECT statements are allowed — no INSERT, UPDATE, DELETE, DROP,
 * ALTER, TRUNCATE, CREATE, GRANT, REVOKE, etc.
 *
 * This acts as a defense-in-depth layer. The database user itself should
 * also be configured with read-only permissions.
 */

// Statements that must NEVER be executed through this UI
const FORBIDDEN_KEYWORDS = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "ALTER",
  "TRUNCATE",
  "CREATE",
  "GRANT",
  "REVOKE",
  "EXECUTE",
  "EXEC",
  "COPY",
  "LOAD",
  "VACUUM",
  "COMMENT",
  "LOCK",
  "REINDEX",
  "CLUSTER",
  "REFRESH",
];

/**
 * Returns true if the query is a safe, read-only SELECT statement.
 * Rejects anything that contains mutation keywords at word boundaries.
 */
function isReadOnlyQuery(sql) {
  if (typeof sql !== "string" || sql.trim().length === 0) {
    return false;
  }

  const normalised = sql
    .replace(/--.*$/gm, "")   // strip single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // strip block comments
    .replace(/\s+/g, " ")     // collapse whitespace
    .trim();

  // Must start with SELECT or WITH (for CTEs)
  if (!/^\s*(SELECT|WITH)\b/i.test(normalised)) {
    return false;
  }

  // Reject forbidden keywords (word-boundary match to avoid false positives
  // like a column called "updated_at")
  for (const keyword of FORBIDDEN_KEYWORDS) {
    const re = new RegExp(`\\b${keyword}\\b`, "i");
    if (re.test(normalised)) {
      return false;
    }
  }

  // Reject semicolons followed by non-whitespace (multiple statements)
  if (/;\s*\S/.test(normalised)) {
    return false;
  }

  return true;
}

module.exports = { isReadOnlyQuery };
