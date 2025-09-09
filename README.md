# Sistema de Hierarquia de Roles - App Estacionamento

Este documento explica como funciona o sistema de hierarquia de roles implementado no frontend React Native do aplicativo.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Hierarquia de Roles](#hierarquia-de-roles)
- [Implementação no Frontend](#implementação-no-frontend)
- [Como Usar](#como-usar)
- [Exemplos Práticos](#exemplos-práticos)
- [Benefícios](#benefícios)

## 🎯 Visão Geral

O sistema implementa uma hierarquia de permissões baseada em níveis numéricos, onde cada role tem um valor específico que determina seu nível de acesso. Isso permite verificações flexíveis de permissão no frontend React Native.

## 🔐 Hierarquia de Roles

```typescript
const ROLE_HIERARCHY = {
  NORMAL: 1,    // Nível básico - Acesso limitado
  MANAGER: 2,   // Nível intermediário - Acesso moderado
  ADMIN: 3,     // Nível máximo - Acesso total
}
```

### Características:

- **NORMAL (1)**: Usuário básico com acesso limitado
- **MANAGER (2)**: Gerente com permissões intermediárias
- **ADMIN (3)**: Administrador com acesso total

## 📱 Implementação no Frontend

### AuthContext

```typescript
// Hierarquia de roles
const ROLE_HIERARCHY = {
  NORMAL: 1,
  MANAGER: 2,
  ADMIN: 3,
} as const;

type RoleType = keyof typeof ROLE_HIERARCHY;

// Função para verificar se o usuário tem permissão mínima
const hasPermission = (minRole: RoleType): boolean => {
  if (!role) return false;
  const userRoleLevel = ROLE_HIERARCHY[role];
  const requiredRoleLevel = ROLE_HIERARCHY[minRole];
  return userRoleLevel >= requiredRoleLevel;
};

// Função para verificar se o usuário tem exatamente um role específico
const hasExactRole = (exactRole: RoleType): boolean => {
  return role === exactRole;
};

// Funções de conveniência
const hasManagerPermission = (): boolean => {
  return hasPermission('MANAGER');
};

const hasAdminPermission = (): boolean => {
  return hasExactRole('ADMIN');
};
```

### Interface TypeScript

```typescript
export interface AuthContextData {
  token: string | null;
  userId: string | null;
  role: "ADMIN" | "NORMAL" | "MANAGER" | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (minRole: "ADMIN" | "NORMAL" | "MANAGER") => boolean;
  hasExactRole: (exactRole: "ADMIN" | "NORMAL" | "MANAGER") => boolean;
  hasManagerPermission: () => boolean;
  hasAdminPermission: () => boolean;
}
```

## 🚀 Como Usar

### 1. Importar o Hook

```typescript
import { useAuth } from '@/src/context/AuthContext';
```

### 2. Usar as Funções de Permissão

```typescript
function MyComponent() {
  const { 
    hasPermission, 
    hasExactRole, 
    hasManagerPermission, 
    hasAdminPermission 
  } = useAuth();

  // Verificar permissão mínima
  if (hasPermission('MANAGER')) {
    // Usuário é MANAGER ou ADMIN
  }

  // Verificar role exato
  if (hasExactRole('ADMIN')) {
    // Usuário é exatamente ADMIN
  }

  // Usar funções de conveniência
  if (hasManagerPermission()) {
    // Usuário é MANAGER ou ADMIN
  }

  if (hasAdminPermission()) {
    // Usuário é ADMIN
  }
}
```

### 3. Renderização Condicional

```typescript
function VehicleDetailsModal() {
  const { hasManagerPermission } = useAuth();

  return (
    <Modal>
      {/* Seção visível apenas para MANAGER e ADMIN */}
      {hasManagerPermission() && (
        <View>
          <Text>Informações do Sistema</Text>
          {/* Conteúdo sensível */}
        </View>
      )}

      {/* Botão visível apenas para MANAGER e ADMIN */}
      {hasManagerPermission() && (
        <Pressable onPress={handleDelete}>
          <Text>Desativar Veículo</Text>
        </Pressable>
      )}
    </Modal>
  );
}
```

### 4. Verificação de Ação

```typescript
function handleDeleteVehicle() {
  const { hasManagerPermission } = useAuth();

  if (!hasManagerPermission()) {
    setPermissionDeniedVisible(true);
    return;
  }

  // Proceder com a ação
  deleteVehicle();
}
```

## 💡 Exemplos Práticos

### Exemplo 1: Botão de Edição

```typescript
// ✅ Usuário NORMAL pode editar
if (hasPermission('NORMAL')) {
  return <EditButton />;
}
```

### Exemplo 2: Seção de Administração

```typescript
// ✅ Apenas MANAGER e ADMIN veem esta seção
{hasManagerPermission() && (
  <AdminSection />
)}
```

### Exemplo 3: Ação Crítica

```typescript
// ✅ Apenas ADMIN pode executar
if (hasAdminPermission()) {
  return <CriticalActionButton />;
}
```

### Exemplo 4: Verificação Específica

```typescript
// ✅ Apenas MANAGER (não ADMIN) pode executar
if (hasExactRole('MANAGER')) {
  return <ManagerOnlyAction />;
}
```

## 🎨 Modal de Permissão Negada

O sistema inclui um modal personalizado para informar o usuário sobre permissões insuficientes:

```typescript
<PermissionDeniedModal
  visible={permissionDeniedVisible}
  onClose={handleClosePermissionDenied}
  action="desativar ou ativar veículos"
  requiredRole="MANAGER"
  currentRole={hasManagerPermission() ? 'MANAGER' : 'NORMAL'}
  message="Você precisa ter permissão de Gerente ou Administrador para desativar ou ativar veículos."
/>
```

## ✅ Benefícios

### 1. **Consistência**
- Mesma lógica no frontend e backend
- Reduz bugs de permissão
- Facilita manutenção

### 2. **Flexibilidade**
- Verificações de permissão mínima
- Verificações de role exato
- Funções de conveniência

### 3. **TypeScript**
- Tipagem completa
- IntelliSense
- Detecção de erros em tempo de compilação

### 4. **Reutilização**
- Funções disponíveis em toda a aplicação
- Código DRY (Don't Repeat Yourself)
- Centralização da lógica de permissão

### 5. **UX Melhorada**
- Interface adaptada ao role do usuário
- Feedback claro sobre permissões
- Prevenção de ações não autorizadas

## 🔧 Manutenção

### Adicionando Novos Roles

1. **Frontend**: Adicionar no `ROLE_HIERARCHY` do AuthContext
2. **Tipos**: Atualizar interfaces TypeScript
3. **Testes**: Verificar todas as verificações de permissão

### Modificando Hierarquia

1. Ajustar valores numéricos no `ROLE_HIERARCHY`
2. Atualizar documentação
3. Testar todas as verificações de permissão
4. Comunicar mudanças à equipe

## 📝 Notas Importantes

- **Segurança**: As verificações no frontend são para UX e controle de interface. A segurança real deve ser implementada no backend.
- **Performance**: As funções são otimizadas e não causam re-renders desnecessários.
- **Compatibilidade**: O sistema é compatível com React Native e funciona em todas as plataformas.

---

**Desenvolvido para o App Estacionamento** 🚗