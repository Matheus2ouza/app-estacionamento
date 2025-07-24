import Header from "@/src/components/Header";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import TcpSocket from "react-native-tcp-socket";

const ESC = "\x1B";
const GS = "\x1D";
const initialize = `${ESC}@`;
const center = `${ESC}a1`;
const left = `${ESC}a0`;
const right = `${ESC}a2`;
const boldOn = `${ESC}E1`;
const boldOff = `${ESC}E0`;
const doubleHeightWidth = `${ESC}!${String.fromCharCode(48)}`;
const normalText = `${ESC}!${String.fromCharCode(0)}`;
const cut = `${GS}V0`;

export default function PrinterSetup() {
  const [ip, setIp] = useState("192.168.0.100");
  const [port, setPort] = useState("9100");
  const [connected, setConnected] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const testConnection = () => {
    const socket = TcpSocket.createConnection(
      { host: ip, port: Number(port) },
      () => {
        setConnected(true);
        Alert.alert("Conectado!", `Conexão com ${ip}:${port} estabelecida.`);
        socket.destroy();
      }
    );

    socket.on("error", (error: any) => {
      setConnected(false);
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert("Erro", `Não foi possível conectar: ${message}`);
      socket.destroy();
    });

    socket.on("timeout", () => {
      setConnected(false);
      Alert.alert("Erro", "Timeout na conexão. Verifique o IP e porta.");
      socket.destroy();
    });

    // Opcional: fechar socket após 5s para não ficar aberto demais
    setTimeout(() => {
      socket.destroy();
    }, 5000);
  };

  const sendToPrinter = async (commands: string) => {
    return new Promise<void>((resolve, reject) => {
      const socket = TcpSocket.createConnection(
        { host: ip, port: Number(port) },
        () => {
          const writeResult = socket.write(commands);
          if (!writeResult) {
            reject(new Error("Falha ao enviar dados para a impressora"));
            socket.destroy();
          } else {
            socket.destroy();
            resolve();
          }
        }
      );

      socket.on("error", (error: any) => {
        socket.destroy();
        reject(error);
      });

      socket.on("timeout", () => {
        socket.destroy();
        reject(new Error("Timeout na impressão"));
      });
    });
  };

  const printTest = async () => {
    if (!connected) {
      Alert.alert("Não conectado", "Conecte-se à impressora primeiro.");
      return;
    }

    setIsPrinting(true);

    try {
      let commands = "";
      commands += initialize;
      commands += center;
      commands += doubleHeightWidth;
      commands += "TESTE DE IMPRESSÃO\n";
      commands += normalText;
      commands += left;
      commands += "----------------------------\n";
      commands += `IP: ${ip}\n`;
      commands += `Porta: ${port}\n`;
      commands += `Data: ${new Date().toLocaleString()}\n`;
      commands += "----------------------------\n";
      commands += center;
      commands += "Este é um teste de impressão\n";
      commands += "usando protocolo ESC/POS\n";
      commands += cut;

      await sendToPrinter(commands);
      Alert.alert("Sucesso", "Impressão enviada com sucesso!");
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert("Erro", `Falha ao imprimir: ${message}`);
    } finally {
      setIsPrinting(false);
    }
  };

  // Imprime um recibo de exemplo
  const printSampleReceipt = async () => {
    if (!connected) {
      Alert.alert("Não conectado", "Conecte-se à impressora primeiro.");
      return;
    }

    setIsPrinting(true);

    try {
      let commands = "";
      commands += initialize;
      commands += center;
      commands += doubleHeightWidth;
      commands += "LOJA EXEMPLO\n";
      commands += normalText;
      commands += "Rua Teste, 123 - Centro\n";
      commands += "Tel: (11) 1234-5678\n";
      commands += "----------------------------\n";
      commands += left;
      commands += "CUPOM NÃO FISCAL\n";
      commands += `Data: ${new Date().toLocaleString()}\n`;
      commands += "----------------------------\n";
      commands += "Produto         Qtd  Valor\n";
      commands += "Item 1           2  R$ 20,00\n";
      commands += "Item 2           1  R$ 15,50\n";
      commands += "Item 3           3  R$ 10,25\n";
      commands += "----------------------------\n";
      commands += right;
      commands += "Total: R$ 66,25\n";
      commands += center;
      commands += "----------------------------\n";
      commands += "Obrigado pela preferência!\n";
      commands += "Volte sempre!\n";
      commands += cut;

      await sendToPrinter(commands);
      Alert.alert("Sucesso", "Recibo impresso com sucesso!");
    } catch (error: unknown) {
      // Trata o erro para extrair a mensagem com segurança
      let message = "Erro desconhecido";
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }
      Alert.alert("Erro", `Falha ao imprimir recibo: ${message}`);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Configuração Impressora TCP/IP" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Endereço IP da Impressora:</Text>
        <TextInput
          style={styles.input}
          value={ip}
          onChangeText={setIp}
          keyboardType="numeric"
          placeholder="192.168.0.100"
        />

        <Text style={styles.label}>Porta TCP:</Text>
        <TextInput
          style={styles.input}
          value={port}
          onChangeText={setPort}
          keyboardType="numeric"
          placeholder="9100"
        />

        <View style={styles.buttonContainer}>
          <Button
            title={connected ? "Conectado" : "Testar Conexão"}
            onPress={testConnection}
            color={connected ? "#4CAF50" : "#2196F3"}
            disabled={isPrinting}
          />
        </View>

        <Text style={styles.statusText}>
          Status:{" "}
          {connected ? (
            <Text style={{ color: "green" }}>Conectado</Text>
          ) : (
            <Text style={{ color: "red" }}>Desconectado</Text>
          )}
        </Text>

        <View style={styles.printButtons}>
          <TouchableOpacity
            style={[
              styles.printButton,
              (isPrinting || !connected) && styles.disabledButton,
            ]}
            onPress={printTest}
            disabled={isPrinting || !connected}
          >
            <Text style={styles.printButtonText}>Imprimir Teste</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.printButton,
              (isPrinting || !connected) && styles.disabledButton,
            ]}
            onPress={printSampleReceipt}
            disabled={isPrinting || !connected}
          >
            <Text style={styles.printButtonText}>Imprimir Recibo</Text>
          </TouchableOpacity>
        </View>

        {isPrinting && (
          <Text style={styles.printingText}>Enviando para impressora...</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    marginVertical: 15,
  },
  statusText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  printButtons: {
    marginTop: 20,
    gap: 10,
  },
  printButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  printButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  printingText: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
    fontStyle: "italic",
  },
});
