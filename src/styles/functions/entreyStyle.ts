import { StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    position: "absolute",
    top: 80,
    right: -270,
    width: "130%",
    height: "95%",
    transform: [{ scaleX: -1 }],
    resizeMode: "cover",
    opacity: 0.1,
    zIndex: -1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: "Roboto_700Bold",
    fontSize: 18,
    color: Colors.blue.logo,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    color: Colors.gray.dark,
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  observationInput: {
    height: 100,
  },
  characterCount: {
    alignSelf: 'flex-end',
    color: Colors.gray.dark,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  photoSection: {
    marginTop: 8,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  addPhotoText: {
    color: Colors.blue.logo,
    fontFamily: "Roboto_500Medium",
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
    backgroundColor: Colors.red[500],
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray.light,
    backgroundColor: Colors.white,
  },
  categoryButtonSelected: {
    backgroundColor: Colors.blue.logo,
    borderColor: Colors.blue.logo,
  },
  categoryButtonText: {
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    color: Colors.gray.dark,
  },
  categoryButtonTextSelected: {
    color: Colors.white,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'transparent',
  },
  createButton: {
    width: "100%",
    borderRadius: 8,
  },
});