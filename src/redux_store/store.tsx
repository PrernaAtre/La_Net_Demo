import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import notesReducer from "./slices/notesSlice"
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist'
import storage from 'redux-persist/lib/storage' 
// import { getDefaultMiddleware } from '@reduxjs/toolkit';


const persistConfig = {
    key: 'user',
    storage,
  }

const persistedReducer = persistReducer(persistConfig, authReducer)


export const store = configureStore({
    reducer:{
        auth : persistedReducer,
        notes: notesReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:{
            ignoredActions:[FLUSH,REGISTER,REHYDRATE,PAUSE,PERSIST,PURGE],
        },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store)