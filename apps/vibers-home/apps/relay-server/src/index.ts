/**
 * Vibers Relay Server
 *
 * WebSocket 중계 서버 - Mobile App과 VSCode Extension을 연결
 *
 * 아키텍처:
 * Mobile App <---> Relay Server <---> VSCode Extension
 */

import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Client {
  id: string;
  type: 'mobile' | 'vscode';
  ws: WebSocket;
  sessionId?: string;
  workspaceFolder?: string;
  connectedAt: Date;
}

interface Message {
  type: string;
  source: 'mobile' | 'vscode';
  target?: 'mobile' | 'vscode';
  sessionId?: string;
  [key: string]: any;
}

// ============================================================================
// Server Configuration
// ============================================================================

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3457;
const AUTH_TOKEN = process.env.RELAY_AUTH_TOKEN || '';
const AUTH_ENABLED = AUTH_TOKEN.length > 0;

const wss = new WebSocketServer({
  port: PORT,
  perMessageDeflate: false // 성능 향상
});

// ============================================================================
// State Management
// ============================================================================

const clients = new Map<string, Client>();

/**
 * 특정 타입의 클라이언트 찾기
 */
function findClientByType(type: 'mobile' | 'vscode', sessionId?: string): Client | undefined {
  for (const client of clients.values()) {
    if (client.type === type) {
      if (sessionId && client.sessionId !== sessionId) {
        continue;
      }
      return client;
    }
  }
  return undefined;
}

/**
 * 모든 클라이언트 나열
 */
function listClients(): { mobile: number; vscode: number } {
  let mobile = 0;
  let vscode = 0;

  for (const client of clients.values()) {
    if (client.type === 'mobile') mobile++;
    if (client.type === 'vscode') vscode++;
  }

  return { mobile, vscode };
}

// ============================================================================
// Message Routing
// ============================================================================

/**
 * 메시지를 대상 클라이언트로 전달
 */
function routeMessage(message: Message, fromClientId: string) {
  const fromClient = clients.get(fromClientId);
  if (!fromClient) {
    console.error(`❌ Unknown sender: ${fromClientId}`);
    return;
  }

  // 타겟 결정
  const targetType: 'mobile' | 'vscode' = message.target || (fromClient.type === 'mobile' ? 'vscode' : 'mobile');

  // 타겟 클라이언트 찾기
  const targetClient = findClientByType(targetType, message.sessionId);

  if (!targetClient) {
    console.warn(`⚠️  No ${targetType} client found for routing`);

    // 에러 응답 보내기
    fromClient.ws.send(JSON.stringify({
      type: `${message.type}:error`,
      error: `No ${targetType} client connected`,
      originalMessage: message
    }));
    return;
  }

  // 메시지 전달
  try {
    targetClient.ws.send(JSON.stringify(message));
    console.log(`📨 Routed: ${fromClient.type} → ${targetType} (${message.type})`);
  } catch (error) {
    console.error(`❌ Failed to route message:`, error);
  }
}

/**
 * 브로드캐스트 (모든 클라이언트에게 전송)
 */
function broadcast(message: Message, excludeId?: string) {
  const messageStr = JSON.stringify(message);

  for (const [clientId, client] of clients.entries()) {
    if (excludeId && clientId === excludeId) continue;

    try {
      client.ws.send(messageStr);
    } catch (error) {
      console.error(`❌ Broadcast failed to ${clientId}:`, error);
    }
  }
}

// ============================================================================
// WebSocket Server
// ============================================================================

