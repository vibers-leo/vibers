/**
 * VSCode Remote Service
 *
 * Relay Server를 통해 VSCode Extension과 통신
 * Mobile App → Relay Server → VSCode Extension
 */

import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface VSCodeMessage {
  type: string;
  source: 'mobile' | 'vscode';
  target?: 'mobile' | 'vscode';
  requestId?: string;
  [key: string]: any;
}

export interface VSCodeResponse {
  type: string;
  requestId?: string;
  success: boolean;
  error?: string;
  [key: string]: any;
}

export interface OpenFileRequest {
  filePath: string;
}

export interface EditFileRequest {
  filePath: string;
  content: string;
}

export interface RunCommandRequest {
  command: string;
  args?: any[];
}

export interface TerminalRequest {
  action: 'create' | 'sendText';
  command?: string;
  terminalId?: string;
}

// ============================================================================
// VSCode Remote Manager
// ============================================================================

class VSCodeRemoteManager {
  private socket: Socket | null = null;
  private connected: boolean = false;
  private sessionId: string = '';

  // Event listeners
  private messageListeners: Array<(message: VSCodeMessage) => void> = [];
  private connectionListeners: Array<(connected: boolean) => void> = [];
  private responseCallbacks: Map<string, (response: VSCodeResponse) => void> = new Map();

  // Configuration
  private readonly RELAY_SERVER_KEY = '@vibers_relay_server';
  private readonly DEFAULT_RELAY_SERVER = 'ws://localhost:3457';
  private readonly RECONNECT_ATTEMPTS = 3;
  private readonly RESPONSE_TIMEOUT = 30000; // 30 seconds

  // ========================================================================
  // Connection Management
  // ========================================================================

