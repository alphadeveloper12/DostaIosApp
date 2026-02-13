import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define your user type (you can extend it later)
interface UserState {
  user: any | null;
}

const initialUser = (() => {
  try {
    const stored = sessionStorage.getItem("user") || localStorage.getItem("user");
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
      const userData = JSON.stringify(action.payload);
      sessionStorage.setItem("user", userData);
      localStorage.setItem("user", userData);
    },
    clearUser: (state) => {
      state.user = null;
      sessionStorage.removeItem("user");
      localStorage.removeItem("user");
      sessionStorage.removeItem("authToken");
      localStorage.removeItem("authToken");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
