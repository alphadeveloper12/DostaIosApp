import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define your user type (you can extend it later)
interface UserState {
  user: any | null;
}

const initialUser = (() => {
  try {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
})();

const initialState: UserState = {
  user: initialUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      sessionStorage.setItem("user", JSON.stringify(action.payload)); // ✅ keep sessionStorage synced
    },
    clearUser: (state) => {
      state.user = null;
      sessionStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
