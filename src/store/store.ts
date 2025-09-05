import { configureStore } from "@reduxjs/toolkit"
import projectReducer from "./slices/projectSlice"
import settingsReducer from "./slices/settingsSlice"
import authReducer from "./slices/authSlice"
import skillReducer from "./slices/skillSlice"

export const store = configureStore({
  reducer: {
    projects: projectReducer,
    settings: settingsReducer,
    auth: authReducer,
    skills: skillReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
