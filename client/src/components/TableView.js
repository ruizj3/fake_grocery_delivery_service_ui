import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadTableData } from "../slices/tablesSlice";
import DataTable from "./DataTable";

export default function TableView() {
  const dispatch = useDispatch();
  const { activeTable, data, dataLoading, dataError } = useSelector(
    (state) => state.tables
  );

  if (!activeTable && !dataLoading) {
    return <p className="empty">Select a table from the sidebar to view its data.</p>;
  }

  if (dataLoading) return <p className="loading">Loading data…</p>;
  if (dataError) return <p className="error">{dataError}</p>;
  if (!data) return null;

  const { columns, rows, total, limit, offset, table } = data;

  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  function goToPage(newPage) {
    dispatch(
      loadTableData({ name: table, limit, offset: (newPage - 1) * limit })
    );
  }

  return (
    <div>
      <h2>
        {table}{" "}
        <span style={{ fontWeight: 400, fontSize: "0.85rem", color: "#888" }}>
          ({total} row{total !== 1 ? "s" : ""})
        </span>
      </h2>

      <DataTable columns={columns} rows={rows} />

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            ← Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
