import { StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  formContainer: {
    gap: 20,
  },
  input: {
    backgroundColor: 'white',
    height: 60,
    fontSize: 16,
  },
  observationContainer: {
    position: 'relative',
  },
  observationInputContainer: {
    position: 'relative',
  },
  observationInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  characterCount: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    color: Colors.gray[500],
    fontSize: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fundo levemente branco para melhor legibilidade
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  photoSection: {
    marginBottom: 10,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.blue.extraLight,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  addPhotoText: {
    color: Colors.blue.dark,
    fontWeight: '500',
  },
  photoPreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.gray.alpha,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    marginTop: 10,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: Colors.blue.dark,
    borderColor: Colors.blue.dark,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[900],
  },
  categoryButtonTextSelected: {
    color: 'white',
  },
  confirmButton: {
    marginTop: 20,
    width: '100%',
  },
});