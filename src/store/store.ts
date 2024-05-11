import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseAPI } from "./baseApi";
import { authReducer } from "./features/auth";
import { pageReducer } from "./features/page";
import { userReducer } from "./features/user";
import { quickNoteReducer } from "./features/quickNote";

export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    auth: persistReducer({ key: "auth", storage }, authReducer) as any,
    page: pageReducer,
    user: userReducer,
    quickNote: quickNoteReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseAPI.middleware) as any,
});

export const persistor = persistStore(store);
