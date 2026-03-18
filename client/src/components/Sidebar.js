import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadTableData } from "../slices/tablesSlice";

export default function Sidebar() {
  const dispatch = useDispatch();
  const { list, listLoading, listError, activeTable } = useSelector(
    (state) => state.tables
  );

  if (listLoading) return <aside className="sidebar"><p className="loading">Loading tables…</p></aside>;
  if (listError) return <aside className="sidebar"><p className="error">{listError}</p></aside>;

  return (
    <aside className="sidebar">
      <h2>Tables</h2>
      {list.length === 0 ? (
        <p className="empty">No tables found</p>
      ) : (
        <ul>
          {list.map((name) => (
            <li key={name}>
              <button
                className={name === activeTable ? "active" : ""}
                onClick={() =>
                  dispatch(loadTableData({ name, limit: 100, offset: 0 }))
                }
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
