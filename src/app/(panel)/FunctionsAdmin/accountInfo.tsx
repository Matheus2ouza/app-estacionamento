import Header from "@/src/components/Header";
import { styles } from "@/src/styles/functions/accountInfoStyle";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { IconButton, Menu } from "react-native-paper";

const mockEmployees = [
  { id: "1", username: "joao123", role: "ADMIN", current: true },
  { id: "2", username: "maria456", role: "NORMAL", current: false },
  { id: "3", username: "carlos789", role: "NORMAL", current: false },
];

export default function Employees() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleEdit = (username: string) => {
    Alert.alert("Editar", `Editar funcionário: ${username}`);
  };

  const handleDelete = (username: string) => {
    Alert.alert("Excluir", `Deseja excluir ${username}?`);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Funcionários" />
      <View style={styles.searchBody}>
        <FlatList
          data={mockEmployees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width: "100%" }}>
              <View style={styles.separator} />

              <View style={styles.searchDataRow}>
                <View style={styles.rowHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.main}>
                      {item.username} {item.current && "(atual)"}
                    </Text>
                  </View>

                  <Menu
                    visible={selected === item.id}
                    onDismiss={() => setSelected(null)}
                    anchor={
                      <IconButton
                        icon="dots-vertical"
                        size={20}
                        onPress={() => setSelected(item.id)}
                        style={styles.menuAnchor}
                      />
                    }
                  >
                    <Menu.Item
                      onPress={() => {
                        handleEdit(item.username);
                        setSelected(null);
                      }}
                      title="Editar"
                    />
                    <Menu.Item
                      onPress={() => {
                        handleDelete(item.username);
                        setSelected(null);
                      }}
                      title="Apagar"
                    />
                  </Menu>
                </View>

                <View style={styles.information}>
                  <View style={styles.informationColumn}>
                    <Text style={styles.informationValue}>{item.role}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
        <View style={styles.separator} />
      </View>

      <TouchableOpacity style={styles.floatingButton} onPress={() => {router.push("/FunctionsAdmin/createAccount")}}>
        <AntDesign name="adduser" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
