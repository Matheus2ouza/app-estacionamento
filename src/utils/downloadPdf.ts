import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Platform } from "react-native";

export async function downloadPdf(base64: string, filename: string): Promise<void> {
  try {
    // Solicita permissão para salvar na galeria (necessário para mover depois)
    const { granted } = await MediaLibrary.requestPermissionsAsync();
    if (!granted) {
      throw new Error("Permissão de acesso à mídia negada");
    }

    // Caminho temporário
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    // Salva o PDF no caminho temporário
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (Platform.OS === "android") {
      // Move para a pasta de downloads (usando a galeria como destino)
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
    }

    console.log("PDF salvo em:", fileUri);
  } catch (error) {
    console.error("Erro ao salvar PDF:", error);
    throw error;
  }
}
