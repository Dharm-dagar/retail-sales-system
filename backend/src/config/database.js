// backend/src/config/database.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

let client;
let db;

export const connectDB = async () => {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    db = client.db('sales_db');
    
    console.log('✅ Connected to MongoDB Atlas');
    
    // Create indexes for better performance
    await createIndexes();
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const collection = db.collection('sales');
    
    // Index for search fields
    await collection.createIndex({ customerName: 'text', phoneNumber: 'text' });
    
    // Indexes for filters
    await collection.createIndex({ customerRegion: 1 });
    await collection.createIndex({ gender: 1 });
    await collection.createIndex({ productCategory: 1 });
    await collection.createIndex({ date: -1 });
    await collection.createIndex({ age: 1 });
    
    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

export default { connectDB, getDB, closeDB };