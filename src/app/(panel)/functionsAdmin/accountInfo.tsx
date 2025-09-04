import FeedbackModal from "@/src/components/FeedbackModal";
import GenericConfirmationModal from "@/src/components/GenericConfirmationModal";
import Header from "@/src/components/Header";
import PasswordConfirmationModal from "@/src/components/PasswordConfirmationModal";
import PermissionDeniedModal from "@/src/components/PermissionDeniedModal";
import SearchInput from "@/src/components/SearchInput";
import Colors from "@/src/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import { useUserActions } from "@/src/hooks/auth/useUserActions";
import { useEmployees } from "@/src/hooks/auth/useUsersList";
import { styles } from "@/src/styles/functions/accountInfoStyle";
import { Employee } from "@/src/types/auth";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Employees() {
  const { employees, loading, error, refetch } = useEmployees();
  const { deleteUser, loadingDelete, loadingVerifyPassword } = useUserActions();
  const { role: currentUserRole } = useAuth();
  const firstFocus = useRef(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState<string[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [showPermissionDenied, setShowPermissionDenied] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      refetch();
    }, [refetch])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Opções de ordenação
  const sortOptions = [
    { key: "name", label: "Nome", icon: "text" },
    { key: "role", label: "Permissão", icon: "shield" },
  ];

  // Função para ordenar os funcionários
  const sortEmployees = (employeesList: Employee[]) => {
    if (!employeesList) return [];
    
    const sorted = [...employeesList];
    
    // Se nenhuma ordenação estiver selecionada, retorna a lista original
    if (!selectedSort || selectedSort.length === 0) {
      return sorted;
    }
    
    // Aplica múltiplas ordenações em sequência
    return sorted.sort((a, b) => {
      for (const sortKey of selectedSort) {
        let comparison = 0;
        
        switch (sortKey) {
          case "name":
            comparison = a.username.localeCompare(b.username);
            break;
          case "role":
            comparison = a.role.localeCompare(b.role);
            break;
          case "id":
            comparison = a.id.localeCompare(b.id);
            break;
          default:
            comparison = 0;
        }
        
        // Se encontrou diferença, retorna o resultado
        if (comparison !== 0) {
          return comparison;
        }
      }
      
      // Se todas as ordenações resultaram em igualdade, mantém a ordem original
      return 0;
    });
  };

  // Aplicar busca e ordenação
  const filteredAndSortedEmployees = sortEmployees(
    employees?.filter(employee =>
      employee.username.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []
  );

  const getRoleIcon = (role: string) => {
    const roleIcons = {
      ADMIN: "shield-checkmark",
      NORMAL: "person",
      MANAGER: "business"
    };
    return roleIcons[role as keyof typeof roleIcons] || "person";
  };

  const getRoleColor = (role: string) => {
    const roleColors = {
      ADMIN: Colors.red[600],
      NORMAL: Colors.blue[600],
      MANAGER: Colors.orange[600]
    };
    return roleColors[role as keyof typeof roleColors] || Colors.gray[600];
  };

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      ADMIN: "Administrador",
      NORMAL: "Usuário Normal",
      MANAGER: "Gerente"
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  const handleEditAccount = (employee: Employee) => {
    router.push({
      pathname: "/functionsAdmin/editAccount",
      params: {
        id: employee.id,
        username: employee.username,
        role: employee.role,
        createdAt: employee.created_at,
        updatedAt: employee.updated_at
      }
    });
  };

  const showFeedbackMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setShowFeedback(true);
  };

  const handleDeleteAccount = (employee: Employee) => {
    // Verifica se o usuário atual tem permissão ADMIN
    if (currentUserRole !== 'ADMIN') {
      setShowPermissionDenied(true);
      return;
    }

    setEmployeeToDelete(employee);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteAccount = async () => {
    if (!employeeToDelete) return;
    
    setShowDeleteConfirmation(false);
    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = async (password: string) => {
    if (!employeeToDelete) return;
    
    setShowPasswordModal(false);
    
    try {
      await deleteUser(employeeToDelete.id, password);
      showFeedbackMessage("Usuário excluído com sucesso!", "success");
      // Recarregar a lista após exclusão
      setTimeout(() => {
        if (refetch) {
          refetch();
        }
      }, 1000);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      showFeedbackMessage("Erro ao excluir usuário. Tente novamente.", "error");
    } finally {
      setEmployeeToDelete(null);
      setShowDeleteConfirmation(false);
    }
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    setEmployeeToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleSortChange = (sortKey: string | string[]) => {
    if (Array.isArray(sortKey)) {
      setSelectedSort(sortKey);
    } else {
      // Fallback para compatibilidade
      if (selectedSort.includes(sortKey)) {
        setSelectedSort(selectedSort.filter(key => key !== sortKey));
      } else {
        setSelectedSort([...selectedSort, sortKey]);
      }
    }
  };

  const renderEmployeeCard = (employee: Employee, index: number) => {
    // Verificação de segurança para evitar renderização de funcionários undefined
    if (!employee || !employee.username) {
      return null;
    }

    return (
      <View key={`employee-${index}`} style={styles.employeeCard}>
        <View style={styles.employeeHeader}>
          <View style={styles.employeeTitleContainer}>
            <Text style={styles.employeeTitle}>{employee.username}</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditAccount(employee)}
            >
              <Ionicons name="pencil" size={20} color={Colors.white} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteAccount(employee)}
            >
              <Ionicons name="trash" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.employeeDetails}>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nível de Permissão:</Text>
            <View style={styles.roleInfoContainer}>
              <View style={[styles.roleInfoBadge, { backgroundColor: getRoleColor(employee.role) }]}>
                <Ionicons name={getRoleIcon(employee.role) as any} size={16} color={Colors.white} />
                <Text style={styles.roleInfoText}>{getRoleLabel(employee.role)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.permissionSection}>
            <Text style={styles.permissionTitle}>Nível de Permissão da Conta</Text>
            
            <View style={styles.permissionInfoContainer}>
              <View style={styles.permissionInfoIcon}>
                <Ionicons name="information-circle" size={20} color={Colors.blue[600]} />
              </View>
              <View style={styles.permissionInfoContent}>
                <Text style={styles.permissionInfoTitle}>
                  {employee.role === 'ADMIN' 
                    ? 'Acesso Total ao Sistema'
                    : employee.role === 'MANAGER'
                    ? 'Acesso Intermediário'
                    : 'Acesso Básico'
                  }
                </Text>
                <Text style={styles.permissionInfoMessage}>
                  {employee.role === 'ADMIN' 
                    ? 'Acesso total ao sistema, incluindo gestão de usuários e configurações.'
                    : employee.role === 'MANAGER'
                    ? 'Acesso intermediário com permissões de gestão limitadas.'
                    : 'Acesso básico para operações do dia a dia.'
                  }
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.blue.primary} />
          <Text style={styles.loadingText}>Carregando contas de usuário...</Text>
        </View>
      );
    }

    if (error && !refreshing) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.red[500]} />
          <Text style={styles.errorTitle}>Erro ao carregar</Text>
          <Text style={styles.errorMessage}>{error || "Erro desconhecido"}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredAndSortedEmployees.length === 0 && !refreshing) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color={Colors.gray[400]} />
          <Text style={styles.emptyTitle}>
            {searchQuery ? "Nenhuma conta encontrada" : "Nenhuma conta configurada"}
          </Text>
          <Text style={styles.emptyMessage}>
            {searchQuery 
              ? "Tente ajustar os termos de busca"
              : "Configure sua primeira conta de usuário para começar"
            }
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredAndSortedEmployees}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => renderEmployeeCard(item, index)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.employeesList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.blue.primary]}
            tintColor={Colors.blue.primary}
            title="Puxar para atualizar"
            titleColor={Colors.text.secondary}
          />
        }
      />
    );
  };
  
  return (
    <View style={styles.mainContainer}>
      <Header title="Contas de Usuário" titleStyle={styles.header} />

      <View style={styles.container}>
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Buscar..."
          sortOptions={sortOptions}
          selectedSort={selectedSort}
          onSortChange={handleSortChange}
          showSortOptions={true}
          multipleSelection={true}
        />

        {renderContent()}

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.push("/functionsAdmin/createAccount")}
        >
          <AntDesign name="adduser" size={33} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Modal de Confirmação de Senha */}
      <PasswordConfirmationModal
        visible={showPasswordModal}
        title="Confirmação de Senha"
        message={`Digite sua senha de administrador`}
        onClose={handlePasswordModalClose}
        onConfirm={handlePasswordConfirm}
        loading={loadingVerifyPassword}
      />

      {/* Modal de Confirmação de Exclusão */}
      <GenericConfirmationModal
        visible={showDeleteConfirmation}
        title="Confirmar Exclusão"
        message={`Deseja realmente excluir o usuário "${employeeToDelete?.username}"? Uma vez excluído, não será possível recuperá-lo.`}
        confirmText="Continuar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteAccount}
        onCancel={() => {
          setEmployeeToDelete(null);
          setShowDeleteConfirmation(false);
        }}
        confirmButtonStyle="danger"
      />

      {/* Modal de Permissão Negada */}
      <PermissionDeniedModal
        visible={showPermissionDenied}
        action="excluir usuários"
        requiredRole="ADMIN"
        currentRole={currentUserRole || undefined}
        onClose={() => setShowPermissionDenied(false)}
      />

      {/* Modal de Feedback */}
      <FeedbackModal
        visible={showFeedback}
        message={feedbackMessage}
        type={feedbackType}
        onClose={() => setShowFeedback(false)}
        dismissible={true}
        onBackPress={() => router.back()}
        autoNavigateOnSuccess={false}
        navigateDelay={2000}
      />
    </View>
  );
}