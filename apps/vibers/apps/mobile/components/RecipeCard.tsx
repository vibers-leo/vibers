import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Zap, Clock, Star } from 'lucide-react-native';

interface RecipeCardProps {
  title: string;
  category: string;
  complexity: string;
  credits: number;
  onPress: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ title, category, complexity, credits, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.overlay}>
        <View style={styles.header}>
            <View style={styles.badge}><Text style={styles.badgeText}>{category}</Text></View>
            <Star size={14} color="#39FF14" fill="#39FF14" />
        </View>
        
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.footer}>
            <View style={styles.meta}>
                <Clock size={12} color="rgba(255,255,255,0.4)" />
                <Text style={styles.metaText}>{complexity}</Text>
            </View>
            <View style={styles.creditBox}>
                <Zap size={10} color="#39FF14" fill="#39FF14" />
                <Text style={styles.creditText}>{credits}</Text>
            </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 160,
    backgroundColor: '#111',
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(57, 255, 20, 0.02)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  badgeText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 8,
    fontWeight: 'black',
    letterSpacing: 1,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  creditBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  creditText: {
    color: '#39FF14',
    fontSize: 12,
    fontWeight: '900',
  }
});
