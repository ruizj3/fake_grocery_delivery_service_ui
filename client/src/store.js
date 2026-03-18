import { configureStore } from "@reduxjs/toolkit";
import tablesReducer from "./slices/tablesSlice";
import queryReducer from "./slices/querySlice";

const store = configureStore({
  reducer: {
    tables: tablesReducer,
    query: queryReducer,
  },
});

export default store;
