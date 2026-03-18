import React from "react";

export default function DataTable({ columns, rows }) {
  if (!columns || columns.length === 0) {
    return <p className="empty">No data</p>;
  }

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col}>{formatCell(row[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(value) {
  if (value === null || value === undefined) return <span style={{ color: "#aaa" }}>NULL</span>;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
