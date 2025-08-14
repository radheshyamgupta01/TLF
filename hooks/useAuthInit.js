"use client";

import { restoreAuth, setInitialized } from "@/lib/store/slices/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useAuthInit = () => {
  const dispatch = useDispatch();
  const { isInitialized, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized) {
      // Try to restore auth from localStorage (backup method)
      try {
        const token = localStorage.getItem("auth_token");
        const userDataString = localStorage.getItem("user_data");

        if (token && userDataString) {
          const user = JSON.parse(userDataString);
          dispatch(restoreAuth({ user, token }));
        } else {
          dispatch(setInitialized());
        }
      } catch (error) {
        console.error("Failed to restore auth:", error);
        dispatch(setInitialized());
      }
    }
  }, [dispatch, isInitialized]);

  return { isInitialized, isAuthenticated };
};
