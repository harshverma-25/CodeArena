import { logger } from '../config/logger.js';

interface IRateLimitRecord {
  count: number;
  resetTime: number;
}

export class SocketRateLimiter {
  private eventBuckets = new Map<string, IRateLimitRecord>();
  private failedJoins = new Map<string, IRateLimitRecord>();
  private sweeperTimer: NodeJS.Timeout;

  constructor() {
    // Purge expired records every 60 seconds to avoid memory accumulation
    this.sweeperTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.eventBuckets.entries()) {
        if (now > record.resetTime) {
          this.eventBuckets.delete(key);
        }
      }
      for (const [key, record] of this.failedJoins.entries()) {
        if (now > record.resetTime) {
          this.failedJoins.delete(key);
        }
      }
    }, 60000);

    if (this.sweeperTimer.unref) {
      this.sweeperTimer.unref();
    }
  }

  /**
   * Check if a specific socket event exceeds its allowed frequency.
   * Default: max 10 events per 1000ms window per event type.
   */
  isEventRateLimited(socketId: string, event: string, maxEvents = 10, windowMs = 1000): boolean {
    const key = `${socketId}:${event}`;
    const now = Date.now();
    const record = this.eventBuckets.get(key);

    if (!record || now > record.resetTime) {
      this.eventBuckets.set(key, { count: 1, resetTime: now + windowMs });
      return false;
    }

    record.count++;
    if (record.count > maxEvents) {
      logger.warn(`Socket rate limit exceeded for ${socketId} on event '${event}' (${record.count} reqs)`);
      return true;
    }

    return false;
  }

  /**
   * Track failed room join attempts per socket / user to prevent brute-forcing 6-char room codes.
   * Max 5 failed attempts per 60 seconds.
   */
  isJoinThrottled(socketIdOrUserId: string): boolean {
    const now = Date.now();
    const record = this.failedJoins.get(socketIdOrUserId);
    if (!record || now > record.resetTime) {
      return false;
    }
    return record.count >= 5;
  }

  recordFailedJoin(socketIdOrUserId: string, windowMs = 60000): void {
    const now = Date.now();
    const record = this.failedJoins.get(socketIdOrUserId);
    if (!record || now > record.resetTime) {
      this.failedJoins.set(socketIdOrUserId, { count: 1, resetTime: now + windowMs });
      return;
    }
    record.count++;
  }

  resetFailedJoins(socketIdOrUserId: string): void {
    this.failedJoins.delete(socketIdOrUserId);
  }

  cleanup(socketId: string): void {
    for (const key of this.eventBuckets.keys()) {
      if (key.startsWith(`${socketId}:`)) {
        this.eventBuckets.delete(key);
      }
    }
    this.failedJoins.delete(socketId);
  }
}

export const socketRateLimiter = new SocketRateLimiter();
