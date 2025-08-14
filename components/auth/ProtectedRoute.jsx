"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAuthInit } from "../../hooks/useAuthInit";
import MainLoader from "../Loaders/MainLoader";

export default function ProtectedRoute({
  children,
  requiredRoles = [],
  redirectTo = "/login",
}) {
  const router = useRouter();
  const { isInitialized, isAuthenticated } = useAuthInit();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check role-based access
      if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requiredRoles.includes(user.role);
        if (!hasRequiredRole) {
          router.push("/unauthorized");
          return;
        }
      }
    }
  }, [
    isInitialized,
    isAuthenticated,
    isLoading,
    user,
    router,
    requiredRoles,
    redirectTo,
  ]);

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return <MainLoader />;
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Check role access
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      return null;
    }
  }

  return children;
}
