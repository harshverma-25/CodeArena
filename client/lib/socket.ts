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
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quizzy:socket_connected", { detail: { id: this.socket?.id } }));
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔌 Socket.IO connection error:", error);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quizzy:socket_connect_error", { detail: { error } }));
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("🔌 Socket.IO client disconnected:", reason);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quizzy:socket_disconnected", { detail: { reason } }));
      }
    });

    // Reconnection lifecycle events on Manager
    this.socket.io.on("reconnect_attempt", (attempt: number) => {
      console.warn(`🔌 Socket.IO reconnection attempt #${attempt}...`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quizzy:socket_reconnecting", { detail: { attempt } }));
      }
    });

    this.socket.io.on("reconnect_failed", () => {
      console.error("🔌 Socket.IO reconnection failed after maximum attempts.");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quizzy:socket_reconnect_failed"));
      }
    });

    return this.socket;
  }

  public reconnect(token?: string) {
    if (token) this.token = token;
    if (this.socket) {
      if (!this.socket.connected) {
        this.socket.connect();
      }
    } else if (this.token) {
      this.connect(this.token);
    }
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

  public isConnected(): boolean {
    return Boolean(this.socket?.connected);
  }

  public emit(event: string, ...args: unknown[]) {
    if (!this.socket) {
      console.warn(`🔌 Cannot emit '${event}'. Socket is not initialized.`);
      return;
    }
    this.socket.emit(event, ...args);
  }

  public on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.socket) {
      console.warn(`🔌 Cannot listen for '${event}'. Socket is not initialized.`);
      return;
    }
    this.socket.on(event, callback as (...args: unknown[]) => void);
  }

  public off(event: string, callback?: (...args: unknown[]) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback as (...args: unknown[]) => void);
  }
}

export const socketManager = new SocketManager();
export type { Socket };
