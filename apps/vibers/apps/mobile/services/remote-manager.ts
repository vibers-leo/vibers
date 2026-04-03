import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PC_IP: '@vibers_pc_ip',
  PC_TOKEN: '@vibers_pc_token',
  PC_PORT: '@vibers_pc_port',
};

interface RemoteProject {
  id: string;
  name: string;
  path: string;
  type: string | null;
  serverCommand: string | null;
}

interface TerminalSession {
  sessionId: string;
  projectId: string;
  type: 'cli' | 'server';
}

type TerminalDataCallback = (data: { sessionId: string; data: string }) => void;
type TerminalExitCallback = (data: { sessionId: string; exitCode: number }) => void;
type ConnectionStatusCallback = (connected: boolean) => void;
type ReconnectAttemptCallback = (attemptNumber: number) => void;
type ErrorCallback = (error: string) => void;

/**
 * 영어 에러 메시지를 한글로 변환
 */
function translateError(error: string): string {
  const errorMap: { [key: string]: string } = {
    'Connection timeout': 'PC Agent 연결 시간 초과 (실행 여부 및 네트워크 확인)',
    'Invalid token': '잘못된 인증 토큰입니다',
    'ECONNREFUSED': 'PC Agent에 연결할 수 없습니다 (포트 및 방화벽 확인)',
    'Network error': '네트워크 오류 (Wi-Fi 연결 확인)',
    'Not connected': 'PC Agent와 연결되지 않았습니다',
    'Connection failed': '연결 실패',
    'Server disconnected': '서버 연결이 끊어졌습니다',
    'Failed to reconnect': '재연결에 실패했습니다',
    'Please check your token': '토큰을 확인해주세요',
    'Please check connection': '연결 상태를 확인해주세요',
    'No projects found': '프로젝트를 찾을 수 없습니다',
    'Failed to load projects': '프로젝트 로딩 실패',
    'Failed to create terminal session': '터미널 세션 생성 실패',
    'Session not found': '세션을 찾을 수 없습니다',
  };

  for (const [eng, kor] of Object.entries(errorMap)) {
    if (error.includes(eng)) return kor;
  }
  return error; // 매칭 안 되면 원본 반환
}

class RemoteManagerClass {
  private socket: Socket | null = null;
  private terminalDataListeners: Set<TerminalDataCallback> = new Set();
  private terminalExitListeners: Set<TerminalExitCallback> = new Set();
  private connectionStatusListeners: Set<ConnectionStatusCallback> = new Set();
  private reconnectAttemptListeners: Set<ReconnectAttemptCallback> = new Set();
  private errorListeners: Set<ErrorCallback> = new Set();

  private isReconnecting: boolean = false;
  private reconnectAttempts: number = 0;

  /**
   * Connect to PC Agent
   */
  async connect(pcIp: string, token: string, port: number = 3456): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // Disconnect existing connection
        if (this.socket?.connected) {
          this.socket.disconnect();
        }

        // Create new connection
        this.socket = io(`ws://${pcIp}:${port}`, {
          auth: { token },
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
        });

        // Connection success
        this.socket.on('connect', async () => {
          console.log('✅ Connected to PC Agent');
          await this.savePCConfig(pcIp, token, port);
          this.notifyConnectionStatus(true);
          resolve(true);
        });

        // Connection error
        this.socket.on('connect_error', (error) => {
          const koreanMessage = translateError(error.message);
          console.error('❌ Connection error:', koreanMessage);
          this.notifyConnectionStatus(false);
          reject(new Error(koreanMessage));
        });

        // Disconnection
        this.socket.on('disconnect', (reason) => {
          console.log('⚠️ Disconnected:', reason);
          this.notifyConnectionStatus(false);

          // Auto-reconnect for unexpected disconnections
          if (reason === 'io server disconnect') {
            // Server disconnected us, don't auto-reconnect
            this.notifyError('서버 연결이 끊어졌습니다. 토큰을 확인하고 다시 시도해주세요.');
          } else {
            // Network issue or other reason, will auto-reconnect
            this.isReconnecting = true;
          }
        });

