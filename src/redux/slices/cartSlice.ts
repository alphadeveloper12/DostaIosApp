import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Helper for API URL
const getBaseUrl = () => import.meta.env.VITE_API_URL;
const getHeaders = () => {
  const token = (sessionStorage.getItem("authToken") || localStorage.getItem("authToken")) || localStorage.getItem("authToken");
  return { headers: { Authorization: `Token ${token}` } };
};

// --- Async Thunk to Fetch Cart ---
export const fetchCartData = createAsyncThunk(
  "cart/fetchCartData",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const res = await axios.get(`${baseUrl}/api/vending/cart/`, getHeaders());
      // API returns structure matching CartAPI in CartPage.tsx
      return res.data;
    } catch (err: any) {
      console.error("Error fetching cart from API", err);
      return rejectWithValue(err.response?.data || "Failed to fetch cart");
    }
  }
);

interface CartState {
  // We keep orderData generic or matching API structure if needed,
  // but primarily we care about 'items' and 'totalQuantity' for the header.
  items: any[];
  totalQuantity: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.loading = false;
        const apiCart = action.payload;
        state.items = apiCart?.items || [];

        // Calculate total quantity from API items
        if (state.items.length > 0) {
          state.totalQuantity = state.items.reduce(
            (acc: number, item: any) => acc + (item.quantity || 1),
            0
          );
        } else {
          state.totalQuantity = 0;
        }
        console.log(
          "🛒 Redux: API Sync Complete. Total Items:",
          state.totalQuantity
        );
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Assumed empty/error state
        console.log("🛒 Redux: Fetch failed or empty");
      });
  },
});

export const { clearCart } = cartSlice.actions;

export const selectTotalCartItems = (state: any) => state.cart.totalQuantity;
export const selectCartLoading = (state: any) => state.cart.loading;

export default cartSlice.reducer;
