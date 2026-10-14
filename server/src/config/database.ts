import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    logger.info('Connecting to MongoDB...');
    
    // Register connection state events
    mongoose.connection.on('connected', () => {
      logger.info('✅ MongoDB connection established successfully.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`❌ MongoDB connection error event: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB connection lost/disconnected.');
    });

    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 20, // Calibrated for Render instance resources and Atlas shared tier limits
      minPoolSize: 5, // Pre-warms 5 sockets so incoming requests never incur TLS handshake delays
      serverSelectionTimeoutMS: 5000, // Fails fast in 5s rather than stalling for 30s
      socketTimeoutMS: 45000, // Closes stalled sockets after 45s
      connectTimeoutMS: 10000,
      family: 4, // Prefers IPv4 to avoid slow IPv6 dual-stack lookups on cloud platforms
    });
  } catch (error) {
    logger.error(error, '❌ Failed to connect to MongoDB during startup.');
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    logger.info('Closing MongoDB connection...');
    await mongoose.connection.close();
    logger.info('✅ MongoDB connection closed successfully.');
  } catch (error) {
    logger.error(error, '❌ Error occurred while closing MongoDB connection');
  }
};
