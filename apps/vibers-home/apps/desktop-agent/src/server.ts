import { Server as SocketIOServer } from 'socket.io';
import { TerminalManager } from './terminal';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

const PORT = 3456;

console.log('🚀 Vibers Desktop Agent');
console.log('========================');

// Generate authentication token
const AUTH_TOKEN = process.env.VIBERS_TOKEN || uuidv4();
console.log(`✅ Auth Token: ${AUTH_TOKEN}`);
console.log(`💡 Save this token in your Vibers mobile app`);
console.log('');

// Initialize Terminal Manager
const terminalManager = new TerminalManager();

// Initialize Socket.IO server
const io = new SocketIOServer(PORT, {
  cors: {
    origin: '*', // Allow all origins (for development)
    methods: ['GET', 'POST']
  }
});

console.log(`🌐 WebSocket server listening on port ${PORT}`);
console.log(`📍 PC IP: ${getLocalIP()}`);
console.log('');
console.log('Waiting for mobile app connection...');
console.log('');

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`📱 Mobile app connected: ${socket.id}`);

  // Authentication
  const clientToken = socket.handshake.auth.token;
  if (clientToken !== AUTH_TOKEN) {
    console.log(`❌ Authentication failed for ${socket.id}`);
    socket.emit('error', { message: 'Invalid token' });
    socket.disconnect();
    return;
  }

  console.log(`✅ Authentication successful for ${socket.id}`);

  // --- Event Handlers ---

  // Create terminal session
  socket.on('terminal:create', (data: { projectId: string; projectPath: string; type?: 'cli' | 'server' }, callback) => {
    try {
      const sessionId = terminalManager.createSession(
        socket,
        data.projectId,
        data.projectPath,
        data.type || 'cli'
      );

      console.log(`✅ Created session ${sessionId} for project ${data.projectId}`);
      callback({ success: true, sessionId });
    } catch (error: any) {
      console.error(`❌ Failed to create session:`, error);
      callback({ success: false, error: error.message });
    }
  });

  // Write to terminal
  socket.on('terminal:write', (data: { sessionId: string; data: string }) => {
    const success = terminalManager.writeToSession(data.sessionId, data.data);
    if (!success) {
      console.error(`❌ Session ${data.sessionId} not found`);
    }
  });

  // Resize terminal
  socket.on('terminal:resize', (data: { sessionId: string; cols: number; rows: number }) => {
    const success = terminalManager.resizeSession(data.sessionId, data.cols, data.rows);
    if (!success) {
      console.error(`❌ Session ${data.sessionId} not found`);
    }
  });

  // Kill terminal session
  socket.on('terminal:kill', (data: { sessionId: string }, callback) => {
    const success = terminalManager.killSession(data.sessionId);
    console.log(`${success ? '✅' : '❌'} Killed session ${data.sessionId}`);
    callback({ success });
  });

  // List projects (scan local directories)
  socket.on('project:list', async (callback) => {
    try {
      const { scanProjects } = await import('./projectScanner');
      const projects = await scanProjects();
      callback({ success: true, projects });
    } catch (error: any) {
      console.error(`❌ Failed to scan projects:`, error);
      callback({ success: false, error: error.message });
    }
  });

  // Get project info
  socket.on('project:info', async (data: { projectPath: string }, callback) => {
    try {
      const { detectProjectType } = await import('./projectScanner');
      const info = await detectProjectType(data.projectPath);
      callback({ success: true, info });
    } catch (error: any) {
      console.error(`❌ Failed to get project info:`, error);
      callback({ success: false, error: error.message });
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`📴 Mobile app disconnected: ${socket.id}`);

    // Clean up sessions for this socket
    const sessions = terminalManager.getAllSessions();
    sessions.forEach((session) => {
      if (session.socket.id === socket.id) {
        terminalManager.killSession(session.id);
      }
    });
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down Vibers Desktop Agent...');
  terminalManager.cleanup();
  io.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Shutting down Vibers Desktop Agent...');
  terminalManager.cleanup();
  io.close();
  process.exit(0);
});

// Helper function to get local IP
function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (!iface) continue;

    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}
