import { io, Socket } from "socket.io-client";
import { clientConfig } from "./config";

class SocketManager {
  private socket: Socket | null = null;
  private token: string | null = null;

  public connect(token: string): Socket {
    if (this.socket && !this.socket.disconnected && this.token === token) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    this.token = token;
    const wsUrl = clientConfig.wsUrl;

    this.socket = io(wsUrl, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });

    // Mobile background tab & network wake-up auto-recovery
    if (typeof window !== "undefined") {
      const handleMobileWakeup = () => {
        if (document.visibilityState === "visible" && navigator.onLine) {
          if (this.socket && !this.socket.connected) {
            console.log("📱 Mobile device foregrounded: proactively reconnecting socket...");
            this.socket.connect();
          }
        }
      };
      window.addEventListener("visibilitychange", handleMobileWakeup);
      window.addEventListener("online", handleMobileWakeup);
    }

    this.socket.on("connect", () => {
      console.log("🔌 Socket.IO client connected:", this.socket?.id);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quizzy:socket_connected", { detail: { id: this.socket?.id } }));
      }
    });

    this.socket.on("connect_error", (error) => {
      console.warn("🔌 Socket.IO connection error:", error?.message || error);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quizzy:socket_connect_error", { detail: { error } }));
      }
      if (error?.message?.toLowerCase().includes("authentication error")) {
        console.warn("🔌 Socket authentication failed. Stopping reconnect loop.");
        this.disconnect();
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
