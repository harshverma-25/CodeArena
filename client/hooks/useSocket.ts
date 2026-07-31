import { useEffect } from "react";
import { socketManager } from "@/lib/socket";

/**
 * A hook to interact with the global Socket.IO instance.
 * Optionally registers a listener for a single event that automatically cleans up on unmount.
 * 
 * @param event Optional event name to listen to
 * @param callback Optional callback for the event listener
 */
export function useSocket(event?: string, callback?: (...args: any[]) => void) {
  useEffect(() => {
    if (!event || !callback) return;

    socketManager.on(event, callback);

    return () => {
      socketManager.off(event, callback);
    };
  }, [event, callback]);

  return {
    socket: socketManager.getSocket(),
    emit: (event: string, ...args: any[]) => socketManager.emit(event, ...args),
    on: (event: string, callback: (...args: any[]) => void) => socketManager.on(event, callback),
    off: (event: string, callback?: (...args: any[]) => void) => socketManager.off(event, callback),
  };
}
