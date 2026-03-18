import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSql, runQuery, clearQueryResult } from "../slices/querySlice";
import DataTable from "./DataTable";

export default function QueryEditor() {
  const dispatch = useDispatch();
  const { sql, result, loading, error } = useSelector((state) => state.query);

  function handleRun() {
    if (sql.trim()) {
      dispatch(runQuery({ sql }));
    }
  }

  return (
    <div className="query-editor">
      <h2>Custom Query</h2>
      <p style={{ fontSize: "0.8rem", color: "#888", marginTop: 0 }}>
        Only SELECT statements are allowed. Use $1, $2, … for parameterised
        placeholders.
      </p>
      <textarea
        value={sql}
        onChange={(e) => dispatch(setSql(e.target.value))}
        placeholder="SELECT * FROM orders LIMIT 10;"
        spellCheck={false}
      />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={handleRun} disabled={loading || !sql.trim()}>
          {loading ? "Running…" : "Run Query"}
        </button>
        {(result || error) && (
          <button
            onClick={() => dispatch(clearQueryResult())}
            style={{ background: "#888" }}
          >
            Clear
          </button>
        )}
      </div>

      {error && <p className="error" style={{ marginTop: "0.75rem" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontSize: "0.8rem", color: "#555" }}>
            {result.rowCount} row{result.rowCount !== 1 ? "s" : ""} returned
          </p>
          <DataTable columns={result.columns} rows={result.rows} />
        </div>
      )}
    </div>
  );
}