        // Reconnection attempt
        this.socket.on('reconnect_attempt', (attemptNumber) => {
          console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
          this.reconnectAttempts = attemptNumber;
          this.reconnectAttemptListeners.forEach((callback) => callback(attemptNumber));
        });

        // Reconnection success
        this.socket.on('reconnect', (attemptNumber) => {
          console.log(`✅ Reconnected after ${attemptNumber} attempts`);
          this.isReconnecting = false;
          this.reconnectAttempts = 0;
          this.notifyConnectionStatus(true);
        });

        // Reconnection failed
        this.socket.on('reconnect_failed', () => {
          console.log('❌ Reconnection failed after max attempts');
          this.isReconnecting = false;
          this.reconnectAttempts = 0;
          this.notifyConnectionStatus(false);
          this.notifyError('PC Agent 재연결에 실패했습니다. 연결 상태를 확인하고 다시 시도해주세요.');
        });

        // Terminal data event
        this.socket.on('terminal:data', (data: { sessionId: string; data: string }) => {
          this.terminalDataListeners.forEach((callback) => callback(data));
        });

        // Terminal exit event
        this.socket.on('terminal:exit', (data: { sessionId: string; exitCode: number }) => {
          this.terminalExitListeners.forEach((callback) => callback(data));
        });

        // Timeout after 5 seconds
        setTimeout(() => {
          if (!this.socket?.connected) {
            reject(new Error('PC Agent 연결 시간 초과 (실행 여부 및 네트워크 확인)'));
          }
        }, 5000);
      } catch (error: any) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from PC Agent
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.notifyConnectionStatus(false);
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get list of projects from PC
   */
  async getProjectList(): Promise<RemoteProject[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('PC Agent와 연결되지 않았습니다'));
        return;
      }

      this.socket.emit('project:list', {}, (response: { success: boolean; projects?: RemoteProject[]; error?: string }) => {
        if (response.success && response.projects) {
          resolve(response.projects);
        } else {
          reject(new Error(response.error || '프로젝트 목록을 가져오는데 실패했습니다'));
        }
      });
    });
  }

  /**
   * Create terminal session
   */
  async createTerminalSession(
    projectId: string,
    projectPath: string,
    type: 'cli' | 'server' = 'cli'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('PC Agent와 연결되지 않았습니다'));
        return;
      }

      this.socket.emit(
        'terminal:create',
        { projectId, projectPath, type },
        (response: { success: boolean; sessionId?: string; error?: string }) => {
          if (response.success && response.sessionId) {
            resolve(response.sessionId);
          } else {
            reject(new Error(response.error || '터미널 세션 생성에 실패했습니다'));
          }
        }
      );
    });
  }

  /**
   * Write to terminal session
   */
  writeToTerminal(sessionId: string, data: string): void {
    if (!this.socket?.connected) {
      console.error('PC Agent와 연결되지 않았습니다');
      return;
    }

    this.socket.emit('terminal:write', { sessionId, data });
  }

  /**
   * Resize terminal
   */
  resizeTerminal(sessionId: string, cols: number, rows: number): void {
    if (!this.socket?.connected) {
      console.error('PC Agent와 연결되지 않았습니다');
      return;
    }

    this.socket.emit('terminal:resize', { sessionId, cols, rows });
  }

  /**
   * Kill terminal session
   */
  killTerminal(sessionId: string): void {
    if (!this.socket?.connected) {
      console.error('PC Agent와 연결되지 않았습니다');
      return;
    }

    this.socket.emit('terminal:kill', { sessionId });
  }

  /**
   * Execute command (convenience method)
   */
  async executeCommand(projectPath: string, command: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // Create temporary terminal session
        const sessionId = await this.createTerminalSession('temp', projectPath, 'cli');
        let output = '';

        // Listen for output
        const dataListener = (data: { sessionId: string; data: string }) => {
          if (data.sessionId === sessionId) {
            output += data.data;
          }
        };

        const exitListener = (data: { sessionId: string; exitCode: number }) => {
          if (data.sessionId === sessionId) {
            this.terminalDataListeners.delete(dataListener);
            this.terminalExitListeners.delete(exitListener);
            resolve(output);
          }
        };

        this.onTerminalData(dataListener);
        this.onTerminalExit(exitListener);

        // Send command
        this.writeToTerminal(sessionId, command + '\n');

        // Timeout after 30 seconds
        setTimeout(() => {
          this.terminalDataListeners.delete(dataListener);
          this.terminalExitListeners.delete(exitListener);
          this.killTerminal(sessionId);
          reject(new Error('명령 실행 시간 초과'));
        }, 30000);
      } catch (error: any) {
        reject(error);
      }
    });
  }

  /**
   * Register terminal data listener
   */
  onTerminalData(callback: TerminalDataCallback): void {
    this.terminalDataListeners.add(callback);
  }

  /**
   * Remove terminal data listener
   */
  offTerminalData(callback: TerminalDataCallback): void {
    this.terminalDataListeners.delete(callback);
  }

  /**
   * Register terminal exit listener
   */
  onTerminalExit(callback: TerminalExitCallback): void {
    this.terminalExitListeners.add(callback);
  }

  /**
   * Remove terminal exit listener
   */
  offTerminalExit(callback: TerminalExitCallback): void {
    this.terminalExitListeners.delete(callback);
  }

  /**
   * Register connection status listener
   */
  onConnectionStatus(callback: ConnectionStatusCallback): void {
    this.connectionStatusListeners.add(callback);
  }

  /**
   * Remove connection status listener
   */
  offConnectionStatus(callback: ConnectionStatusCallback): void {
    this.connectionStatusListeners.delete(callback);
  }

  /**
   * Notify connection status listeners
   */
  private notifyConnectionStatus(connected: boolean): void {
    this.connectionStatusListeners.forEach((callback) => callback(connected));
  }

  /**
   * Register reconnect attempt listener
   */
  onReconnectAttempt(callback: ReconnectAttemptCallback): void {
    this.reconnectAttemptListeners.add(callback);
  }

  /**
   * Remove reconnect attempt listener
   */
  offReconnectAttempt(callback: ReconnectAttemptCallback): void {
    this.reconnectAttemptListeners.delete(callback);
  }

  /**
   * Register error listener
   */
  onError(callback: ErrorCallback): void {
    this.errorListeners.add(callback);
  }

  /**
   * Remove error listener
   */
  offError(callback: ErrorCallback): void {
    this.errorListeners.delete(callback);
  }

  /**
   * Notify error listeners
   */
  private notifyError(error: string): void {
    this.errorListeners.forEach((callback) => callback(error));
  }

  /**
   * Check if currently reconnecting
   */
  isCurrentlyReconnecting(): boolean {
    return this.isReconnecting;
  }

  /**
   * Get current reconnect attempt number
   */
  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  /**
   * Save PC configuration to storage
   */
  private async savePCConfig(ip: string, token: string, port: number): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.PC_IP, ip);
    await AsyncStorage.setItem(STORAGE_KEYS.PC_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.PC_PORT, port.toString());
  }

  /**
   * Get saved PC configuration
   */
  async getSavedPCConfig(): Promise<{ ip: string | null; token: string | null; port: number }> {
    const ip = await AsyncStorage.getItem(STORAGE_KEYS.PC_IP);
    const token = await AsyncStorage.getItem(STORAGE_KEYS.PC_TOKEN);
    const portStr = await AsyncStorage.getItem(STORAGE_KEYS.PC_PORT);
    const port = portStr ? parseInt(portStr, 10) : 3456;

    return { ip, token, port };
  }

  /**
   * Auto-connect using saved configuration
   */
  async autoConnect(): Promise<boolean> {
    try {
      const { ip, token, port } = await this.getSavedPCConfig();

      if (!ip || !token) {
        console.log('No saved PC configuration');
        return false;
      }

      console.log(`${ip}:${port}로 자동 연결 시도 중...`);
      return await this.connect(ip, token, port);
    } catch (error: any) {
      console.error('자동 연결 실패:', error.message);
      return false;
    }
  }
}

// Export singleton instance
export const RemoteManager = new RemoteManagerClass();
