import Colors from '@/src/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    overflow: 'visible'
  },
  heroImage: {
    position: 'absolute',
    top: 80,
    right: -270,
    width: '130%',
    height: '95%',
    transform: [{ scaleX: -1 }],
    resizeMode: 'cover',
    opacity: 0.1,
    zIndex: -1,
  },
  header: {
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
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
    color: Colors.gray[100],
    textTransform: 'uppercase',
    marginRight: 5,
  },
  brandSub: {
    fontSize: 26,
    color: Colors.gray[100],
    marginBottom: 5,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 200,
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
    borderColor: Colors.gray.zinc,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInnerCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.gray.zinc,
  },
  radioLabel: {
    fontSize: 13,
    color: Colors.text.primary,
  },
  pressedLabel: {
    color: Colors.text.primary,
    textDecorationLine: 'underline',
  },
  button: {
    width: '60%',
    height: 50,
    backgroundColor: Colors.gray.zinc,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.text.inverse,
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupcontainer: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 10
  }
});