  /**
   * Relay Server에 연결
   */
  async connect(relayServerUrl?: string, customSessionId?: string): Promise<boolean> {
    try {
      // 기존 연결이 있으면 먼저 해제
      if (this.socket?.connected) {
        await this.disconnect();
      }

      // Relay Server URL 결정
      const serverUrl = relayServerUrl || await this.getSavedRelayServer() || this.DEFAULT_RELAY_SERVER;

      // Session ID 생성
      this.sessionId = customSessionId || `mobile-${Date.now()}`;

      console.log(`🔌 Connecting to Relay Server: ${serverUrl}`);

      // Socket.io 연결
      this.socket = io(serverUrl, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: this.RECONNECT_ATTEMPTS,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      // 이벤트 핸들러 등록
      this.setupEventHandlers();

      // 연결 대기 (Promise로)
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.socket?.on('connect', () => {
          clearTimeout(timeout);
          this.sendHandshake();
          resolve(true);
        });

        this.socket?.on('connect_error', (error) => {
          clearTimeout(timeout);
          console.error('❌ Connection error:', error);
          reject(error);
        });
      });
    } catch (error) {
      console.error('❌ Failed to connect to Relay Server:', error);
      throw error;
    }
  }

  /**
   * Relay Server 연결 해제
   */
  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.notifyConnectionChange(false);
      console.log('🔌 Disconnected from Relay Server');
    }
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.connected && this.socket?.connected === true;
  }

  // ========================================================================
  // Event Handlers
  // ========================================================================

  private setupEventHandlers() {
    if (!this.socket) return;

    // 연결 성공
    this.socket.on('connect', () => {
      console.log('✅ Connected to Relay Server');
      this.connected = true;
      this.notifyConnectionChange(true);
    });

    // 연결 해제
    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from Relay Server');
      this.connected = false;
      this.notifyConnectionChange(false);
    });

    // 재연결 시도
    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnecting... (attempt ${attemptNumber})`);
    });

    // 재연결 성공
    this.socket.on('reconnect', () => {
      console.log('✅ Reconnected to Relay Server');
      this.sendHandshake();
    });

    // 메시지 수신
    this.socket.on('message', (data: string) => {
      try {
        const message: VSCodeMessage = JSON.parse(data);
        this.handleMessage(message);
      } catch (error) {
        console.error('❌ Failed to parse message:', error);
      }
    });
  }

  /**
   * Handshake 전송 (연결 초기화)
   */
  private sendHandshake() {
    const handshake: VSCodeMessage = {
      type: 'handshake',
      source: 'mobile',
      sessionId: this.sessionId
    };

    this.sendMessage(handshake);
    console.log('👋 Handshake sent');
  }

  /**
   * 수신 메시지 처리
   */
  private handleMessage(message: VSCodeMessage) {
    console.log('📩 Received message:', message.type);

    // Handshake 응답
    if (message.type === 'handshake:response') {
      console.log('✅ Handshake confirmed');
      return;
    }

    // 응답 메시지 (requestId가 있는 경우)
    if (message.requestId && this.responseCallbacks.has(message.requestId)) {
      const callback = this.responseCallbacks.get(message.requestId);
      if (callback) {
        callback(message as unknown as VSCodeResponse);
        this.responseCallbacks.delete(message.requestId);
      }
      return;
    }

    // 일반 메시지 - 리스너에게 전달
    this.messageListeners.forEach(listener => listener(message));
  }

  // ========================================================================
  // Messaging
  // ========================================================================

  /**
   * 메시지 전송
   */
  private sendMessage(message: VSCodeMessage): void {
    if (!this.socket?.connected) {
      throw new Error('Not connected to Relay Server');
    }

    this.socket.emit('message', JSON.stringify(message));
  }

  /**
   * 요청 전송 및 응답 대기
   */
  private async sendRequest(message: VSCodeMessage): Promise<VSCodeResponse> {
    const requestId = message.requestId || `req-${Date.now()}-${Math.random()}`;
    message.requestId = requestId;
    message.target = 'vscode';

    return new Promise((resolve, reject) => {
      // 타임아웃 설정
      const timeout = setTimeout(() => {
        this.responseCallbacks.delete(requestId);
        reject(new Error('Request timeout'));
      }, this.RESPONSE_TIMEOUT);

      // 응답 콜백 등록
      this.responseCallbacks.set(requestId, (response) => {
        clearTimeout(timeout);
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || 'Request failed'));
        }
      });

      // 메시지 전송
      try {
        this.sendMessage(message);
      } catch (error) {
        clearTimeout(timeout);
        this.responseCallbacks.delete(requestId);
        reject(error);
      }
    });
  }

  // ========================================================================
  // VSCode Commands
  // ========================================================================

  /**
   * 파일 열기
   */
  async openFile(filePath: string): Promise<VSCodeResponse> {
    const message: VSCodeMessage = {
      type: 'openFile',
      source: 'mobile',
      filePath
    };

    return this.sendRequest(message);
  }

  /**
   * 파일 편집 (생성 또는 수정)
   */
  async editFile(filePath: string, content: string): Promise<VSCodeResponse> {
    const message: VSCodeMessage = {
      type: 'editFile',
      source: 'mobile',
      filePath,
      content
    };

    return this.sendRequest(message);
  }

  /**
   * VSCode 명령 실행
   */
  async runCommand(command: string, args: any[] = []): Promise<VSCodeResponse> {
    const message: VSCodeMessage = {
      type: 'runCommand',
      source: 'mobile',
      command,
      args
    };

    return this.sendRequest(message);
  }

  /**
   * 터미널 제어
   */
  async controlTerminal(action: 'create' | 'sendText', command?: string, terminalId?: string): Promise<VSCodeResponse> {
    const message: VSCodeMessage = {
      type: 'terminal',
      source: 'mobile',
      action,
      command,
      terminalId
    };

    return this.sendRequest(message);
  }

  /**
   * 열려있는 파일 목록 조회
   */
  async getOpenFiles(): Promise<VSCodeResponse> {
    const message: VSCodeMessage = {
      type: 'getOpenFiles',
      source: 'mobile'
    };

    return this.sendRequest(message);
  }

  /**
   * 워크스페이스 정보 조회
   */
  async getWorkspaceInfo(): Promise<VSCodeResponse> {
    const message: VSCodeMessage = {
      type: 'getWorkspace',
      source: 'mobile'
    };

    return this.sendRequest(message);
  }

  // ========================================================================
  // Event Listeners
  // ========================================================================

  /**
   * 메시지 리스너 추가
   */
  onMessage(listener: (message: VSCodeMessage) => void): () => void {
    this.messageListeners.push(listener);

    // Unsubscribe 함수 반환
    return () => {
      const index = this.messageListeners.indexOf(listener);
      if (index > -1) {
        this.messageListeners.splice(index, 1);
      }
    };
  }

  /**
   * 연결 상태 리스너 추가
   */
  onConnectionChange(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.push(listener);

    // 현재 상태 즉시 알림
    listener(this.connected);

    // Unsubscribe 함수 반환
    return () => {
      const index = this.connectionListeners.indexOf(listener);
      if (index > -1) {
        this.connectionListeners.splice(index, 1);
      }
    };
  }

  private notifyConnectionChange(connected: boolean) {
    this.connectionListeners.forEach(listener => listener(connected));
  }

  // ========================================================================
  // Storage
  // ========================================================================

  /**
   * Relay Server URL 저장
   */
  async saveRelayServer(url: string): Promise<void> {
    await AsyncStorage.setItem(this.RELAY_SERVER_KEY, url);
  }

  /**
   * 저장된 Relay Server URL 가져오기
   */
  async getSavedRelayServer(): Promise<string | null> {
    return await AsyncStorage.getItem(this.RELAY_SERVER_KEY);
  }

  /**
   * Relay Server URL 삭제
   */
  async clearRelayServer(): Promise<void> {
    await AsyncStorage.removeItem(this.RELAY_SERVER_KEY);
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const VSCodeRemote = new VSCodeRemoteManager();
