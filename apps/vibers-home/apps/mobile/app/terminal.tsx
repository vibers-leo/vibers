import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Platform, TextInput, Alert, Dimensions,
  KeyboardAvoidingView, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Terminal as TerminalIcon, ChevronLeft, Plus, Play, Square,
  Wifi, WifiOff, FolderOpen, Clock, Search, Pin, Send,
  MoreVertical, Trash2, Settings as SettingsIcon, RefreshCw
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { RemoteManager } from '../services/remote-manager';

const { width } = Dimensions.get('window');

// 터미널 세션 타입
interface TermSession {
  id: string;
  projectId: string;
  type: 'cli' | 'server';
  label: string;
  output: string;
  isRunning: boolean;
}

// 프롬프트 히스토리 타입
interface PromptItem {
  id: string;
  text: string;
  timestamp: number;
  pinned: boolean;
}

// 프로젝트 타입
interface Project {
  id: string;
  name: string;
  path: string;
  type: string | null;
  serverCommand: string | null;
}

type ActiveTab = 'cli' | 'server' | 'prompts';

export default function TerminalScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  // 연결 상태
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // 프로젝트 목록
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  // 터미널 세션
  const [sessions, setSessions] = useState<TermSession[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('cli');

  // 명령어 입력
  const [commandInput, setCommandInput] = useState('');
  const inputRef = useRef<TextInput>(null);

  // 프롬프트 히스토리
  const [promptHistory, setPromptHistory] = useState<PromptItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // ------------------------------------------------------------------
  // 자동 연결
  // ------------------------------------------------------------------
  useEffect(() => {
    const init = async () => {
      setIsConnecting(true);
      try {
        const connected = await RemoteManager.autoConnect();
        setIsConnected(connected);
        if (connected) {
          await loadProjects();
        }
      } catch {
        setIsConnected(false);
      }
      setIsConnecting(false);
    };
    init();

    // 연결 상태 리스너
    const statusListener = (connected: boolean) => setIsConnected(connected);
    RemoteManager.onConnectionStatus(statusListener);

    return () => {
      RemoteManager.offConnectionStatus(statusListener);
    };
  }, []);

  // ------------------------------------------------------------------
  // 프로젝트 목록 로드
  // ------------------------------------------------------------------
  const loadProjects = async () => {
    try {
      const list = await RemoteManager.getProjectList();
      setProjects(list);
    } catch (err: any) {
      console.log('프로젝트 목록 로드 실패:', err.message);
    }
  };

  // ------------------------------------------------------------------
  // 터미널 데이터 수신
  // ------------------------------------------------------------------
  useEffect(() => {
    const dataListener = (data: { sessionId: string; data: string }) => {
      setSessions(prev =>
        prev.map(s =>
          s.id === data.sessionId
            ? { ...s, output: s.output + data.data }
            : s
        )
      );
    };

    const exitListener = (data: { sessionId: string; exitCode: number }) => {
      setSessions(prev =>
        prev.map(s =>
          s.id === data.sessionId
            ? { ...s, isRunning: false, output: s.output + `\n[프로세스 종료: 코드 ${data.exitCode}]\n` }
            : s
        )
      );
    };

    RemoteManager.onTerminalData(dataListener);
    RemoteManager.onTerminalExit(exitListener);

    return () => {
      RemoteManager.offTerminalData(dataListener);
      RemoteManager.offTerminalExit(exitListener);
    };
  }, []);

  // 출력 영역 자동 스크롤
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [sessions, activeTab]);

  // ------------------------------------------------------------------
  // 프로젝트 전환
  // ------------------------------------------------------------------
  const switchProject = (idx: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveProjectIdx(idx);
    setActiveTab('cli');
  };

  // ------------------------------------------------------------------
  // CLI 세션 생성
  // ------------------------------------------------------------------
  const createCliSession = async () => {
    const project = projects[activeProjectIdx];
    if (!project) return;

    try {
      const sessionId = await RemoteManager.createTerminalSession(
        project.id, project.path, 'cli'
      );
      const newSession: TermSession = {
        id: sessionId,
        projectId: project.id,
        type: 'cli',
        label: 'CLI',
        output: `📂 ${project.path}\n$ `,
        isRunning: true,
      };
      setSessions(prev => [...prev, newSession]);
      setActiveTab('cli');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err: any) {
      Alert.alert('오류', `CLI 세션 생성 실패: ${err.message}`);
    }
  };

  // ------------------------------------------------------------------
  // 서버 세션 생성
  // ------------------------------------------------------------------
  const createServerSession = async () => {
    const project = projects[activeProjectIdx];
    if (!project) return;

    try {
      const sessionId = await RemoteManager.createTerminalSession(
        project.id, project.path, 'server'
      );
      const label = `서버 ${getServerSessions().length + 1}`;
      const newSession: TermSession = {
        id: sessionId,
        projectId: project.id,
        type: 'server',
        label,
        output: `📂 ${project.path}\n`,
        isRunning: true,
      };
      setSessions(prev => [...prev, newSession]);
      setActiveTab('server');

      // 서버 커맨드 자동 실행
      if (project.serverCommand) {
        RemoteManager.writeToTerminal(sessionId, project.serverCommand + '\n');
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err: any) {
      Alert.alert('오류', `서버 세션 생성 실패: ${err.message}`);
    }
  };

  // ------------------------------------------------------------------
  // 명령어 전송
  // ------------------------------------------------------------------
  const sendCommand = () => {
    if (!commandInput.trim()) return;
    const session = getCurrentSession();
    if (!session) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    RemoteManager.writeToTerminal(session.id, commandInput + '\n');

    // 프롬프트 히스토리에 추가
    const trimmed = commandInput.trim();
    if (trimmed.length > 2) {
      setPromptHistory(prev => {
        const exists = prev.some(p => p.text === trimmed);
        if (exists) return prev;
        return [
          { id: Date.now().toString(), text: trimmed, timestamp: Date.now(), pinned: false },
          ...prev,
        ];
      });
    }

    setCommandInput('');
  };

  // ------------------------------------------------------------------
  // 세션 종료
  // ------------------------------------------------------------------
  const killSession = (sessionId: string) => {
    RemoteManager.killTerminal(sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // ------------------------------------------------------------------
  // 헬퍼
  // ------------------------------------------------------------------
  const activeProject = projects[activeProjectIdx];

  const getCliSession = () =>
    sessions.find(s => s.projectId === activeProject?.id && s.type === 'cli');

  const getServerSessions = () =>
    sessions.filter(s => s.projectId === activeProject?.id && s.type === 'server');

  const getCurrentSession = () => {
    if (activeTab === 'cli') return getCliSession();
    if (activeTab === 'server') return getServerSessions()[0];
    return null;
  };

  const filteredPrompts = searchQuery
    ? promptHistory.filter(p => p.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : promptHistory;

  const pinnedPrompts = filteredPrompts.filter(p => p.pinned);
  const recentPrompts = filteredPrompts.filter(p => !p.pinned);

  // ------------------------------------------------------------------
  // 연결 안 됨 화면
  // ------------------------------------------------------------------
  if (!isConnected) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>베리텀</Text>
            <View style={styles.headerRight} />
          </View>

          <View style={styles.emptyCenter}>
            {isConnecting ? (
              <>
                <ActivityIndicator size="large" color="#39FF14" />
                <Text style={styles.emptyTitle}>PC에 연결 중...</Text>
                <Text style={styles.emptySub}>Desktop Agent에 자동 연결을 시도합니다</Text>
              </>
            ) : (
              <>
                <WifiOff size={48} color="rgba(57,255,20,0.3)" />
                <Text style={styles.emptyTitle}>PC에 연결되지 않음</Text>
                <Text style={styles.emptySub}>
                  PC에서 Desktop Agent를 실행하고{'\n'}
                  원격 연결을 설정해주세요
                </Text>
                <TouchableOpacity
                  style={styles.connectBtn}
                  onPress={() => router.push('/remote')}
                >
                  <Wifi size={16} color="#000" />
                  <Text style={styles.connectBtnText}>PC 연결하기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={async () => {
                    setIsConnecting(true);
                    try {
                      const ok = await RemoteManager.autoConnect();
                      setIsConnected(ok);
                      if (ok) await loadProjects();
                    } catch { /* ignore */ }
                    setIsConnecting(false);
                  }}
                >
                  <RefreshCw size={14} color="#39FF14" />
                  <Text style={styles.retryBtnText}>다시 시도</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ------------------------------------------------------------------
  // 메인 터미널 UI
  // ------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>베리텀</Text>
            <View style={styles.connBadge}>
              <View style={styles.connDot} />
              <Text style={styles.connText}>연결됨</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.headerRight} onPress={loadProjects}>
            <RefreshCw size={16} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        </View>

        {/* 프로젝트 탭 */}
        <View style={styles.projectBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.projectScroll}>
            {projects.map((proj, idx) => (
              <TouchableOpacity
                key={proj.id}
                style={[styles.projectTab, idx === activeProjectIdx && styles.projectTabActive]}
                onPress={() => switchProject(idx)}
              >
                <FolderOpen size={12} color={idx === activeProjectIdx ? '#39FF14' : 'rgba(255,255,255,0.4)'} />
                <Text
                  style={[styles.projectTabText, idx === activeProjectIdx && styles.projectTabTextActive]}
                  numberOfLines={1}
                >
                  {proj.name}
                </Text>
                {proj.type && (
                  <View style={styles.projectTypeBadge}>
                    <Text style={styles.projectTypeText}>{proj.type}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 세션 탭 */}
        <View style={styles.sessionTabBar}>
          <TouchableOpacity
            style={[styles.sessionTab, activeTab === 'cli' && styles.sessionTabActive]}
            onPress={() => {
              setActiveTab('cli');
              if (!getCliSession() && activeProject) createCliSession();
            }}
          >
            <TerminalIcon size={12} color={activeTab === 'cli' ? '#39FF14' : 'rgba(255,255,255,0.4)'} />
            <Text style={[styles.sessionTabText, activeTab === 'cli' && styles.sessionTabTextActive]}>CLI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sessionTab, activeTab === 'server' && styles.sessionTabActive]}
            onPress={() => {
              setActiveTab('server');
              if (getServerSessions().length === 0 && activeProject) createServerSession();
            }}
          >
            <Play size={12} color={activeTab === 'server' ? '#39FF14' : 'rgba(255,255,255,0.4)'} />
            <Text style={[styles.sessionTabText, activeTab === 'server' && styles.sessionTabTextActive]}>서버</Text>
            {getServerSessions().length > 0 && (
              <View style={styles.serverCountBadge}>
                <Text style={styles.serverCountText}>{getServerSessions().length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sessionTab, activeTab === 'prompts' && styles.sessionTabActive]}
            onPress={() => setActiveTab('prompts')}
          >
            <Clock size={12} color={activeTab === 'prompts' ? '#39FF14' : 'rgba(255,255,255,0.4)'} />
            <Text style={[styles.sessionTabText, activeTab === 'prompts' && styles.sessionTabTextActive]}>프롬프트</Text>
          </TouchableOpacity>

          {/* 서버 탭 추가 버튼 */}
          {activeTab === 'server' && (
            <TouchableOpacity style={styles.addServerBtn} onPress={createServerSession}>
              <Plus size={14} color="#39FF14" />
            </TouchableOpacity>
          )}
        </View>

        {/* 터미널 출력 영역 */}
        {activeTab !== 'prompts' ? (
          <ScrollView
            ref={scrollRef}
            style={styles.terminalArea}
            contentContainerStyle={styles.terminalContent}
          >
            {activeTab === 'cli' && getCliSession() && (
              <Text style={styles.termOutput} selectable>{getCliSession()!.output}</Text>
            )}
            {activeTab === 'cli' && !getCliSession() && (
              <View style={styles.termEmpty}>
                <TerminalIcon size={32} color="rgba(57,255,20,0.2)" />
                <Text style={styles.termEmptyText}>CLI 탭을 눌러 세션을 시작하세요</Text>
              </View>
            )}
            {activeTab === 'server' && getServerSessions().length > 0 && (
              <>
                {/* 서버 탭 선택 */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serverTabs}>
                  {getServerSessions().map((s, i) => (
                    <View key={s.id} style={styles.serverTabItem}>
                      <View style={[styles.serverDot, s.isRunning && styles.serverDotRunning]} />
                      <Text style={styles.serverTabLabel}>{s.label}</Text>
                      <TouchableOpacity onPress={() => killSession(s.id)} style={styles.serverCloseBtn}>
                        <Square size={10} color="rgba(255,255,255,0.3)" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
                <Text style={styles.termOutput} selectable>
                  {getServerSessions()[0]?.output}
                </Text>
              </>
            )}
            {activeTab === 'server' && getServerSessions().length === 0 && (
              <View style={styles.termEmpty}>
                <Play size={32} color="rgba(57,255,20,0.2)" />
                <Text style={styles.termEmptyText}>서버 탭을 눌러 개발 서버를 시작하세요</Text>
              </View>
            )}
          </ScrollView>
        ) : (
          /* 프롬프트 히스토리 */
          <View style={styles.promptArea}>
            <View style={styles.promptSearchBar}>
              <Search size={14} color="rgba(255,255,255,0.3)" />
              <TextInput
                style={styles.promptSearchInput}
                placeholder="프롬프트 검색..."
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView style={styles.promptList}>
              {pinnedPrompts.length > 0 && (
                <>
                  <Text style={styles.promptSectionTitle}>고정됨</Text>
                  {pinnedPrompts.map(p => (
                    <PromptCard
                      key={p.id}
                      item={p}
                      onSend={(text) => {
                        setCommandInput(text);
                        setActiveTab('cli');
                      }}
                      onTogglePin={() => {
                        setPromptHistory(prev =>
                          prev.map(x => x.id === p.id ? { ...x, pinned: !x.pinned } : x)
                        );
                      }}
                      onDelete={() => {
                        setPromptHistory(prev => prev.filter(x => x.id !== p.id));
                      }}
                    />
                  ))}
                </>
              )}

              <Text style={styles.promptSectionTitle}>최근</Text>
              {recentPrompts.length === 0 && (
                <Text style={styles.promptEmptyText}>아직 입력된 명령어가 없습니다</Text>
              )}
              {recentPrompts.map(p => (
                <PromptCard
                  key={p.id}
                  item={p}
                  onSend={(text) => {
                    setCommandInput(text);
                    setActiveTab('cli');
                  }}
                  onTogglePin={() => {
                    setPromptHistory(prev =>
                      prev.map(x => x.id === p.id ? { ...x, pinned: !x.pinned } : x)
                    );
                  }}
                  onDelete={() => {
                    setPromptHistory(prev => prev.filter(x => x.id !== p.id));
                  }}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 명령어 입력 바 */}
        {activeTab !== 'prompts' && (
          <View style={styles.inputBar}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrompt}>$</Text>
              <TextInput
                ref={inputRef}
                style={styles.inputField}
                value={commandInput}
                onChangeText={setCommandInput}
                placeholder="명령어 입력..."
                placeholderTextColor="rgba(255,255,255,0.2)"
                onSubmitEditing={sendCommand}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="send"
              />
              <TouchableOpacity onPress={sendCommand} style={styles.sendBtn}>
                <Send size={16} color="#39FF14" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ------------------------------------------------------------------
// 프롬프트 카드 컴포넌트
// ------------------------------------------------------------------
function PromptCard({
  item,
  onSend,
  onTogglePin,
  onDelete,
}: {
  item: PromptItem;
  onSend: (text: string) => void;
  onTogglePin: () => void;
  onDelete: () => void;
}) {
  const timeStr = new Date(item.timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.promptCard}>
      <Text style={styles.promptCardText} numberOfLines={2}>{item.text}</Text>
      <View style={styles.promptCardBottom}>
        <Text style={styles.promptCardTime}>{timeStr}</Text>
        <View style={styles.promptCardActions}>
          <TouchableOpacity onPress={() => onSend(item.text)} style={styles.promptAction}>
            <Play size={12} color="#39FF14" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onTogglePin} style={styles.promptAction}>
            <Pin size={12} color={item.pinned ? '#39FF14' : 'rgba(255,255,255,0.3)'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.promptAction}>
            <Trash2 size={12} color="rgba(255,255,255,0.2)" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ------------------------------------------------------------------
// 스타일
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050505',
  },
  container: {
    flex: 1,
  },

  // 헤더
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#0a0a0a',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  connBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(57,255,20,0.1)',
  },
  connDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#39FF14',
  },
  connText: {
    color: '#39FF14',
    fontSize: 9,
    fontWeight: '700',
  },
  headerRight: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 프로젝트 바
  projectBar: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#0a0a0a',
  },
  projectScroll: {
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
  },
  projectTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  projectTabActive: {
    backgroundColor: 'rgba(57,255,20,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(57,255,20,0.3)',
  },
  projectTabText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 100,
  },
  projectTabTextActive: {
    color: '#39FF14',
  },
  projectTypeBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  projectTypeText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // 세션 탭
  sessionTabBar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#080808',
  },
  sessionTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sessionTabActive: {
    backgroundColor: 'rgba(57,255,20,0.1)',
  },
  sessionTabText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '700',
  },
  sessionTabTextActive: {
    color: '#39FF14',
  },
  serverCountBadge: {
    backgroundColor: '#39FF14',
    borderRadius: 6,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serverCountText: {
    color: '#000',
    fontSize: 8,
    fontWeight: '900',
  },
  addServerBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(57,255,20,0.2)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  // 터미널 영역
  terminalArea: {
    flex: 1,
    backgroundColor: '#050505',
  },
  terminalContent: {
    padding: 12,
    paddingBottom: 24,
  },
  termOutput: {
    color: '#39FF14',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
  },
  termEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    gap: 12,
  },
  termEmptyText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 13,
    fontWeight: '500',
  },

  // 서버 탭 (내부)
  serverTabs: {
    maxHeight: 32,
    marginBottom: 8,
  },
  serverTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  serverDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  serverDotRunning: {
    backgroundColor: '#39FF14',
  },
  serverTabLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
  },
  serverCloseBtn: {
    padding: 2,
  },

  // 입력 바
  inputBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0a0a0a',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(57,255,20,0.15)',
    paddingHorizontal: 14,
    gap: 10,
  },
  inputPrompt: {
    color: '#39FF14',
    fontSize: 14,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  inputField: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 프롬프트 영역
  promptArea: {
    flex: 1,
    backgroundColor: '#050505',
  },
  promptSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  promptSearchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
  },
  promptList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  promptSectionTitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 12,
  },
  promptEmptyText: {
    color: 'rgba(255,255,255,0.15)',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 24,
  },
  promptCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  promptCardText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
    marginBottom: 8,
  },
  promptCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptCardTime: {
    color: 'rgba(255,255,255,0.15)',
    fontSize: 10,
  },
  promptCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  promptAction: {
    padding: 4,
  },

  // 빈 화면 (연결 안 됨)
  emptyCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptySub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#39FF14',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 12,
  },
  connectBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(57,255,20,0.2)',
    marginTop: 8,
  },
  retryBtnText: {
    color: '#39FF14',
    fontSize: 12,
    fontWeight: '700',
  },
});
