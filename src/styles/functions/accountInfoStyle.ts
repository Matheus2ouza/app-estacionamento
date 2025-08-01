import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.white,
  },
  errorText: {
    fontSize: 16,
    color: Colors.gray.dark,
    marginVertical: 20,
    textAlign: "center",
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.blue.logo,
  },
  retryButtonText: {
    color: Colors.white,
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  employeeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.blue.logo,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    color: Colors.gray.dark,
    marginBottom: 4,
  },
  employeeRoleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  employeeRoleLabel: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: Colors.gray.dark,
    marginRight: 4,
  },
  employeeRoleValue: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
  },
  adminRole: {
    color: Colors.blue.logo,
  },
  normalRole: {
    color: Colors.green[500],
  },
  arrowIcon: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    color: Colors.gray.dark,
    marginTop: 16,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.blue.logo,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
});