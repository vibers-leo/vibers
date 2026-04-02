import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ImageBackground, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Mic, Zap, MessageSquare, LayoutGrid, ChevronRight, History, Sparkles, Plus, Settings as SettingsIcon, Wifi, Code, Terminal } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { SplashScreen } from '../components/SplashScreen';
import { StorageService } from '../services/storage';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [hasHistory, setHasHistory] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const checkHistory = async () => {
      const history = await StorageService.getChatHistory();
      if (history && history.length > 0) {
        setHasHistory(true);
      }
    };
    checkHistory();
    
    if (!showSplash) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [showSplash]);

  const handleEnter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/workspace');
  };

  const handleGallery = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/recipes');
  };

  const handleRemote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/remote');
  };

  const handleVSCode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/vscode');
  };

  const handleTerminal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/terminal');
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/hero_bg.png')} 
        style={styles.bgImage}
        resizeMode="cover"
      >
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Bar */}
            <View style={styles.header}>
              <View style={styles.logoRow}>
                <View style={styles.logoIcon}>
                  <Text style={styles.logoText}>바</Text>
                </View>
                <Text style={styles.brandName}>바이버스</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsIcon}>
                 <SettingsIcon size={20} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </View>

            {/* Hero Main */}
            <View style={styles.hero}>
              <View style={styles.heroTitleBox}>
                <Text style={styles.heroTitleMain}>크리에이티브</Text>
                <Text style={styles.heroTitleSub}>인텔리전스.</Text>
                <View style={styles.heroLine} />
              </View>

              <Text style={styles.heroDesc}>
                당신의 목소리에서 시작되는{"\n"}
                가장 완벽한 소프트웨어 설계.
              </Text>

              <View style={styles.statusRow}>
                <View style={styles.liveBadge}>
                   <View style={styles.liveDot} />
                   <Text style={styles.liveText}>준비 완료</Text>
                </View>
                <Text style={styles.modelName}>VERTEX AI PRO 1.5</Text>
              </View>
            </View>

            {/* Quick Access Grid */}
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                onPress={handleEnter}
                activeOpacity={0.9}
                style={styles.mainCard}
              >
                <BlurView intensity={20} style={styles.cardBlur} tint="dark">
                  <View style={styles.cardHeader}>
                    <View style={styles.iconCircle}>
                      <Mic size={28} color="#000" strokeWidth={2.5} />
                    </View>
                    <Plus size={16} color="rgba(255,255,255,0.3)" />
                  </View>
                  <View style={styles.cardTexts}>
                    <Text style={styles.cardTitle}>새 세션</Text>
                    <Text style={styles.cardSub}>에이전트와 함께 빌드 시작</Text>
                  </View>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleTerminal}
                activeOpacity={0.9}
                style={styles.remoteCard}
              >
                <BlurView intensity={15} style={styles.remoteCardBlur} tint="dark">
                  <View style={styles.remoteCardContent}>
                    <Terminal size={24} color="#39FF14" strokeWidth={2} />
                    <View style={styles.remoteCardTexts}>
                      <Text style={styles.remoteCardTitle}>베리텀</Text>
                      <Text style={styles.remoteCardSub}>모바일 터미널로 PC 개발환경 제어</Text>
                    </View>
                    <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
                  </View>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRemote}
                activeOpacity={0.9}
                style={styles.remoteCard}
              >
                <BlurView intensity={15} style={styles.remoteCardBlur} tint="dark">
                  <View style={styles.remoteCardContent}>
                    <Wifi size={24} color="#39FF14" strokeWidth={2} />
                    <View style={styles.remoteCardTexts}>
                      <Text style={styles.remoteCardTitle}>PC 원격 제어</Text>
                      <Text style={styles.remoteCardSub}>원격으로 PC 프로젝트 관리</Text>
                    </View>
                    <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
                  </View>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleVSCode}
                activeOpacity={0.9}
                style={styles.remoteCard}
              >
                <BlurView intensity={15} style={styles.remoteCardBlur} tint="dark">
                  <View style={styles.remoteCardContent}>
                    <Code size={24} color="#39FF14" strokeWidth={2} />
                    <View style={styles.remoteCardTexts}>
                      <Text style={styles.remoteCardTitle}>VSCode 원격</Text>
                      <Text style={styles.remoteCardSub}>VSCode를 모바일에서 제어</Text>
                    </View>
                    <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
                  </View>
                </BlurView>
              </TouchableOpacity>

              <View style={styles.subGrid}>
                <TouchableOpacity onPress={handleGallery} style={styles.smallCard}>
                  <BlurView intensity={10} style={styles.smallCardBlur} tint="dark">
                    <LayoutGrid size={20} color="#39FF14" />
                    <Text style={styles.smallCardTitle}>갤러리</Text>
                  </BlurView>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/workspace')} style={styles.smallCard}>
                  <BlurView intensity={10} style={styles.smallCardBlur} tint="dark">
                    <History size={20} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.smallCardTitle}>세션 기록</Text>
                  </BlurView>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Session Peek */}
            {hasHistory && (
              <TouchableOpacity 
                style={styles.recentBar}
                onPress={() => router.push('/workspace')}
              >
                <BlurView intensity={15} style={styles.recentBlur} tint="dark">
                  <History size={16} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.recentText}>최근 작업하던 프로젝트가 있어요</Text>
                  <ChevronRight size={14} color="#39FF14" />
                </BlurView>
              </TouchableOpacity>
            )}

            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Footer Navigation Overlay */}
          <BlurView intensity={40} style={styles.footerNav} tint="dark">
             <View style={styles.footerInner}>
                <TouchableOpacity style={styles.footerTabActive}>
                   <Zap size={20} color="#39FF14" />
                   <View style={styles.footerDot} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/workspace')} style={styles.footerTab}>
                   <MessageSquare size={20} color="rgba(255,255,255,0.3)" />
                </TouchableOpacity>
             </View>
          </BlurView>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#39FF14',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
  },
  brandName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    marginBottom: 48,
  },
  heroTitleBox: {
    marginBottom: 16,
  },
  heroTitleMain: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '900',
    lineHeight: 56,
    letterSpacing: -2,
  },
  heroTitleSub: {
    color: '#39FF14',
    fontSize: 56,
    fontWeight: '900',
    lineHeight: 56,
    letterSpacing: -2,
    marginTop: -4,
  },
  heroLine: {
    width: 40,
    height: 4,
    backgroundColor: '#39FF14',
    marginTop: 12,
    borderRadius: 2,
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.2)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#39FF14',
  },
  liveText: {
    color: '#39FF14',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  modelName: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  actionGrid: {
    gap: 12,
    marginBottom: 24,
  },
  mainCard: {
    height: 180,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardBlur: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 56,
    height: 56,
    backgroundColor: '#39FF14',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTexts: {
    gap: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '600',
  },
  remoteCard: {
    height: 72,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.2)',
  },
  remoteCardBlur: {
    flex: 1,
  },
  remoteCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  remoteCardTexts: {
    flex: 1,
    gap: 2,
  },
  remoteCardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  remoteCardSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
  },
  subGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  smallCard: {
    flex: 1,
    height: 80,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  smallCardBlur: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  smallCardTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  recentBar: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 12,
  },
  recentBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  recentText: {
    flex: 1,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '700',
  },
  footerNav: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  footerInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  footerTabActive: {
    alignItems: 'center',
    gap: 4,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#39FF14',
  },
  footerTab: {
    opacity: 0.5,
  }
});
