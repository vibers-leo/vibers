import * as vscode from 'vscode';
import WebSocket from 'ws';

let statusBarItem: vscode.StatusBarItem;
let websocket: WebSocket | null = null;
let isConnected = false;

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Vibers Remote extension is now active!');

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = 'vibers.showStatus';
  updateStatusBar(false);
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('vibers.connect', connectToMobile)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vibers.disconnect', disconnect)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vibers.showStatus', showStatus)
  );

  // Auto-connect if configured
  const config = vscode.workspace.getConfiguration('vibers');
  if (config.get('autoConnect')) {
    connectToMobile();
  }
}

/**
 * Extension deactivation
 */
export function deactivate() {
  if (websocket) {
    websocket.close();
  }
}

/**
 * Update status bar
 */
function updateStatusBar(connected: boolean) {
  if (connected) {
    statusBarItem.text = '$(radio-tower) Vibers: Connected';
    statusBarItem.backgroundColor = new vscode.ThemeColor(
      'statusBarItem.prominentBackground'
    );
    statusBarItem.tooltip = 'Connected to Vibers Mobile';
  } else {
    statusBarItem.text = '$(radio-tower) Vibers: Disconnected';
    statusBarItem.backgroundColor = undefined;
    statusBarItem.tooltip = 'Click to connect to Vibers Mobile';
  }
}

/**
 * Connect to mobile via relay server
 */
async function connectToMobile() {
  const config = vscode.workspace.getConfiguration('vibers');
  const relayServer = config.get<string>('relayServer') || 'ws://localhost:3457';

  try {
    vscode.window.showInformationMessage('Connecting to Vibers Mobile...');

    // Close existing connection
    if (websocket) {
      websocket.close();
    }

    // Create WebSocket connection
    websocket = new WebSocket(relayServer);

    websocket.on('open', () => {
      isConnected = true;
      updateStatusBar(true);
      vscode.window.showInformationMessage('✅ Connected to Vibers Mobile!');

      // Send initial handshake
      sendMessage({
        type: 'handshake',
        source: 'vscode',
        workspaceFolder: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
        extensionVersion: '1.0.0',
      });
    });

    websocket.on('message', (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString());
        handleMessage(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    websocket.on('error', (error) => {
      console.error('WebSocket error:', error);
      vscode.window.showErrorMessage(`Vibers connection error: ${error.message}`);
    });

    websocket.on('close', () => {
      isConnected = false;
      updateStatusBar(false);
      vscode.window.showWarningMessage('Disconnected from Vibers Mobile');
      websocket = null;
    });
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to connect: ${error.message}`);
  }
}

/**
 * Disconnect from mobile
 */
function disconnect() {
  if (websocket) {
    websocket.close();
    websocket = null;
    isConnected = false;
    updateStatusBar(false);
    vscode.window.showInformationMessage('Disconnected from Vibers Mobile');
  } else {
    vscode.window.showInformationMessage('Not connected');
  }
}

/**
 * Show connection status
 */
function showStatus() {
  if (isConnected) {
    vscode.window.showInformationMessage(
      '✅ Connected to Vibers Mobile\n\nYou can now control VSCode from your mobile device!'
    );
  } else {
    vscode.window.showInformationMessage(
      '❌ Not connected\n\nUse "Vibers: Connect to Mobile" command to connect.'
    );
  }
}

/**
 * Send message to mobile
 */
function sendMessage(message: any) {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(message));
  }
}

/**
 * Handle incoming messages from mobile
 */
async function handleMessage(message: any) {
  console.log('Received message:', message);

  switch (message.type) {
    case 'ping':
      sendMessage({ type: 'pong' });
      break;

    case 'openFile':
      await handleOpenFile(message);
      break;

    case 'editFile':
      await handleEditFile(message);
      break;

    case 'runCommand':
      await handleRunCommand(message);
      break;

    case 'getWorkspace':
      await handleGetWorkspace(message);
      break;

    case 'terminal':
      await handleTerminal(message);
      break;

    default:
      console.log('Unknown message type:', message.type);
  }
}

/**
 * Handle open file request
 */
async function handleOpenFile(message: any) {
  try {
    const { filePath } = message;
    const uri = vscode.Uri.file(filePath);
    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);

    sendMessage({
      type: 'openFile:response',
      requestId: message.requestId,
      success: true,
    });
  } catch (error: any) {
    sendMessage({
      type: 'openFile:response',
      requestId: message.requestId,
      success: false,
      error: error.message,
    });
  }
}

/**
 * Handle edit file request
 */
async function handleEditFile(message: any) {
  try {
    const { filePath, content } = message;
    const uri = vscode.Uri.file(filePath);

    // Create file if it doesn't exist
    const edit = new vscode.WorkspaceEdit();
    edit.createFile(uri, { overwrite: true });
    await vscode.workspace.applyEdit(edit);

    // Write content
    const textEdit = new vscode.WorkspaceEdit();
    const document = await vscode.workspace.openTextDocument(uri);
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(document.getText().length)
    );
    textEdit.replace(uri, fullRange, content);
    await vscode.workspace.applyEdit(textEdit);

    // Save
    await document.save();

    sendMessage({
      type: 'editFile:response',
      requestId: message.requestId,
      success: true,
    });
  } catch (error: any) {
    sendMessage({
      type: 'editFile:response',
      requestId: message.requestId,
      success: false,
      error: error.message,
    });
  }
}

/**
 * Handle run command request
 */
async function handleRunCommand(message: any) {
  try {
    const { command, args } = message;
    await vscode.commands.executeCommand(command, ...args);

    sendMessage({
      type: 'runCommand:response',
      requestId: message.requestId,
      success: true,
    });
  } catch (error: any) {
    sendMessage({
      type: 'runCommand:response',
      requestId: message.requestId,
      success: false,
      error: error.message,
    });
  }
}

/**
 * Handle get workspace request
 */
async function handleGetWorkspace(message: any) {
  try {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const openEditors = vscode.window.visibleTextEditors.map((editor) => ({
      fileName: editor.document.fileName,
      languageId: editor.document.languageId,
      isDirty: editor.document.isDirty,
    }));

    sendMessage({
      type: 'getWorkspace:response',
      requestId: message.requestId,
      success: true,
      data: {
        folders: workspaceFolders?.map((folder) => folder.uri.fsPath),
        openEditors,
      },
    });
  } catch (error: any) {
    sendMessage({
      type: 'getWorkspace:response',
      requestId: message.requestId,
      success: false,
      error: error.message,
    });
  }
}

/**
 * Handle terminal request
 */
async function handleTerminal(message: any) {
  try {
    const { action, command } = message;

    if (action === 'create') {
      const terminal = vscode.window.createTerminal('Vibers Terminal');
      terminal.show();

      sendMessage({
        type: 'terminal:response',
        requestId: message.requestId,
        success: true,
        terminalId: 'vibers-terminal',
      });
    } else if (action === 'sendText' && command) {
      const terminal = vscode.window.activeTerminal;
      if (terminal) {
        terminal.sendText(command);
        sendMessage({
          type: 'terminal:response',
          requestId: message.requestId,
          success: true,
        });
      } else {
        throw new Error('No active terminal');
      }
    }
  } catch (error: any) {
    sendMessage({
      type: 'terminal:response',
      requestId: message.requestId,
      success: false,
      error: error.message,
    });
  }
}
