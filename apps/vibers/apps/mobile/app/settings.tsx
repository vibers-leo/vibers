import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, Animated } from 'react-native';
import { ChevronLeft, Github, Key, CreditCard, ShieldCheck, Save, Zap, User, Star, Server } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { StorageService } from '../services/storage';
import { RemoteManager } from '../services/remote-manager';

import { PaymentService, VIBE_PACKAGES, SUBSCRIPTION_PLANS } from '../services/payment';

export default function SettingsScreen() {
  const router = useRouter();
  const [githubToken, setGithubToken] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [vertexProjectId, setVertexProjectId] = useState('');
  const [vertexLocation, setVertexLocation] = useState('us-central1');
  const [credits, setCredits] = useState(0);
  const [subscription, setSubscription] = useState<'Free' | 'Pro' | 'Enterprise'>('Free');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // PC Agent Connection Settings
  const [pcIp, setPcIp] = useState('');
  const [pcPort, setPcPort] = useState('3456');
  const [pcToken, setPcToken] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const token = await StorageService.getGitHubToken();
      const gkey = await StorageService.getGeminiKey();
      const vconfig = await StorageService.getVertexConfig();
      const creds = await StorageService.getCredits();
      const tier = await StorageService.getSubscriptionTier();
      
      if (token) setGithubToken(token);
      if (gkey) setGeminiKey(gkey);
      if (vconfig.projectId) setVertexProjectId(vconfig.projectId);
      if (vconfig.location) setVertexLocation(vconfig.location);
      setCredits(creds);
      setSubscription(tier);

      // Load PC Agent settings
      const pcConfig = await RemoteManager.getSavedPCConfig();
      if (pcConfig.ip) setPcIp(pcConfig.ip);
      if (pcConfig.token) setPcToken(pcConfig.token);
      if (pcConfig.port) setPcPort(pcConfig.port.toString());
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }).start();
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      await StorageService.saveGitHubToken(githubToken);
      await StorageService.saveGeminiKey(geminiKey);
      await StorageService.saveVertexConfig(vertexProjectId, vertexLocation);

      // Save PC Agent settings (secure storage for IP and token)
      await StorageService.savePcConfig(pcIp, pcToken, pcPort);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('저장 완료', '모든 설정이 성공적으로 저장되었습니다.');
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('오류', '설정 저장 중 문제가 발생했습니다.');
    }
  };

  const handlePurchase = async (pkgId: string) => {
    setIsProcessing(true);
    const success = await PaymentService.processPayment(pkgId);
    if (success) {
        const newCredits = await StorageService.getCredits();
        setCredits(newCredits);
        Alert.alert('결제 성공', 'Vibe가 성공적으로 충전되었습니다!');
    }
    setIsProcessing(false);
  };

  const handleUpgrade = async (planId: string) => {
    const success = await PaymentService.updateSubscription(planId);
    if (success) {
        setSubscription(planId === 'pro' ? 'Pro' : 'Free');
        Alert.alert('구독 갱신', `${planId.toUpperCase()} 플랜으로 전환되었습니다.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CONFIG CABINET</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <BlurView intensity={20} tint="dark" style={styles.profileCard}>
             <View style={styles.profileAvatar}>
                <User size={32} color="#000" />
                <View style={styles.tierBadge}>
                   <Star size={10} color="#000" />
                </View>
             </View>
             <View style={styles.profileInfo}>
                <Text style={styles.profileName}>LEO COLLABORATOR</Text>
                <View style={styles.tierStatus}>
                   <Text style={styles.tierText}>{subscription.toUpperCase()} MEMBER</Text>
                   <View style={styles.statusDot} />
                   <Text style={styles.creditText}>{credits} VIBES</Text>
                </View>
             </View>
          </BlurView>

          {/* Section: Subscription */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Zap size={18} color="#39FF14" />
              <Text style={styles.sectionTitle}>MEMBERSHIP PLAN</Text>
            </View>
            <View style={styles.planContainer}>
              {SUBSCRIPTION_PLANS.map(plan => (
                <TouchableOpacity 
                  key={plan.id} 
                  style={[styles.planCard, subscription.toLowerCase() === plan.id && styles.activePlanCard]}
                  onPress={() => handleUpgrade(plan.id)}
                >
                   <View style={styles.planHeader}>
                      <Text style={[styles.planName, subscription.toLowerCase() === plan.id && { color: '#000' }]}>{plan.name}</Text>
                      {subscription.toLowerCase() === plan.id && (
                        <View style={styles.currentLabel}><Text style={styles.currentLabelText}>ACTIVE</Text></View>
                      )}
                   </View>
                   <Text style={[styles.planPrice, subscription.toLowerCase() === plan.id && { color: '#000' }]}>₩{plan.price.toLocaleString()}</Text>
                   <Text style={[styles.planPeriod, subscription.toLowerCase() === plan.id && { color: 'rgba(0,0,0,0.5)' }]}>per month</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Section: Vibes (Credits) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CreditCard size={18} color="#39FF14" />
              <Text style={styles.sectionTitle}>RECHARGE VIBES</Text>
            </View>
            <View style={styles.vibeGrid}>
              {VIBE_PACKAGES.map(pkg => (
                <TouchableOpacity 
                  key={pkg.id} 
                  style={styles.vibeCard}
                  onPress={() => handlePurchase(pkg.id)}
                  disabled={isProcessing}
                >
                  <BlurView intensity={10} tint="dark" style={styles.vibeCardInner}>
                    <Text style={styles.vibeAmount}>{pkg.vibeAmount}</Text>
                    <Text style={styles.vibeUnit}>VIBES</Text>
                    <View style={styles.vibePriceTag}>
                      <Text style={styles.vibePrice}>₩{pkg.price.toLocaleString()}</Text>
                    </View>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Section: API Keys */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ShieldCheck size={18} color="#39FF14" />
              <Text style={styles.sectionTitle}>AGENT ENGINE SETTINGS</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>GCP PROJECT ID</Text>
              <TextInput
                style={styles.input}
                value={vertexProjectId}
                onChangeText={setVertexProjectId}
                placeholder="my-vibers-project"
                placeholderTextColor="rgba(255,255,255,0.2)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>VERTEX LOCATION</Text>
              <TextInput
                style={styles.input}
                value={vertexLocation}
                onChangeText={setVertexLocation}
                placeholder="us-central1"
                placeholderTextColor="rgba(255,255,255,0.2)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>GEMINI API KEY</Text>
              <TextInput
                style={styles.input}
                value={geminiKey}
                onChangeText={setGeminiKey}
                placeholder="AIza..."
                placeholderTextColor="rgba(255,255,255,0.2)"
                secureTextEntry
              />
            </View>
          </View>

          {/* Section: GitHub */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Github size={18} color="#39FF14" />
              <Text style={styles.sectionTitle}>GIT-COMMIT BRIDGE</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PERSONAL ACCESS TOKEN</Text>
              <TextInput
                style={styles.input}
                value={githubToken}
                onChangeText={setGithubToken}
                placeholder="ghp_..."
                placeholderTextColor="rgba(255,255,255,0.2)"
                secureTextEntry
              />
            </View>
          </View>

          {/* Section: PC Agent */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Server size={18} color="#39FF14" />
              <Text style={styles.sectionTitle}>PC AGENT CONNECTION</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PC IP ADDRESS</Text>
              <TextInput
                style={styles.input}
                value={pcIp}
                onChangeText={setPcIp}
                placeholder="192.168.1.100"
                placeholderTextColor="rgba(255,255,255,0.2)"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PORT</Text>
              <TextInput
                style={styles.input}
                value={pcPort}
                onChangeText={setPcPort}
                placeholder="3456"
                placeholderTextColor="rgba(255,255,255,0.2)"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>AUTH TOKEN</Text>
              <TextInput
                style={styles.input}
                value={pcToken}
                onChangeText={setPcToken}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                placeholderTextColor="rgba(255,255,255,0.2)"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color="#000" />
            <Text style={styles.saveButtonText}>CONFIRM CHANGES</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  container: {
    flex: 1,
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 40,
    overflow: 'hidden',
  },
  profileAvatar: {
    width: 64,
    height: 64,
    backgroundColor: '#39FF14',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tierBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#39FF14',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  tierStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierText: {
    color: '#39FF14',
    fontSize: 10,
    fontWeight: '900',
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  creditText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  planContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  planCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activePlanCard: {
    backgroundColor: '#39FF14',
    borderColor: '#39FF14',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  currentLabel: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentLabelText: {
    color: '#000',
    fontSize: 7,
    fontWeight: '900',
  },
  planPrice: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  planPeriod: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  vibeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  vibeCard: {
    flex: 1,
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  vibeCardInner: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vibeAmount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },
  vibeUnit: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  vibePriceTag: {
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  vibePrice: {
    color: '#39FF14',
    fontSize: 9,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 18,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#39FF14',
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  }
});
