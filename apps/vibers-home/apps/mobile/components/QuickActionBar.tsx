import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Layout, Type, Palette, Component, Sparkles } from 'lucide-react-native';

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  prompt: string;
}

const ACTIONS: QuickAction[] = [
  { id: '1', label: 'Layout', icon: Layout, prompt: "기본 레이아웃 구조를 잡아줘." },
  { id: '2', label: 'Typography', icon: Type, prompt: "폰트 스타일을 더 힙하게 바꿔줘." },
  { id: '3', label: 'Color', icon: Palette, prompt: "색상 조합을 어울리게 변경해줘." },
  { id: '4', label: 'Components', icon: Component, prompt: "자주 쓰이는 UI 컴포넌트를 추가해줘." },
  { id: '5', label: 'Vibe Magic', icon: Sparkles, prompt: "바이버스만의 감각적인 효과를 넣어줘." },
];

interface QuickActionBarProps {
  onActionPress: (prompt: string) => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onActionPress }) => {
  return (
    <View style={styles.outerContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.container}
        >
          {ACTIONS.map((action) => (
            <TouchableOpacity 
              key={action.id} 
              style={styles.actionItem}
              onPress={() => onActionPress(action.prompt)}
            >
              <action.icon size={16} color="#39FF14" strokeWidth={2.5} />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: '#0a0a0a',
    paddingVertical: 12,
  },
  container: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(57, 255, 20, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.15)',
  },
  actionLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
