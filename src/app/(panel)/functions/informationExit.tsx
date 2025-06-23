import Header from "@/src/components/Header";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { styles } from "@/src/styles/functions/informationStyle";
import { Text, View } from "react-native";

function registerExit() {
  console.log("tocado")
}

export default function InformationExit() {
  return (
    <View style={{ flex: 1 }}>
      <Header title="Dados" />

      <View style={styles.container}>
        <View style={styles.photo}>
          <Text style={styles.letra}>M</Text>
        </View>

        <View style={styles.datas}>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Nome</Text>
            <Text style={styles.informationValue}>Matheus Furtado</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Placa</Text>
            <Text style={styles.informationValue}>LSN 4L49</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Entrada</Text>
            <Text style={styles.informationValue}>23/06/2025</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Saída</Text>
            <Text style={styles.informationValue}>23/06/2025</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Categoria</Text>
            <Text style={styles.informationValue}>Carro</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Hora Entrada</Text>
            <Text style={styles.informationValue}>14:15</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Permanencia</Text>
            <Text style={styles.informationValue}>02:25:30</Text>
          </View>
          <View style={styles.datasColumn}>
            <Text style={styles.informationTitle}>Hora Saída</Text>
            <Text style={styles.informationValue}>16:30</Text>
          </View>
        </View>

          <PrimaryButton title="Gerar pagamento" onPress={registerExit} style={styles.Button}/>
      </View>
    </View>
  );
}