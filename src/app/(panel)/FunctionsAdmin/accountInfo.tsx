import Header from "@/src/components/Header";
import Colors from "@/src/constants/Colors";
import { useEmployees } from "@/src/hooks/auth/useUsersList";
import { styles } from "@/src/styles/functions/accountInfoStyle";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Employees() {
  const { employees, loading, error, refetch } = useEmployees();
  const firstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      refetch();
    }, [refetch])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={refetch} style={{ marginTop: 10 }}>
          <Text style={{ color: "blue" }}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Funcionários" />
      <View style={styles.searchBody}>
        <FlatList
          style={{ width: "100%" }}
          data={employees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width: "100%" }}>
              <View style={styles.separator} />

              <TouchableOpacity onPress={() => {
                // Passe os dados do usuário como parâmetros de navegação
                router.push({
                  pathname: "/FunctionsAdmin/editAccount",
                  params: {
                    id: item.id,
                    username: item.username,
                    role: item.role
                  }
                });
              }}>
                <View style={styles.searchDataRow}>
                  <View style={styles.rowHeader}>
                    <Text style={styles.main}>{item.username}</Text>
                  </View>

                  <View style={styles.information}>
                    <View style={styles.informationColumn}>
                      <Text
                        style={[
                          styles.informationValue,
                          { color: Colors.darkGray },
                        ]}
                      >
                        Permissão -
                      </Text>
                      <Text style={styles.informationValue}>{item.role}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          router.push("/FunctionsAdmin/createAccount");
        }}
      >
        <AntDesign name="adduser" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}