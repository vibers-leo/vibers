import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Zap } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Fade In & Scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      // 2. Rotate Logo slightly
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // 3. Wait and then Finish
      Animated.delay(1000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  const rotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.backgroundDecor1} />
      <View style={styles.backgroundDecor2} />
      
      <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
        <Animated.View style={[styles.logoBox, { transform: [{ rotate }] }]}>
          <Text style={styles.logoText}>V</Text>
          <View style={styles.logoGlow} />
        </Animated.View>
        
        <View style={styles.textContainer}>
          <Text style={styles.brandName}>vibers</Text>
          <View style={styles.taglineRow}>
            <Zap size={12} color="#39FF14" />
            <Text style={styles.tagline}>FEEL THE VIBE, BUILD THE WORLD</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.version}>v1.0.0 ALPHA</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0a0a',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundDecor1: {
    position: 'absolute',
    top: -height * 0.2,
    left: -width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(57, 255, 20, 0.03)',
  },
  backgroundDecor2: {
    position: 'absolute',
    bottom: -height * 0.2,
    right: -width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(57, 100, 255, 0.03)',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  logoBox: {
    width: 100,
    height: 100,
    borderWidth: 4,
    borderColor: '#39FF14',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(57, 255, 20, 0.05)',
  },
  logoGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#39FF14',
    opacity: 0.1,
    borderRadius: 20,
  },
  logoText: {
    color: '#39FF14',
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -2,
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    color: '#fff',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: -1.5,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.4,
  },
  tagline: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
  },
  version: {
    color: 'rgba(255, 255, 255, 0.15)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});
