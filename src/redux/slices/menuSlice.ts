import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔹 Async Thunk for fetching menu by day
export const fetchMenuByDay:any = createAsyncThunk(
  "menu/fetchMenuByDay",
  async (day, { rejectWithValue }) => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      const baseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

      const response = await fetch(`${baseUrl}/api/vending/menu/${day}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(errorText || "Failed to fetch menu");
      }

      const data = await response.json();
      return data.items; // assuming API returns { items: [...] }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    foodData: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuByDay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMenuByDay.fulfilled, (state, action) => {
        state.isLoading = false;
        state.foodData = action.payload;
      })
      .addCase(fetchMenuByDay.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch menu";
      });
  },
});

export default menuSlice.reducer;
