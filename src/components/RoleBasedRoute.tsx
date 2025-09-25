import { useRoleNavigation } from "@/hooks/auth/useRoleNavigation";
import { useRouter } from "expo-router";
import React from "react";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("ADMIN" | "NORMAL" | "MANAGER")[];
  fallbackRoute?: "/login" | "/";
  showLoading?: boolean;
}

export function RoleBasedRoute({ 
  children, 
  allowedRoles, 
  fallbackRoute = "/login",
  showLoading = true 
}: RoleBasedRouteProps) {
  const { isLoading, isAuthenticated, role } = useRoleNavigation();
  const router = useRouter();

  // Mostra loading se configurado
  if (isLoading && showLoading) {
    return null; // Ou um componente de loading
  }

  // Redireciona se não estiver autenticado
  if (!isAuthenticated) {
    router.replace(fallbackRoute);
    return null;
  }

  // Redireciona se não tiver role
  if (!role) {
    router.replace(fallbackRoute);
    return null;
  }

  // Verifica se o role está permitido
  if (allowedRoles && !allowedRoles.includes(role)) {
    router.replace(fallbackRoute);
    return null;
  }

  return <>{children}</>;
}
