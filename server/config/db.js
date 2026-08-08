import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fc_smart_audit';
    console.log(`[MongoDB] Attempting connection to: ${connStr}`);
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });

    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.warn(`[MongoDB Warning] Server will operate, but database requests will fail or fallback until MongoDB is running.`);
    return false;
  }
};