wss.on('connection', (ws: WebSocket) => {
  const clientId = uuidv4();
  console.log(`\n🔌 New connection: ${clientId}`);

  // 임시 클라이언트 생성 (handshake 전)
  let client: Client = {
    id: clientId,
    type: 'mobile', // Default, will be updated on handshake
    ws,
    connectedAt: new Date()
  };

  clients.set(clientId, client);

  // ========================================================================
  // Message Handler
  // ========================================================================

  ws.on('message', (data: Buffer) => {
    try {
      const message: Message = JSON.parse(data.toString());
      console.log(`📩 Received: ${message.type} from ${client.type}`);

      // ====================================================================
      // Handshake - 클라이언트 초기화
      // ====================================================================
      if (message.type === 'handshake') {
        // Token authentication (if enabled)
        if (AUTH_ENABLED && message.token !== AUTH_TOKEN) {
          console.log(`❌ Auth failed for ${clientId} - invalid token`);
          ws.send(JSON.stringify({
            type: 'handshake:response',
            success: false,
            error: 'Invalid authentication token'
          }));
          ws.close(1008, 'Unauthorized');
          clients.delete(clientId);
          return;
        }

        client = {
          ...client,
          type: message.source,
          sessionId: message.sessionId || clientId,
          workspaceFolder: message.workspaceFolder
        };
        clients.set(clientId, client);

        console.log(`👋 Handshake: ${client.type} (session: ${client.sessionId})${AUTH_ENABLED ? ' [authenticated]' : ''}`);

        // Handshake 응답
        ws.send(JSON.stringify({
          type: 'handshake:response',
          success: true,
          clientId,
          sessionId: client.sessionId,
          timestamp: new Date().toISOString()
        }));

        // 상대편 클라이언트에게 알림
        const otherType: 'mobile' | 'vscode' = client.type === 'mobile' ? 'vscode' : 'mobile';
        const otherClient = findClientByType(otherType);

        if (otherClient) {
          otherClient.ws.send(JSON.stringify({
            type: 'peer:connected',
            peerType: client.type,
            sessionId: client.sessionId
          }));
        }

        return;
      }

      // ====================================================================
      // Ping/Pong - 연결 유지
      // ====================================================================
      if (message.type === 'ping') {
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // ====================================================================
      // Status Request - 서버 상태 조회
      // ====================================================================
      if (message.type === 'status') {
        const stats = listClients();
        ws.send(JSON.stringify({
          type: 'status:response',
          clients: stats,
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // ====================================================================
      // Message Routing - 일반 메시지 라우팅
      // ====================================================================
      routeMessage(message, clientId);

    } catch (error) {
      console.error('❌ Message parse error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        error: 'Invalid message format'
      }));
    }
  });

  // ========================================================================
  // Error Handler
  // ========================================================================

  ws.on('error', (error) => {
    console.error(`❌ WebSocket error (${client.type}):`, error);
  });

  // ========================================================================
  // Close Handler
  // ========================================================================

  ws.on('close', () => {
    console.log(`🔌 Disconnected: ${client.type} (${clientId})`);

    // 클라이언트 제거
    clients.delete(clientId);

    // 상대편에게 알림
    const otherType: 'mobile' | 'vscode' = client.type === 'mobile' ? 'vscode' : 'mobile';
    const otherClient = findClientByType(otherType);

    if (otherClient) {
      otherClient.ws.send(JSON.stringify({
        type: 'peer:disconnected',
        peerType: client.type,
        sessionId: client.sessionId
      }));
    }

    // 통계 출력
    const stats = listClients();
    console.log(`📊 Connected: ${stats.mobile} mobile, ${stats.vscode} vscode\n`);
  });
});

// ============================================================================
// Server Lifecycle
// ============================================================================

wss.on('listening', () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🌟 VIBERS RELAY SERVER 🌟                    ║
║                                                            ║
║  WebSocket Relay between Mobile App and VSCode Extension  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

✅ Server is running!

📡 WebSocket listening on: ws://localhost:${PORT}
🔗 Mobile App endpoint: ws://localhost:${PORT}
🔗 VSCode Extension endpoint: ws://localhost:${PORT}

🔐 Authentication: ${AUTH_ENABLED ? 'ENABLED (token required)' : 'DISABLED (open access)'}

📋 Protocol:
   1. Client connects and sends handshake${AUTH_ENABLED ? ' with token' : ''}
   2. Server routes messages between clients
   3. Clients send/receive commands

💡 Usage:
   - Mobile App: Connect with source: 'mobile'
   - VSCode Extension: Connect with source: 'vscode'

Press Ctrl+C to stop
  `);
});

wss.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

// ============================================================================
// Graceful Shutdown
// ============================================================================

process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down relay server...');

  // 모든 클라이언트에게 종료 알림
  broadcast({
    type: 'server:shutdown',
    source: 'vscode',
    message: 'Server is shutting down'
  });

  // 연결 정리
  wss.close(() => {
    console.log('✅ All connections closed');
    process.exit(0);
  });

  // 강제 종료 (10초 후)
  setTimeout(() => {
    console.error('⚠️  Forced shutdown');
    process.exit(1);
  }, 10000);
});

// ============================================================================
// Health Check (HTTP endpoint for monitoring)
// ============================================================================

import { createServer } from 'http';

const healthServer = createServer((req, res) => {
  if (req.url === '/health') {
    const stats = listClients();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      uptime: process.uptime(),
      clients: stats,
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

healthServer.listen(PORT + 1, () => {
  console.log(`🏥 Health check: http://localhost:${PORT + 1}/health\n`);
});
