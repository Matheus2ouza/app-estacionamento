import { useRoleNavigation } from "@/src/hooks/auth/useRoleNavigation";
import { Slot, Stack } from "expo-router";
import React from "react";

interface UniversalRoleBasedLayoutProps {
  children?: React.ReactNode;
  useStack?: boolean;
  stackOptions?: any;
}

export function UniversalRoleBasedLayout({ 
  children, 
  useStack = false, 
  stackOptions = { headerShown: false } 
}: UniversalRoleBasedLayoutProps) {
  // Usa o hook universal que automaticamente gerencia o redirecionamento baseado no role
  const { isLoading, isAuthenticated, role } = useRoleNavigation();

  // Mostra loading enquanto autenticação está sendo verificada
  if (isLoading) {
    return null;
  }

  // Se não estiver autenticado, não renderiza nada (será redirecionado pelo hook)
  if (!isAuthenticated || !role) {
    return null;
  }

  // Renderiza o componente apropriado baseado na configuração
  if (useStack) {
    return <Stack screenOptions={stackOptions} />;
  }

  return <>{children || <Slot />}</>;
}
