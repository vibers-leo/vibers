// Inspired by veryterm: https://github.com/verylabs/veryterm/src/main/index.ts
import * as pty from 'node-pty';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import { Socket } from 'socket.io';

const defaultShell = os.platform() === 'win32' ? 'powershell.exe' : process.env.SHELL || '/bin/bash';

export interface PtySession {
  id: string;
  projectId: string;
  projectPath: string;
  type: 'cli' | 'server';
  process: pty.IPty;
  socket: Socket;
}

export class TerminalManager {
  private sessions = new Map<string, PtySession>();

  createSession(
    socket: Socket,
    projectId: string,
    projectPath: string,
    type: 'cli' | 'server' = 'cli'
  ): string {
    const sessionId = uuidv4();
    const cols = 80;
    const rows = 24;

    console.log(`[TerminalManager] Creating ${type} session for project ${projectId} at ${projectPath}`);

    const ptyProcess = pty.spawn(defaultShell, ['--login'], {
      name: 'xterm-256color',
      cols,
      rows,
      cwd: projectPath,
      env: { ...process.env, PROMPT_EOL_MARK: '' } as Record<string, string>
    });

    const session: PtySession = {
      id: sessionId,
      projectId,
      projectPath,
      type,
      process: ptyProcess,
      socket
    };

    this.sessions.set(sessionId, session);

    // Terminal output → send to mobile via WebSocket
    ptyProcess.onData((data) => {
      socket.emit('terminal:data', {
        sessionId,
        data
      });
    });

    // Terminal exit → notify mobile
    ptyProcess.onExit(({ exitCode }) => {
      console.log(`[TerminalManager] Session ${sessionId} exited with code ${exitCode}`);
      socket.emit('terminal:exit', {
        sessionId,
        exitCode
      });
      this.sessions.delete(sessionId);
    });

    console.log(`[TerminalManager] Session ${sessionId} created successfully`);
    return sessionId;
  }

  writeToSession(sessionId: string, data: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.process.write(data);
      return true;
    }
    return false;
  }

  resizeSession(sessionId: string, cols: number, rows: number): boolean {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.process.resize(cols, rows);
      return true;
    }
    return false;
  }

  killSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.process.kill();
      this.sessions.delete(sessionId);
      return true;
    }
    return false;
  }

  getSession(sessionId: string): PtySession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): PtySession[] {
    return Array.from(this.sessions.values());
  }

  getSessionsByProject(projectId: string): PtySession[] {
    return Array.from(this.sessions.values()).filter(
      (session) => session.projectId === projectId
    );
  }

  cleanup(): void {
    console.log('[TerminalManager] Cleaning up all sessions');
    this.sessions.forEach((session) => {
      session.process.kill();
    });
    this.sessions.clear();
  }
}
