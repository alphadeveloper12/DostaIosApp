import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// This is the initial state for your slice
const initialState = {
  locations: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// 1. Create the Thunk (for the async API call)
export const fetchLocations :any = createAsyncThunk(
  'vendingLocations/fetchLocations',
  async () => {
    // Get the API URL from Vite's environment variables
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/vending/locations`;
    
    const response = await fetch(apiUrl);

    if (!response.ok) {
      // Throw an error if the response is not successful
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    // The returned value will be the `action.payload` in the 'fulfilled' case
    return data;
  }
);

// 2. Create the Slice
const vendingLocationsSlice = createSlice({
  name: 'vendingLocations',
  initialState,
  // 'reducers' are for synchronous actions (e.g., add a location manually)
  reducers: {
    // You could add synchronous reducers here if needed
    // Example:
    // clearLocations: (state) => {
    //   state.locations = [];
    // }
  },
  // 'extraReducers' are for actions defined outside the slice,
  // like our createAsyncThunk
  extraReducers: (builder) => {
    builder
      // Case: When the fetch starts
      .addCase(fetchLocations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // Case: When the fetch succeeds
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.locations = action.payload; // Set the fetched data
      })
      // Case: When the fetch fails
      .addCase(fetchLocations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// 3. Export the reducer and any selectors
export default vendingLocationsSlice.reducer;

// Selectors (optional but good practice)
// These let your components get the data without knowing the state shape
export const selectAllLocations = (state) => state.vendingLocations.locations;
export const getLocationsStatus = (state) => state.vendingLocations.status;
export const getLocationsError = (state) => state.vendingLocations.error;