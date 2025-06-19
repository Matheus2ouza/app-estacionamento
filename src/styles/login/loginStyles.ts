import Colors from '@/src/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%'
  },
  heroImage: {
    position: 'absolute',
    top: 80,
    right: -200,
    width: '95%',
    height: '95%',
    transform: [{ scaleX: -1 }],
    resizeMode: 'cover',
    opacity: 0.1,
    zIndex: -1,
  },
  header: {
    paddingHorizontal: 14,
    backgroundColor: Colors.zinc,
    height: 120,
    justifyContent: 'flex-start',
    borderBottomRightRadius: 70,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 35,
  },
  brandMain: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.lightGray,
    textTransform: 'uppercase',
    marginRight: 5,
  },
  brandSub: {
    fontSize: 26,
    color: Colors.lightGray,
    marginBottom: 5,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 100,
    paddingHorizontal: 14,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 15,
    marginLeft: 15
  },
  radioOuterCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.zinc,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInnerCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.zinc,
  },
  radioLabel: {
    fontSize: 13,
    color: '#333',
  },

  pressedLabel: {
    color: '#222',
    textDecorationLine: 'underline',
  },
  button: {
    width: '60%',
    height: 50,
    backgroundColor: Colors.zinc,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupcontainer: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 10
  }
});
