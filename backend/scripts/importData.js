// backend/scripts/importData.js
// Run this ONCE to import CSV data to MongoDB
// Usage: node scripts/importData.js

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;
const BATCH_SIZE = 1000; // Insert in batches for performance

const parseIntSafe = (value) => {
  if (value === undefined || value === null || value === '') return 0;
  const n = parseInt(String(value).replace(/,/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
};

const parseFloatSafe = (value) => {
  if (value === undefined || value === null || value === '') return 0;
  const n = parseFloat(String(value).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const parseTags = (tagsString) => {
  if (!tagsString) return [];
  if (Array.isArray(tagsString)) return tagsString;
  const cleaned = String(tagsString).replace(/[\[\]"']/g, '');
  return cleaned.split(/[,|]/).map((tag) => tag.trim()).filter(Boolean);
};

const normalizeRecord = (record, index) => ({
  transactionId: record['Transaction ID'] || record['transaction_id'] || `TXN${String(index + 1).padStart(6, '0')}`,
  customerId: record['Customer ID'] || record['customer_id'] || '',
  customerName: record['Customer Name'] || record['customer_name'] || '',
  phoneNumber: record['Phone Number'] || record['phone_number'] || '',
  gender: record['Gender'] || record['gender'] || '',
  age: parseIntSafe(record['Age'] || record['age']),
  customerRegion: record['Customer Region'] || record['customer_region'] || '',
  customerType: record['Customer Type'] || record['customer_type'] || '',
  productId: record['Product ID'] || record['product_id'] || '',
  productName: record['Product Name'] || record['product_name'] || '',
  brand: record['Brand'] || record['brand'] || '',
  productCategory: record['Product Category'] || record['product_category'] || '',
  tags: parseTags(record['Tags'] || record['tags'] || ''),
  quantity: parseIntSafe(record['Quantity'] || record['quantity']),
  pricePerUnit: parseFloatSafe(record['Price per Unit'] || record['price_per_unit']),
  discountPercentage: parseFloatSafe(record['Discount Percentage'] || record['discount_percentage']),
  totalAmount: parseFloatSafe(record['Total Amount'] || record['total_amount']),
  finalAmount: parseFloatSafe(record['Final Amount'] || record['final_amount']),
  date: record['Date'] || record['date'] || '',
  paymentMethod: record['Payment Method'] || record['payment_method'] || '',
  orderStatus: record['Order Status'] || record['order_status'] || '',
  deliveryType: record['Delivery Type'] || record['delivery_type'] || '',
  storeId: record['Store ID'] || record['store_id'] || '',
  storeLocation: record['Store Location'] || record['store_location'] || '',
  salespersonId: record['Salesperson ID'] || record['salesperson_id'] || '',
  employeeName: record['Employee Name'] || record['employee_name'] || ''
});

const importCSVToMongoDB = async () => {
  const csvPath = path.join(__dirname, '../src/data/sales_data.csv');

  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    process.exit(1);
  }

  const stats = fs.statSync(csvPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`📄 CSV file size: ${sizeMB} MB`);

  let client;
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('sales_db');
    const collection = db.collection('sales');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await collection.deleteMany({});

    // Start streaming CSV
    console.log('📊 Starting CSV import...');
    const readStream = fs.createReadStream(csvPath);
    const parser = readStream.pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })
    );

    let batch = [];
    let totalCount = 0;
    let index = 0;

    for await (const record of parser) {
      batch.push(normalizeRecord(record, index));
      index++;

      // Insert in batches
      if (batch.length >= BATCH_SIZE) {
        await collection.insertMany(batch);
        totalCount += batch.length;
        console.log(`✅ Imported ${totalCount} records...`);
        batch = [];
      }
    }

    // Insert remaining records
    if (batch.length > 0) {
      await collection.insertMany(batch);
      totalCount += batch.length;
    }

    console.log(`\n🎉 Import completed!`);
    console.log(`📊 Total records imported: ${totalCount}`);

    // Create indexes
    console.log('\n📇 Creating indexes...');
    await collection.createIndex({ customerName: 'text', phoneNumber: 'text' });
    await collection.createIndex({ customerRegion: 1 });
    await collection.createIndex({ gender: 1 });
    await collection.createIndex({ productCategory: 1 });
    await collection.createIndex({ date: -1 });
    await collection.createIndex({ age: 1 });
    console.log('✅ Indexes created');

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n👋 MongoDB connection closed');
    }
  }
};

// Run the import
importCSVToMongoDB();