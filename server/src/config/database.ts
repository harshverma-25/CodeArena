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

    await mongoose.connect(env.MONGODB_URI);
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
