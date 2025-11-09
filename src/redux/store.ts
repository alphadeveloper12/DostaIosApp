import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./slices/exampleslice";
import menuReducer from "./slices/menuSlice";

export const store = configureStore({
 reducer: {
  example: exampleReducer,
  menu: menuReducer,
 },
});
