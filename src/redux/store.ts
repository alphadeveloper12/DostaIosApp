import { configureStore } from "@reduxjs/toolkit";

import menuReducer from "./slices/menuSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
 reducer: {
  user: userReducer,
  menu: menuReducer,
 },
});
