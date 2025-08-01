import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';

const { width, height } = Dimensions.get('window');

interface DeleteAnimationModalProps {
  visible: boolean;
  onComplete: () => void;
  itemName?: string;
}

export const DeleteAnimationModal: React.FC<DeleteAnimationModalProps> = ({ 
  visible, 
  onComplete,
  itemName = 'item'
}) => {
  const animationRef = useRef<LottieView>(null);
  const [animationState, setAnimationState] = useState<'initial' | 'deleting' | 'success'>('initial');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      startAnimationSequence();
    } else {
      resetAnimation();
    }
  }, [visible]);

  const startAnimationSequence = () => {
    setAnimationState('deleting');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start(() => {
      animationRef.current?.play();
    });
  };

  const resetAnimation = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    setAnimationState('initial');
  };

  const handleAnimationFinish = () => {
    setAnimationState('success');
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(onComplete);
    }, 1000);
  };

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade"
      onRequestClose={() => {}}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={[
          styles.modal, 
          { 
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim
          }
        ]}>
          {animationState === 'deleting' && (
            <>
              <Text style={styles.title}>Excluindo {itemName}...</Text>
              <LottieView
                ref={animationRef}
                source={require('../assets/animations/DeleteFilesLoop.json')}
                autoPlay={false}
                loop={false}
                style={styles.lottie}
                speed={1.5}
                onAnimationFinish={handleAnimationFinish}
              />
            </>
          )}

          {animationState === 'success' && (
            <View style={styles.successContainer}>
              <MaterialCommunityIcons 
                name="check-circle" 
                size={60} 
                color={Colors.green[500]} 
              />
              <Text style={styles.successText}>
                {itemName} excluído com sucesso!
              </Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.white,
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
    width: width * 0.85,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
    color: Colors.gray[800],
    textAlign: 'center',
  },
  lottie: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  successContainer: {
    alignItems: 'center',
    padding: 15,
  },
  successText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    color: Colors.gray[700],
    textAlign: 'center',
  },
});