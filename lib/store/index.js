// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import { combineReducers } from "@reduxjs/toolkit";

// import authReducer from "./slices/authSlice";
// // import listingReducer from "./slices/";

// // Persist config
// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["auth"], // Only persist auth slice
// };

// // Combine reducers
// const rootReducer = combineReducers({
//   auth: authReducer,
//   // listings: listingReducer,
// });

// // Persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Configure store
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
//       },
//     }),
//   devTools: process.env.NODE_ENV !== "production",
// });

// export const persistor = persistStore(store);




import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
// import listingReducer from "./slices/";

// Check if we're on the server
const isServer = typeof window === "undefined";

// Create a no-op storage for server-side rendering
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

// Use appropriate storage based on environment
const storage = isServer 
  ? createNoopStorage() 
  : require("redux-persist/lib/storage").default;

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth slice
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  // listings: listingReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST", 
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER"
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

// Export types for TypeScript users (optional)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;