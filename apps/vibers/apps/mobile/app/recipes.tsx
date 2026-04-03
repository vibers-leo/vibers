import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { RecipeCard } from '../components/RecipeCard';
import { Search, ChevronLeft, Sparkles, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const TRENDING_RECIPES = [
  { id: '1', title: 'Neon Profile Card', category: 'COMPONENTS', complexity: 'Entry', credits: 5 },
  { id: '2', title: 'Modern SaaS Hero', category: 'LANDING', complexity: 'Pro', credits: 15 },
];

const COMMUNITY_VIBES = [
  { id: '3', title: 'Glassy Auth Form', category: 'UI KIT', complexity: 'Mid', credits: 10 },
  { id: '4', title: 'Cyberpunk Dashboard', category: 'WEB APP', complexity: 'Expert', credits: 25 },
];

export default function RecipesScreen() {
  const router = useRouter();

  const handleSelectRecipe = (title: string, category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/workspace?recipe=${encodeURIComponent(title)}&recipeCategory=${encodeURIComponent(category)}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>갤러리</Text>
            <TouchableOpacity style={styles.searchBtn}>
                <Search size={22} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
        </View>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            <View style={styles.sectionHeader}>
                <Sparkles size={16} color="#39FF14" />
                <Text style={styles.sectionTitle}>시크릿 레시피</Text>
            </View>
            
            <View style={styles.horizontalScroll}>
                {TRENDING_RECIPES.map(item => (
                    <RecipeCard 
                        key={item.id}
                        title={item.title}
                        category={item.category}
                        complexity={item.complexity}
                        credits={item.credits}
                        onPress={() => handleSelectRecipe(item.title, item.category)}
                    />
                ))}
            </View>

            <View style={[styles.sectionHeader, { marginTop: 40 }]}>
                <Users size={16} color="#007AFF" />
                <Text style={[styles.sectionTitle, { color: '#007AFF' }]}>바이브 SOS (커뮤니티)</Text>
            </View>

            {COMMUNITY_VIBES.map(item => (
                <RecipeCard
                    key={item.id}
                    title={item.title}
                    category={item.category}
                    complexity={item.complexity}
                    credits={item.credits}
                    onPress={() => handleSelectRecipe(item.title, item.category)}
                />
            ))}
            
            <View style={styles.footerNote}>
                <Text style={styles.footerText}>더 많은 레시피가 준비 중입니다.</Text>
            </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a' },
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '900', 
    letterSpacing: 4,
    marginLeft: 10,
  },
  searchBtn: { 
    width: 44, 
    height: 44, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  list: { flex: 1 },
  listContent: { padding: 20, paddingBottom: 60 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: { 
    color: '#39FF14', 
    fontSize: 10, 
    fontWeight: '900', 
    letterSpacing: 2,
  },
  horizontalScroll: {
    marginBottom: 10,
  },
  footerNote: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
