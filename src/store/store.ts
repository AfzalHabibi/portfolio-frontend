import { configureStore } from "@reduxjs/toolkit"
import projectReducer from "./slices/projectSlice"
import settingsReducer from "./slices/settingsSlice"
import authReducer from "./slices/authSlice"

export const store = configureStore({
  reducer: {
    projects: projectReducer,
    settings: settingsReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
