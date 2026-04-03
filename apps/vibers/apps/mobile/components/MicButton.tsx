import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { Mic } from 'lucide-react-native';

interface MicButtonProps {
  isRecording: boolean;
  onPress: () => void;
}

export const MicButton: React.FC<MicButtonProps> = ({ isRecording, onPress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRecording) {
      // 펄스 애니메이션 (녹음 중일 때)
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.5,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isRecording]);

  return (
    <View style={styles.container}>
      {/* Outer Glow Circles */}
      {isRecording && (
        <>
          <Animated.View 
            style={[
              styles.ring, 
              { 
                transform: [{ scale: pulseAnim }],
                opacity: glowAnim,
                borderColor: '#39FF14'
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.ring, 
              { 
                transform: [{ scale: Animated.multiply(pulseAnim, 1.4) }],
                opacity: Animated.multiply(glowAnim, 0.3),
                borderColor: '#39FF14'
              }
            ]} 
          />
        </>
      )}

      {/* Main Button */}
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.button,
          isRecording && styles.buttonActive
        ]}
      >
        <Mic 
          size={36} 
          color={isRecording ? "#000" : "#39FF14"} 
          strokeWidth={2.5}
        />
      </TouchableOpacity>
      
      <Text style={[styles.label, isRecording && styles.labelActive]}>
        {isRecording ? "LISTENING..." : "VIBE NOW"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1a1a1a',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  buttonActive: {
    backgroundColor: '#39FF14',
    borderColor: '#39FF14',
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  ring: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
  },
  label: {
    marginTop: 16,
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.2)',
    letterSpacing: 3,
  },
  labelActive: {
    color: '#39FF14',
  }
});
