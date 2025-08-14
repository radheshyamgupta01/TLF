"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAuthInit } from "../../hooks/useAuthInit";
import MainLoader from "../Loaders/MainLoader";

export default function AuthGuard({
  children,
  redirectTo = "/agents-dashboard",
}) {
  const router = useRouter();
  const { isInitialized, isAuthenticated } = useAuthInit();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isInitialized, isAuthenticated, isLoading, router, redirectTo]);

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return <MainLoader />;
  }

  // Show nothing while redirecting
  if (isAuthenticated) {
    return null;
  }

  return children;
}
