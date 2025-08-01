import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import { useEmployees } from "@/src/hooks/auth/useUsersList";
import { styles } from "@/src/styles/functions/accountInfoStyle";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Employee } from "@/src/types/auth";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView
} from "react-native";

export default function Employees() {
  const { employees, loading, error, refetch } = useEmployees();
  const [refreshing, setRefreshing] = useState(false);
  const firstFocus = useRef(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      refetch();
    }, [refetch])
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue.logo} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={50} color={Colors.red[500]} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={refetch} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderEmployeeItem = ({ item }: {item: Employee}) => (
    <TouchableOpacity 
      style={styles.employeeCard}
      onPress={() => {
        router.push({
          pathname: "/FunctionsAdmin/editAccount",
          params: {
            id: item.id,
            username: item.username,
            role: item.role
          }
        });
      }}
    >
      <View style={styles.employeeAvatar}>
        <AntDesign name="user" size={24} color={Colors.white} />
      </View>
      
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName} numberOfLines={1}>
          {item.username}
        </Text>
        <View style={styles.employeeRoleContainer}>
          <Text style={styles.employeeRoleLabel}>Cargo:</Text>
          <Text style={[
            styles.employeeRoleValue,
            item.role === 'ADMIN' ? styles.adminRole : styles.normalRole
          ]}>
            {item.role === 'ADMIN' ? 'Administrador' : 'Funcionário'}
          </Text>
        </View>
      </View>
      
      <AntDesign 
        name="right" 
        size={20} 
        color={Colors.gray.dark} 
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Funcionários" />
      
      <Image
        source={require("@/src/assets/images/splash-icon-blue.png")}
        style={styles.backgroundImage}
      />
      
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={renderEmployeeItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.blue.logo]}
            tintColor={Colors.blue.logo}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="people-outline" size={50} color={Colors.gray.dark} />
            <Text style={styles.emptyText}>Nenhum funcionário cadastrado</Text>
          </View>
        }
      />
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/FunctionsAdmin/createAccount")}
      >
        <AntDesign name="plus" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}