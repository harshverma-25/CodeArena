import { io, Socket } from "socket.io-client";

class SocketManager {
  private socket: Socket | null = null;
  private token: string | null = null;

  public connect(token: string): Socket {
    if (this.socket?.connected && this.token === token) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    this.token = token;
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";

    this.socket = io(wsUrl, {
      auth: {
        token,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("🔌 Socket.IO client connected:", this.socket?.id);
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔌 Socket.IO connection error:", error);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 Socket.IO client disconnected:", reason);
    });

    return this.socket;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public emit(event: string, ...args: any[]) {
    if (!this.socket) {
      console.warn(`🔌 Cannot emit '${event}'. Socket is not initialized.`);
      return;
    }
    this.socket.emit(event, ...args);
  }

  public on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) {
      console.warn(`🔌 Cannot listen for '${event}'. Socket is not initialized.`);
      return;
    }
    this.socket.on(event, callback);
  }

  public off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }
}

export const socketManager = new SocketManager();
export type { Socket };
