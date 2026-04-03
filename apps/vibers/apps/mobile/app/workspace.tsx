import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, TextInput } from 'react-native';
import { Bot, User, Check, X, Loader2, ShieldCheck, Github, Eye, Mic, Settings, LayoutGrid, Code, Sparkles, Zap, ExternalLink, Terminal, Send } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import { generateVibeCode } from '../services/gemini';
import { PreviewModal } from '../components/PreviewModal';
import { MicButton } from '../components/MicButton';
import { QuickActionBar } from '../components/QuickActionBar';
import { StorageService } from '../services/storage';
import { syncToGitHub, getCurrentUser } from '../services/github';
import { RemoteManager } from '../services/remote-manager';
import { transcribeAudio } from '../services/stt';
import { useEffect } from 'react';

export default function WorkspaceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Remote mode detection
  const isRemoteMode = params.remote === 'true';
  const recipeTitle = params.recipe as string | undefined;
  const recipeCategory = params.recipeCategory as string | undefined;
  const [remoteSessionId, setRemoteSessionId] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [commandInput, setCommandInput] = useState<string>('');
  const [recipeProcessed, setRecipeProcessed] = useState(false);

  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      role: 'agent',
      content: '안녕하세요 레오님! 오늘 무엇을 기획해볼까요? 말씀만 하시면 제가 바로 코딩을 시작할게요.',
      status: 'done'
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [credits, setCredits] = useState(100);
  
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [currentPreviewFiles, setCurrentPreviewFiles] = useState<any[]>([]);
  const [isTutorialMode, setIsTutorialMode] = useState(false);
  
  // Audio Recording State
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const history = await StorageService.getChatHistory();
      if (history && history.length > 0) {
        setMessages(history);
      }
      
      const savedCredits = await StorageService.getCredits();
      setCredits(savedCredits);
    };
    loadHistory();
  }, []);

  // Save history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      StorageService.saveChatHistory(messages);
    }
  }, [messages]);

  useEffect(() => {
    StorageService.saveCredits(credits);
  }, [credits]);

  // Recipe auto-trigger: generate code from selected recipe template
  useEffect(() => {
    if (!recipeTitle || recipeProcessed) return;
    setRecipeProcessed(true);

    const categoryLabel = recipeCategory || 'COMPONENTS';
    const prompt = `"${recipeTitle}" 템플릿을 만들어줘. 카테고리: ${categoryLabel}. Neon Cyber 디자인 시스템(#39FF14 accent, 다크 배경)을 적용하고, 즉시 사용 가능한 완전한 코드를 생성해줘.`;
    processRecording(prompt);
  }, [recipeTitle, recipeProcessed]);

  // Remote Terminal Session Setup
  useEffect(() => {
    if (!isRemoteMode) return;

    const initRemoteTerminal = async () => {
      try {
        const projectPath = params.projectPath as string;
        const projectId = params.projectId as string;

        // Create terminal session
        const sessionId = await RemoteManager.createTerminalSession(
          projectId,
          projectPath,
          'cli'
        );
        setRemoteSessionId(sessionId);
        setTerminalOutput(`Connected to remote project: ${params.projectName}\nPath: ${projectPath}\n\n$ `);

        // Listen for terminal data
        const handleTerminalData = (data: { sessionId: string; data: string }) => {
          if (data.sessionId === sessionId) {
            setTerminalOutput((prev) => prev + data.data);
          }
        };

        RemoteManager.onTerminalData(handleTerminalData);

        return () => {
          RemoteManager.offTerminalData(handleTerminalData);
          if (sessionId) {
            RemoteManager.killTerminal(sessionId);
          }
        };
      } catch (error: any) {
        setTerminalOutput(`Error creating remote session: ${error.message}`);
      }
    };

    initRemoteTerminal();
  }, [isRemoteMode, params]);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    setRecording(null);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (uri) {
        try {
          const result = await transcribeAudio(uri, 'ko-KR');
          processRecording(result.text);
        } catch (sttError) {
          console.error('STT failed:', sttError);
          processRecording("네온 그린 테마의 멋진 프로필 카드를 만들어줘.");
        }
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const handleMicPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const processRecording = async (userInput: string) => {
    setIsThinking(true);
    
    const userMsg = {
        id: Date.now().toString(),
        role: 'user',
        content: userInput,
        status: 'done'
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await generateVibeCode(userInput, "", isTutorialMode);
      
      setIsThinking(false);
      
      const agentMsg = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: response.message,
        status: 'proposal',
        files: response.files,
        nextSteps: response.nextSteps,
        vibeTip: response.vibeTip,
        isTutorial: isTutorialMode
      };

      // 도출된 코드들을 프리뷰 파일셋으로 설정
      if (response.files && response.files.length > 0) {
        setCurrentPreviewFiles(response.files);
      }
      
      setMessages(prev => [...prev, agentMsg]);
      
      // 최신 크레딧 잔액 동기화
      const latestCredits = await StorageService.getCredits();
      setCredits(latestCredits);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      setIsThinking(false);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: `⚠️ **Brain Alert**: ${error.message || "작업을 처리하는 중에 문제가 발생했습니다."}`,
        status: 'done'
      };
      setMessages(prev => [...prev, errorMsg]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleApprove = async (msgId: string, files: any[], commitMsg: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'pushing' } : m));

    try {
      const token = await StorageService.getGitHubToken();
      if (!token) {
        throw new Error("GitHub 토큰이 설정되지 않았습니다. 설정에서 토큰을 입력해주세요.");
      }

      const user = await getCurrentUser(token);
      if (!user) throw new Error("GitHub 사용자 정보를 가져올 수 없습니다.");

      const result: any = await syncToGitHub({
        token: token,
        repo: 'vibers-studio-project', // 기본 프로젝트 명
        owner: user.login,
        files: files.map(f => ({ path: f.path, content: f.content })),
        message: commitMsg || 'feat: update from vibers agent'
      });

      if (result.success) {
        setMessages(prev => [
          ...prev.map(m => m.id === msgId ? { ...m, status: 'done' } : m),
          {
            id: Date.now().toString(),
            role: 'agent',
            content: `🚀 **GitHub Auto-Sync 완료**\n\n에이전트가 설계한 코드를 저장소에 성공적으로 푸시했습니다!\n\n• 커밋: \`${result.commitHash}\`\n• 저장소: [${result.url}](${result.url})`,
            status: 'done'
          }
        ]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error: any) {
      setMessages(prev => [
        ...prev.map(m => m.id === msgId ? { ...m, status: 'proposal' } : m),
        {
          id: Date.now().toString(),
          role: 'agent',
          content: `❌ **동기화 실패**: ${error.message || "알 수 없는 오류가 발생했습니다."}`,
          status: 'done'
        }
      ]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleReject = (msgId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'rejected', content: '(취소된 제안입니다)' } : m));
  };

  const handleSendCommand = () => {
    if (!commandInput.trim() || !remoteSessionId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    RemoteManager.writeToTerminal(remoteSessionId, commandInput + '\n');
    setCommandInput('');
  };

  // Remote Terminal UI
  if (isRemoteMode) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Remote Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>← BACK</Text>
            </TouchableOpacity>
            <View style={styles.remoteHeaderInfo}>
              <Terminal size={16} color="#39FF14" />
              <Text style={styles.remoteProjectName}>{params.projectName}</Text>
            </View>
            <View style={styles.remoteTypeBadge}>
              <Text style={styles.remoteTypeText}>{params.projectType?.toString().toUpperCase()}</Text>
            </View>
          </View>

          {/* Terminal Output */}
          <ScrollView style={styles.terminalContainer} contentContainerStyle={styles.terminalContent}>
            <Text style={styles.terminalText}>{terminalOutput}</Text>
          </ScrollView>

          {/* Command Input */}
          <View style={styles.commandInputContainer}>
            <View style={styles.commandInputWrapper}>
              <Text style={styles.commandPrompt}>$</Text>
              <TextInput
                style={styles.commandInput}
                value={commandInput}
                onChangeText={setCommandInput}
                placeholder="Enter command..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                onSubmitEditing={handleSendCommand}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={handleSendCommand} style={styles.sendButton}>
                <Send size={18} color="#39FF14" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Normal Workspace UI
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Modern Studio Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleGroup}>
             <TouchableOpacity 
                style={styles.headerIconCircle}
                onPress={() => router.push('/settings')}
              >
                <Settings size={18} color="#39FF14" />
             </TouchableOpacity>
             <View>
                <Text style={styles.headerMainTitle}>MAIN PROJECT</Text>
                <View style={styles.headerSubGroup}>
                   <View style={styles.statusDotLive} />
                   <Text style={styles.headerSubTitle}>ACTIVE STUDIO</Text>
                </View>
             </View>
          </View>
          
          <View style={styles.headerRightGroup}>
             <TouchableOpacity 
               style={[styles.headerCreditsBox, isTutorialMode && styles.tutorialCredits]}
               onPress={() => setIsTutorialMode(!isTutorialMode)}
             >
               <Text style={[styles.creditVal, isTutorialMode && { color: '#007AFF' }]}>
                 {isTutorialMode ? 'FREE' : credits}
               </Text>
               <Text style={[styles.creditUnit, isTutorialMode && { color: '#007AFF' }]}>VIBERS</Text>
             </TouchableOpacity>

             <View style={[styles.liveBadge, isTutorialMode && { borderColor: '#007AFF' }]}>
                <Text style={[styles.liveBadgeText, isTutorialMode && { color: '#007AFF' }]}>
                  {isTutorialMode ? 'TUTORIAL' : 'LIVE'}
                </Text>
                <Sparkles size={10} color={isTutorialMode ? "#007AFF" : "#39FF14"} />
             </View>
          </View>
        </View>

        {isTutorialMode && (
          <View style={styles.tutorialAlert}>
            <Text style={styles.tutorialAlertText}>🎁 SANDBOX MODE: No vibes will be consumed.</Text>
          </View>
        )}

        <View style={styles.studioBody}>
          {/* Left: Chat Timeline */}
          <View style={styles.timelineContainer}>
            <ScrollView 
                ref={scrollViewRef}
                style={styles.chatArea}
                contentContainerStyle={styles.chatContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((msg) => (
                <View key={msg.id} style={[styles.msgWrapper, msg.role === 'user' ? styles.userWrapper : styles.agentWrapper]}>
                  {msg.role === 'agent' && (
                    <View style={styles.agentMarker}>
                       <Bot size={12} color="#39FF14" />
                    </View>
                  )}
                  <View style={[styles.msgBubble, msg.role === 'user' ? styles.userBubbleV4 : styles.agentBubbleV4]}>
                    <Text style={[styles.msgText, msg.role === 'agent' && styles.agentTxt]}>{msg.content}</Text>
                  </View>
                  
                  {msg.status === 'proposal' && (
                    <View style={styles.v4ProposalContainer}>
                       <View style={styles.v4ProposalHeader}>
                          <Text style={styles.v4ProposalTitle}>ANTIGRAVITY PROPOSAL</Text>
                          <Text style={styles.v4ProposalCounter}>{msg.files?.length || 0} FILES SYNTHESIZED</Text>
                       </View>
                       
                       <View style={styles.v4FileList}>
                           {msg.files?.map((f: any, i: number) => (
                              <View key={i} style={styles.v4FileItem}>
                                 <Code size={12} color="#39FF14" />
                                 <Text style={styles.v4FileName} numberOfLines={1}>{f.path}</Text>
                              </View>
                           ))}
                       </View>

                       <View style={styles.v4ActionGroup}>
                         <TouchableOpacity 
                           style={styles.v4ConfirmBtn}
                           onPress={() => handleApprove(msg.id, msg.files, msg.suggestedCommitMessage)}
                         >
                           <Text style={styles.v4ConfirmTxt}>EXECUTE</Text>
                         </TouchableOpacity>
                         <TouchableOpacity 
                           style={styles.v4RejectBtn}
                           onPress={() => handleReject(msg.id)}
                         >
                           <X size={16} color="rgba(255,255,255,0.3)" />
                         </TouchableOpacity>
                       </View>
                    </View>
                  )}
                </View>
              ))}
              {isThinking && (
                  <View style={styles.thinkingV4}>
                      <Loader2 size={14} color="#39FF14" />
                      <Text style={styles.thinkingV4Text}>BRIDGE CONNECTING...</Text>
                  </View>
              )}
            </ScrollView>
            
            {/* Dedicated Micro-Control for Chat */}
            <View style={styles.botControl}>
               <MicButton 
                  isRecording={isRecording}
                  onPress={handleMicPress}
               />
            </View>
          </View>

          {/* Right: Live Preview Console (Tablet/Web Focus) */}
          {Platform.OS === 'web' && (
            <View style={styles.previewConsole}>
               <View style={styles.consoleHeader}>
                  <View style={styles.consoleStatus}>
                     <View style={styles.statusDotLive} />
                     <Text style={styles.consoleTitle}>PREVIEW CONSOLE</Text>
                  </View>
                  <TouchableOpacity onPress={() => setIsPreviewVisible(true)}>
                     <ExternalLink size={14} color="rgba(255,255,255,0.4)" />
                  </TouchableOpacity>
               </View>
               <View style={styles.consoleDisplay}>
                  {currentPreviewFiles.length > 0 ? (
                    <PreviewModalContent files={currentPreviewFiles} />
                  ) : (
                    <View style={styles.emptyConsole}>
                       <Loader2 size={40} color="rgba(57, 255, 20, 0.2)" />
                       <Text style={styles.emptyConsoleTitle}>WAIT FOR YOUR VIBE...</Text>
                       <Text style={styles.emptyConsoleSub}>Your sandbox will render instantly here.</Text>
                    </View>
                  )}
               </View>
            </View>
          )}
        </View>

        {/* Quick Actions (Floating or Injected) */}
        {!isRecording && <QuickActionBar onActionPress={(prompt) => processRecording(prompt)} />}

        {/* Mobile Hidden Actions */}
        {Platform.OS !== 'web' && (
          <View style={styles.footerMobile}>
              <TouchableOpacity onPress={() => setIsPreviewVisible(true)} style={styles.mobileSideBtn}>
                  <Eye size={20} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.mobileSideBtnText}>PREVIEW</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/settings')} style={styles.mobileSideBtn}>
                  <Settings size={20} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.mobileSideBtnText}>CONFIG</Text>
              </TouchableOpacity>
          </View>
        )}

        <PreviewModal 
          visible={isPreviewVisible}
          onClose={() => setIsPreviewVisible(false)}
          files={currentPreviewFiles}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
    backgroundColor: '#000',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconCircle: {
     width: 36,
     height: 36,
     borderRadius: 18,
     backgroundColor: 'rgba(57, 255, 20, 0.1)',
     borderWidth: 1,
     borderColor: 'rgba(57, 255, 20, 0.2)',
     justifyContent: 'center',
     alignItems: 'center',
  },
  headerMainTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  headerSubGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDotLive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#39FF14',
    shadowColor: '#39FF14',
    shadowRadius: 4,
    shadowOpacity: 0.8,
  },
  headerSubTitle: {
    color: 'rgba(57, 255, 20, 0.6)',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerCreditsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tutorialCredits: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  creditVal: {
    color: '#39FF14',
    fontSize: 12,
    fontWeight: '900',
  },
  creditUnit: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#39FF14',
  },
  liveBadgeText: {
    color: '#39FF14',
    fontSize: 10,
    fontWeight: '900',
  },
  tutorialAlert: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    alignItems: 'center',
  },
  tutorialAlertText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  studioBody: {
    flex: 1,
    flexDirection: 'row',
  },
  timelineContainer: {
    flex: 1,
    backgroundColor: '#050505',
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightColor: 'rgba(255,255,255,0.03)',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 24,
    paddingBottom: 40,
  },
  msgWrapper: {
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  userWrapper: {
    alignItems: 'flex-end',
  },
  agentWrapper: {
    alignItems: 'flex-start',
  },
  agentMarker: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  msgBubble: {
    padding: 18,
    borderRadius: 16,
    maxWidth: '85%',
  },
  agentBubbleV4: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.4)',
  },
  userBubbleV4: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomRightRadius: 4,
  },
  msgText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  agentTxt: {
    color: '#39FF14',
  },
  v4ProposalContainer: {
    width: '100%',
    marginTop: 16,
    backgroundColor: '#000',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 20,
  },
  v4ProposalHeader: {
    marginBottom: 16,
  },
  v4ProposalTitle: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  v4ProposalCounter: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontWeight: 'bold',
  },
  v4FileList: {
    marginBottom: 20,
    gap: 8,
  },
  v4FileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 10,
    borderRadius: 8,
  },
  v4FileName: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  v4ActionGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  v4ConfirmBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#39FF14',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  v4ConfirmTxt: {
    color: '#000',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  v4RejectBtn: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thinkingV4: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  thinkingV4Text: {
    color: 'rgba(57, 255, 20, 0.4)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  botControl: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.03)',
    backgroundColor: '#000',
  },
  previewConsole: {
    flex: 1.5,
    backgroundColor: '#000',
  },
  consoleHeader: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  consoleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  consoleTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  consoleDisplay: {
    flex: 1,
  },
  emptyConsole: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyConsoleTitle: {
    color: '#39FF14',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 20,
    textAlign: 'center',
  },
  emptyConsoleSub: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  footerMobile: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.03)',
    backgroundColor: '#000',
  },
  mobileSideBtn: {
    alignItems: 'center',
    gap: 6,
  },
  mobileSideBtnText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // Remote Terminal Styles
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#39FF14',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  remoteHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  remoteProjectName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  remoteTypeBadge: {
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  remoteTypeText: {
    color: '#39FF14',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  terminalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  terminalContent: {
    padding: 16,
  },
  terminalText: {
    color: '#39FF14',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
  },
  commandInputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#0a0a0a',
    padding: 16,
  },
  commandInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  commandPrompt: {
    color: '#39FF14',
    fontSize: 14,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  commandInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  sendButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Helper component for console display
const PreviewModalContent = ({ files }: { files: any[] }) => {
  const [selectedFile, setSelectedFile] = React.useState(0);
  
  return (
    <View style={{ flex: 1 }}>
       <ScrollView horizontal style={{ maxHeight: 40, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }}>
          {files.map((f, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => setSelectedFile(i)}
              style={{ paddingHorizontal: 16, justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: selectedFile === i ? '#39FF14' : 'transparent' }}
            >
              <Text style={{ color: selectedFile === i ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }}>{f.path.split('/').pop()}</Text>
            </TouchableOpacity>
          ))}
       </ScrollView>
       <ScrollView style={{ flex: 1, padding: 20 }}>
          <Text style={{ color: 'rgba(57, 255, 20, 0.7)', fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>
            {files[selectedFile]?.content}
          </Text>
       </ScrollView>
    </View>
  );
};
