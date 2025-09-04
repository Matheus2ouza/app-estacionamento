import { useAuth } from "@/src/context/AuthContext";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";

// Mapeamento universal de roles para nomes de arquivos
const ROLE_FILE_MAPPING = {
  ADMIN: "admin",
  NORMAL: "normal",
  MANAGER: "normal", // MANAGER usa a mesma rota que NORMAL
} as const;

type RoleType = keyof typeof ROLE_FILE_MAPPING;

export function useRoleNavigation() {
  const { role, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const redirected = useRef(false);

  useEffect(() => {
    console.log("[useRoleNavigation] Verificando redirecionamento:", {
      isLoading,
      isAuthenticated,
      role,
      segments: segments.join('/'),
      redirected: redirected.current
    });

    // Só executa quando a autenticação estiver completa e o usuário estiver autenticado
    if (!isLoading && isAuthenticated && role && !redirected.current) {
      const currentRoute = segments[segments.length - 1];
      const targetFileName = ROLE_FILE_MAPPING[role as RoleType];
      
      console.log("[useRoleNavigation] Verificando rota:", {
        currentRoute,
        targetFileName,
        role,
        segments
      });
      
      if (targetFileName) {
        // Verifica se o usuário está na rota correta para seu role
        const isOnCorrectRoute = currentRoute === targetFileName;
        
        console.log("[useRoleNavigation] Comparação de rotas:", {
          currentRoute,
          targetFileName,
          isOnCorrectRoute
        });
        
        // Só redireciona se estiver na pasta pai (sem especificar qual arquivo)
        // Não redireciona se o usuário já está navegando para uma rota específica
        if (currentRoute === segments[segments.length - 2]) {
          // Constrói a rota de destino dinamicamente
          const currentPath = segments.slice(0, -1).join('/'); // Remove o último segmento
          const targetRoute = `${currentPath}/${targetFileName}`;
          
          console.log("[useRoleNavigation] Redirecionando para:", targetRoute);
          redirected.current = true;
          router.replace(targetRoute as any);
        } else {
          console.log("[useRoleNavigation] Usuário já está navegando para uma rota específica, não redirecionando");
        }
      }
    }
  }, [isLoading, isAuthenticated, role, segments, router]);

  const getTargetRoute = (userRole: RoleType | null, basePath?: string) => {
    if (!userRole) return null;
    const targetFileName = ROLE_FILE_MAPPING[userRole];
    if (!targetFileName) return null;
    
    // Se basePath for fornecido, usa ele, senão constrói a partir dos segments
    const path = basePath || segments.slice(0, -1).join('/');
    return `${path}/${targetFileName}`;
  };

  const isOnCorrectRoute = () => {
    if (!role || !isAuthenticated) return false;
    
    const currentRoute = segments[segments.length - 1];
    const targetFileName = ROLE_FILE_MAPPING[role as RoleType];
    
    if (!targetFileName) return false;
    
    return currentRoute === targetFileName;
  };

  const redirectToRoleRoute = (basePath?: string) => {
    if (role && ROLE_FILE_MAPPING[role as RoleType]) {
      const targetRoute = getTargetRoute(role, basePath);
      if (targetRoute) {
        router.replace(targetRoute as any);
      }
    }
  };

  return {
    isLoading,
    isAuthenticated,
    role,
    isOnCorrectRoute: isOnCorrectRoute(),
    getTargetRoute,
    redirectToRoleRoute,
    shouldRedirect: !isLoading && isAuthenticated && role && !redirected.current,
  };
}
