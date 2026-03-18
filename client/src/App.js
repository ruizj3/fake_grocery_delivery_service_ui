import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadTables } from "./slices/tablesSlice";
import Sidebar from "./components/Sidebar";
import TableView from "./components/TableView";
import QueryEditor from "./components/QueryEditor";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTables());
  }, [dispatch]);

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <h1>Fake Grocery Delivery Service</h1>
        <TableView />
        <QueryEditor />
      </main>
    </div>
  );
}
