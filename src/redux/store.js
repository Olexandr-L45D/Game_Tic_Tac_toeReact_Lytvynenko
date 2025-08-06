// store

import { configureStore } from "@reduxjs/toolkit";
import tasksReducerCard from "./contacts/slice";
import { filtersReducer } from "./filters/slice";
import { authReducer } from "./auth/slice";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistedAuthReducer = persistReducer(
    {
        key: "jwt-token",
        storage,
        whitelist: ["token"],
    },
    authReducer
);


export const store = configureStore({
    reducer: {
        contacts: tasksReducerCard,
        filters: filtersReducer,
        auth: persistedAuthReducer,
        // auth: authReducer, (початково без Локал Сторедж)
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);