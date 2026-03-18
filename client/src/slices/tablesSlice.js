import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTables, fetchTableData } from "../api";

export const loadTables = createAsyncThunk("tables/loadTables", async () => {
  const data = await fetchTables();
  return data.tables;
});

export const loadTableData = createAsyncThunk(
  "tables/loadTableData",
  async ({ name, limit, offset }) => {
    return await fetchTableData(name, { limit, offset });
  }
);

const tablesSlice = createSlice({
  name: "tables",
  initialState: {
    list: [],
    listLoading: false,
    listError: null,
    activeTable: null,
    data: null,
    dataLoading: false,
    dataError: null,
  },
  reducers: {
    clearTableData(state) {
      state.activeTable = null;
      state.data = null;
      state.dataError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadTables
      .addCase(loadTables.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(loadTables.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload;
      })
      .addCase(loadTables.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.error.message;
      })
      // loadTableData
      .addCase(loadTableData.pending, (state) => {
        state.dataLoading = true;
        state.dataError = null;
      })
      .addCase(loadTableData.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.activeTable = action.payload.table;
        state.data = action.payload;
      })
      .addCase(loadTableData.rejected, (state, action) => {
        state.dataLoading = false;
        state.dataError = action.error.message;
      });
  },
});

export const { clearTableData } = tablesSlice.actions;
export default tablesSlice.reducer;
