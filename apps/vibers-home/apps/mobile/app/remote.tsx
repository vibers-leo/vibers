import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Wifi,
  WifiOff,
  Server,
  ChevronLeft,
  RefreshCw,
  Folder,
  ChevronRight,
  AlertCircle,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { RemoteManager } from '../services/remote-manager';

interface RemoteProject {
  id: string;
  name: string;
  path: string;
  type: string | null;
  serverCommand: string | null;
}

export default function RemoteScreen() {
  const router = useRouter();
  const [pcIp, setPcIp] = useState('');
  const [pcToken, setPcToken] = useState('');
  const [pcPort, setPcPort] = useState('3456');
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [projects, setProjects] = useState<RemoteProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    // Load saved configuration
    loadSavedConfig();

    // Listen for connection status
    const statusListener = (status: boolean) => {
      setConnected(status);
    };

    RemoteManager.onConnectionStatus(statusListener);

    // Cleanup
    return () => {
      RemoteManager.offConnectionStatus(statusListener);
    };
  }, []);

  const loadSavedConfig = async () => {
    try {
      const config = await RemoteManager.getSavedPCConfig();
      if (config.ip) setPcIp(config.ip);
      if (config.token) setPcToken(config.token);
      if (config.port) setPcPort(config.port.toString());
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const handleConnect = async () => {
    if (!pcIp.trim()) {
      Alert.alert('입력 오류', 'PC IP 주소를 입력해주세요');
      return;
    }

    if (!pcToken.trim()) {
      Alert.alert('입력 오류', '인증 토큰을 입력해주세요');
      return;
    }

    try {
      setConnecting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const port = parseInt(pcPort, 10) || 3456;
      await RemoteManager.connect(pcIp.trim(), pcToken.trim(), port);

      setConnected(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('연결 성공', 'PC Agent에 연결되었습니다!');

      // Load projects
      await loadProjects();
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('연결 실패', error.message || 'PC Agent에 연결할 수 없습니다');
      setConnected(false);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    RemoteManager.disconnect();
    setConnected(false);
    setProjects([]);
  };

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const projectList = await RemoteManager.getProjectList();
      setProjects(projectList);
    } catch (error: any) {
      Alert.alert('오류', '프로젝트 목록을 가져올 수 없습니다');
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleProjectSelect = (project: RemoteProject) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to workspace with remote project info
    router.push({
      pathname: '/workspace',
      params: {
        remote: 'true',
        projectId: project.id,
        projectPath: project.path,
        projectName: project.name,
        projectType: project.type || 'unknown',
      },
    });
  };

  const getProjectTypeColor = (type: string | null): string => {
    const typeColors: { [key: string]: string } = {
      next: '#39FF14',
      react: '#61DAFB',
      vite: '#646CFF',
      expo: '#000020',
      node: '#339933',
      python: '#3776AB',
      django: '#092E20',
      flask: '#000000',
      rails: '#CC0000',
      go: '#00ADD8',
      rust: '#CE422B',
      git: '#F05032',
    };

    return typeColors[type || 'unknown'] || 'rgba(255,255,255,0.3)';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#39FF14" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PC 원격 제어</Text>
        <View style={styles.connectionStatus}>
          {connected ? (
            <>
              <View style={styles.connectedDot} />
              <Wifi size={20} color="#39FF14" />
            </>
          ) : (
            <WifiOff size={20} color="rgba(255,255,255,0.3)" />
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {!connected ? (
          /* Connection Form */
          <View style={styles.formContainer}>
            <View style={styles.heroSection}>
              <Server size={48} color="#39FF14" strokeWidth={1.5} />
              <Text style={styles.heroTitle}>PC Agent 연결</Text>
              <Text style={styles.heroDesc}>
                로컬 네트워크의 PC Agent에 연결하여{'\n'}
                원격으로 프로젝트를 관리하세요
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PC IP 주소</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="192.168.1.100"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={pcIp}
                  onChangeText={setPcIp}
                  autoCapitalize="none"
                  keyboardType="default"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>포트 (기본: 3456)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="3456"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={pcPort}
                  onChangeText={setPcPort}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>인증 토큰</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={pcToken}
                  onChangeText={setPcToken}
                  autoCapitalize="none"
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.infoBox}>
              <AlertCircle size={16} color="rgba(255,255,255,0.4)" />
              <Text style={styles.infoText}>
                PC에서 vibers-desktop-agent를 실행하면{'\n'}
                IP 주소와 토큰이 표시됩니다
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleConnect}
              style={[styles.connectButton, connecting && styles.connectButtonDisabled]}
              disabled={connecting}
            >
              <BlurView intensity={20} style={styles.connectButtonBlur} tint="dark">
                {connecting ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <>
                    <Wifi size={20} color="#000" strokeWidth={2.5} />
                    <Text style={styles.connectButtonText}>연결하기</Text>
                  </>
                )}
              </BlurView>
            </TouchableOpacity>
          </View>
        ) : (
          /* Projects List */
          <View style={styles.projectsContainer}>
            <View style={styles.projectsHeader}>
              <View>
                <Text style={styles.projectsTitle}>연결된 프로젝트</Text>
                <Text style={styles.projectsSubtitle}>{pcIp}</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={loadProjects} style={styles.refreshButton}>
                  <RefreshCw size={18} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDisconnect} style={styles.disconnectButton}>
                  <Text style={styles.disconnectText}>연결 해제</Text>
                </TouchableOpacity>
              </View>
            </View>

            {loadingProjects ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#39FF14" />
                <Text style={styles.loadingText}>프로젝트 로딩 중...</Text>
              </View>
            ) : projects.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Folder size={48} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>프로젝트가 없습니다</Text>
                <Text style={styles.emptySubtext}>PC의 dev 폴더에 프로젝트를 추가하세요</Text>
              </View>
            ) : (
              <View style={styles.projectsList}>
                {projects.map((project) => (
                  <TouchableOpacity
                    key={project.id}
                    onPress={() => handleProjectSelect(project)}
                    style={styles.projectCard}
                  >
                    <BlurView intensity={10} style={styles.projectCardBlur} tint="dark">
                      <View style={styles.projectCardLeft}>
                        <View
                          style={[
                            styles.projectTypeIndicator,
                            { backgroundColor: getProjectTypeColor(project.type) },
                          ]}
                        />
                        <View style={styles.projectInfo}>
                          <Text style={styles.projectName}>{project.name}</Text>
                          <Text style={styles.projectPath}>{project.path}</Text>
                          {project.type && (
                            <View style={styles.projectBadge}>
                              <Text style={styles.projectType}>{project.type.toUpperCase()}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#39FF14',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  formContainer: {
    gap: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 16,
    letterSpacing: -0.5,
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  inputWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  input: {
    color: '#fff',
    fontSize: 15,
    padding: 16,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(57, 255, 20, 0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.1)',
  },
  infoText: {
    flex: 1,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  connectButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 8,
  },
  connectButtonDisabled: {
    opacity: 0.5,
  },
  connectButtonBlur: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#39FF14',
  },
  connectButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  projectsContainer: {
    gap: 24,
  },
  projectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  projectsTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  projectsSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disconnectButton: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,0,0,0.1)',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,0,0,0.2)',
  },
  disconnectText: {
    color: '#ff4444',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    fontWeight: '600',
  },
  projectsList: {
    gap: 12,
  },
  projectCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  projectCardBlur: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  projectCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  projectTypeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  projectInfo: {
    flex: 1,
    gap: 4,
  },
  projectName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  projectPath: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontWeight: '600',
  },
  projectBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  projectType: {
    color: '#39FF14',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
