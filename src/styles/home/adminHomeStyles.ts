import Colors from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: 'row',
    backgroundColor: Colors.zinc,
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'center', 
    borderBottomRightRadius: 70,
    paddingHorizontal: 10, 
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10
  },
  brandMain: {
    fontSize: 35,
    fontWeight: 'bold',
    color: Colors.lightGray,
    textTransform: 'uppercase',
    marginRight: 5,
  },
  brandSub: {
    fontSize: 21,
    color: Colors.lightGray,
    marginBottom: 5,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.zinc,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10, // Para alinhar com o texto
  },
  body: {
    alignItems: 'center',
    marginTop: 10
  },
  cashData: {
    alignItems: 'center',
    height: 250,
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 12,

    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Sombra para Android
    elevation: 4,
  },
  statusPatio: {
    alignItems: 'center',
    height: 200,
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 20,

    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Sombra para Android
    elevation: 4,
  }
});
