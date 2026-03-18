import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { executeQuery } from "../api";

export const runQuery = createAsyncThunk(
  "query/runQuery",
  async ({ sql, params = [] }) => {
    return await executeQuery(sql, params);
  }
);

const querySlice = createSlice({
  name: "query",
  initialState: {
    sql: "",
    result: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSql(state, action) {
      state.sql = action.payload;
    },
    clearQueryResult(state) {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.result = null;
      })
      .addCase(runQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(runQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSql, clearQueryResult } = querySlice.actions;
export default querySlice.reducer;
