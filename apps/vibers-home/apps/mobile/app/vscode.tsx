/**
 * VSCode Remote Control Screen
 *
 * Relay Server를 통해 VSCode Extension을 원격으로 제어합니다.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { VSCodeRemote } from '../services/vscode-remote';

export default function VSCodeScreen() {
  const router = useRouter();

  // Connection state
  const [relayServerUrl, setRelayServerUrl] = useState('ws://localhost:3457');
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Workspace info
  const [workspaceInfo, setWorkspaceInfo] = useState<any>(null);
  const [openFiles, setOpenFiles] = useState<string[]>([]);

  // Command input
  const [filePath, setFilePath] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [commandInput, setCommandInput] = useState('');
  const [terminalCommand, setTerminalCommand] = useState('');

  // Logs
  const [logs, setLogs] = useState<string[]>([]);

  // ========================================================================
  // Effects
  // ========================================================================

  useEffect(() => {
    // Load saved relay server URL
    loadSavedRelayServer();

    // Setup connection listener
    const unsubscribe = VSCodeRemote.onConnectionChange((isConnected) => {
      setConnected(isConnected);
      addLog(isConnected ? '✅ Connected to Relay Server' : '🔌 Disconnected from Relay Server');
    });

    // Setup message listener
    const unsubscribeMessage = VSCodeRemote.onMessage((message) => {
      addLog(`📩 Received: ${message.type}`);
    });

    return () => {
      unsubscribe();
      unsubscribeMessage();
    };
  }, []);

  // ========================================================================
  // Connection
  // ========================================================================

  const loadSavedRelayServer = async () => {
    const savedUrl = await VSCodeRemote.getSavedRelayServer();
    if (savedUrl) {
      setRelayServerUrl(savedUrl);
    }
  };

  const handleConnect = async () => {
    if (!relayServerUrl.trim()) {
      Alert.alert('오류', '릴레이 서버 URL을 입력해주세요');
      return;
    }

    setConnecting(true);
    addLog(`🔌 Connecting to ${relayServerUrl}...`);

    try {
      await VSCodeRemote.connect(relayServerUrl.trim());
      await VSCodeRemote.saveRelayServer(relayServerUrl.trim());
      addLog('✅ Connected successfully!');

      // Fetch workspace info
      await fetchWorkspaceInfo();
    } catch (error: any) {
      addLog(`❌ Connection failed: ${error.message}`);
      Alert.alert('연결 실패', error.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await VSCodeRemote.disconnect();
    setWorkspaceInfo(null);
    setOpenFiles([]);
    addLog('🔌 Disconnected');
  };

  // ========================================================================
  // VSCode Commands
  // ========================================================================

  const fetchWorkspaceInfo = async () => {
    try {
      addLog('📋 Fetching workspace info...');
      const response = await VSCodeRemote.getWorkspaceInfo();
      setWorkspaceInfo(response);
      addLog(`✅ Workspace: ${response.workspaceFolder || 'None'}`);
    } catch (error: any) {
      addLog(`❌ Failed to get workspace: ${error.message}`);
    }
  };

  const fetchOpenFiles = async () => {
    try {
      addLog('📋 Fetching open files...');
      const response = await VSCodeRemote.getOpenFiles();
      setOpenFiles(response.files || []);
      addLog(`✅ Found ${response.files?.length || 0} open files`);
    } catch (error: any) {
      addLog(`❌ Failed to get open files: ${error.message}`);
    }
  };

  const handleOpenFile = async () => {
    if (!filePath.trim()) {
      Alert.alert('오류', '파일 경로를 입력해주세요');
      return;
    }

    try {
      addLog(`📂 Opening file: ${filePath}`);
      const response = await VSCodeRemote.openFile(filePath.trim());
      addLog('✅ File opened successfully!');
      setFilePath('');
      Alert.alert('성공', 'VSCode에서 파일이 열렸습니다');
    } catch (error: any) {
      addLog(`❌ Failed to open file: ${error.message}`);
      Alert.alert('오류', error.message);
    }
  };

  const handleEditFile = async () => {
    if (!filePath.trim() || !fileContent.trim()) {
      Alert.alert('Error', 'Please enter both file path and content');
      return;
    }

    try {
      addLog(`✏️  Editing file: ${filePath}`);
      const response = await VSCodeRemote.editFile(filePath.trim(), fileContent.trim());
      addLog('✅ File edited successfully!');
      setFilePath('');
      setFileContent('');
      Alert.alert('Success', 'File edited in VSCode');
    } catch (error: any) {
      addLog(`❌ Failed to edit file: ${error.message}`);
      Alert.alert('오류', error.message);
    }
  };

  const handleRunCommand = async () => {
    if (!commandInput.trim()) {
      Alert.alert('Error', 'Please enter command');
      return;
    }

    try {
      addLog(`⚙️  Running command: ${commandInput}`);
      const response = await VSCodeRemote.runCommand(commandInput.trim());
      addLog('✅ Command executed successfully!');
      setCommandInput('');
      Alert.alert('Success', 'Command executed in VSCode');
    } catch (error: any) {
      addLog(`❌ Failed to run command: ${error.message}`);
      Alert.alert('오류', error.message);
    }
  };

  const handleTerminalCommand = async () => {
    if (!terminalCommand.trim()) {
      Alert.alert('Error', 'Please enter terminal command');
      return;
    }

    try {
      addLog(`💻 Sending to terminal: ${terminalCommand}`);
      const response = await VSCodeRemote.controlTerminal('sendText', terminalCommand.trim());
      addLog('✅ Terminal command sent!');
      setTerminalCommand('');
      Alert.alert('Success', 'Command sent to VSCode terminal');
    } catch (error: any) {
      addLog(`❌ Failed to send terminal command: ${error.message}`);
      Alert.alert('오류', error.message);
    }
  };

  // ========================================================================
  // Utilities
  // ========================================================================

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VSCode Remote</Text>
        <View style={styles.headerRight}>
          <View style={[styles.statusDot, { backgroundColor: connected ? '#39FF14' : '#FF1439' }]} />
        </View>
      </View>

      {/* Connection Section */}
      {!connected ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔌 Connect to Relay Server</Text>

          <TextInput
            style={styles.input}
            value={relayServerUrl}
            onChangeText={setRelayServerUrl}
            placeholder="ws://localhost:3457"
            placeholderTextColor="#444"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.button, connecting && styles.buttonDisabled]}
            onPress={handleConnect}
            disabled={connecting}
          >
            {connecting ? (
              <ActivityIndicator color="#0a0a0a" />
            ) : (
              <Text style={styles.buttonText}>Connect</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            💡 Make sure the Relay Server is running on port 3457
          </Text>
        </View>
      ) : (
        <>
          {/* Workspace Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Workspace Info</Text>

            <TouchableOpacity style={styles.smallButton} onPress={fetchWorkspaceInfo}>
              <Text style={styles.smallButtonText}>Refresh</Text>
            </TouchableOpacity>

            {workspaceInfo && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  📁 Folder: {workspaceInfo.workspaceFolder || 'None'}
                </Text>
                <Text style={styles.infoText}>
                  📝 Extension: {workspaceInfo.extensionVersion || 'Unknown'}
                </Text>
              </View>
            )}
          </View>

          {/* Open Files */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📂 Open Files</Text>

            <TouchableOpacity style={styles.smallButton} onPress={fetchOpenFiles}>
              <Text style={styles.smallButtonText}>Refresh</Text>
            </TouchableOpacity>

            {openFiles.length > 0 ? (
              openFiles.map((file, index) => (
                <Text key={index} style={styles.fileItem}>• {file}</Text>
              ))
            ) : (
              <Text style={styles.hint}>No files open</Text>
            )}
          </View>

          {/* File Operations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📄 File Operations</Text>

            <TextInput
              style={styles.input}
              value={filePath}
              onChangeText={setFilePath}
              placeholder="File path (e.g., /path/to/file.ts)"
              placeholderTextColor="#444"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity style={styles.button} onPress={handleOpenFile}>
              <Text style={styles.buttonText}>Open File</Text>
            </TouchableOpacity>

            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={fileContent}
              onChangeText={setFileContent}
              placeholder="File content (for editing)"
              placeholderTextColor="#444"
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity style={styles.button} onPress={handleEditFile}>
              <Text style={styles.buttonText}>Edit/Create File</Text>
            </TouchableOpacity>
          </View>

          {/* Terminal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💻 Terminal</Text>

            <TextInput
              style={styles.input}
              value={terminalCommand}
              onChangeText={setTerminalCommand}
              placeholder="Terminal command (e.g., npm install)"
              placeholderTextColor="#444"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity style={styles.button} onPress={handleTerminalCommand}>
              <Text style={styles.buttonText}>Send to Terminal</Text>
            </TouchableOpacity>
          </View>

          {/* VSCode Commands */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ VSCode Commands</Text>

            <TextInput
              style={styles.input}
              value={commandInput}
              onChangeText={setCommandInput}
              placeholder="Command (e.g., workbench.action.files.save)"
              placeholderTextColor="#444"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity style={styles.button} onPress={handleRunCommand}>
              <Text style={styles.buttonText}>Run Command</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>
              💡 Common commands: workbench.action.files.save, workbench.action.files.saveAll
            </Text>
          </View>

          {/* Disconnect */}
          <View style={styles.section}>
            <TouchableOpacity style={[styles.button, styles.disconnectButton]} onPress={handleDisconnect}>
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Logs */}
      <View style={styles.section}>
        <View style={styles.logHeader}>
          <Text style={styles.sectionTitle}>📜 Logs</Text>
          <TouchableOpacity onPress={clearLogs}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logContainer}>
          {logs.length === 0 ? (
            <Text style={styles.hint}>No logs yet</Text>
          ) : (
            logs.map((log, index) => (
              <Text key={index} style={styles.logText}>{log}</Text>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    fontSize: 32,
    color: '#39FF14',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#39FF14',
  },
  headerRight: {
    width: 32,
    alignItems: 'flex-end',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#39FF14',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#39FF14',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disconnectButton: {
    backgroundColor: '#FF1439',
  },
  smallButton: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#39FF14',
  },
  smallButtonText: {
    color: '#39FF14',
    fontSize: 14,
    fontWeight: 'bold',
  },
  hint: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  fileItem: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    paddingLeft: 10,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  clearButton: {
    color: '#FF1439',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#333',
  },
  logText: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 3,
    fontFamily: 'monospace',
  },
});
