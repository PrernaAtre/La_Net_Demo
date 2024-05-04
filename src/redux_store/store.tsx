import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import notesReducer from "./slices/notesSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
// import { getDefaultMiddleware } from '@reduxjs/toolkit';
import pageRrducer from "@/store/features/page/pageSlice";
import { baseAPI } from "@/store/baseApi";

const persistConfig = {
  key: "user",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    auth: persistedReducer,
    notes: notesReducer,
    page: pageRrducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseAPI.middleware) as any,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
