import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default max rows to keep in memory
// You can change this or override via env var MAX_RECORDS
const MAX_RECORDS_DEFAULT = 200000;

/**
 * Safely parse an integer from CSV field
 */
const parseIntSafe = (value) => {
  if (value === undefined || value === null || value === '') return 0;
  const n = parseInt(String(value).replace(/,/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Safely parse a float from CSV field
 */
const parseFloatSafe = (value) => {
  if (value === undefined || value === null || value === '') return 0;
  const n = parseFloat(String(value).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/**
 * Parse tags from string format to array
 */
const parseTags = (tagsString) => {
  if (!tagsString) return [];
  if (Array.isArray(tagsString)) return tagsString;

  // Handle "tag1, tag2" or "tag1|tag2" or "[tag1, tag2]"
  const cleaned = String(tagsString).replace(/[\[\]"']/g, '');
  return cleaned
    .split(/[,|]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
};

/**
 * Normalize a raw CSV row into the format used by the app
 */
const normalizeRecord = (record, index) => ({
  // Synthetic transaction ID if CSV doesn’t have one
  transactionId:
    record['Transaction ID'] ||
    record['transaction_id'] ||
    `TXN${String(index + 1).padStart(6, '0')}`,

  // Customer info
  customerId: record['Customer ID'] || record['customer_id'] || '',
  customerName: record['Customer Name'] || record['customer_name'] || '',
  phoneNumber: record['Phone Number'] || record['phone_number'] || '',
  gender: record['Gender'] || record['gender'] || '',
  age: parseIntSafe(record['Age'] || record['age']),
  customerRegion: record['Customer Region'] || record['customer_region'] || '',
  customerType: record['Customer Type'] || record['customer_type'] || '',

  // Product info
  productId: record['Product ID'] || record['product_id'] || '',
  productName: record['Product Name'] || record['product_name'] || '',
  brand: record['Brand'] || record['brand'] || '',
  productCategory: record['Product Category'] || record['product_category'] || '',
  tags: parseTags(record['Tags'] || record['tags'] || ''),

  // Amounts
  quantity: parseIntSafe(record['Quantity'] || record['quantity']),
  pricePerUnit: parseFloatSafe(
    record['Price per Unit'] ||
      record['price_per_unit'] ||
      record['Price'] ||
      record['price']
  ),
  discountPercentage: parseFloatSafe(
    record['Discount Percentage'] ||
      record['discount_percentage'] ||
      record['Discount'] ||
      record['discount']
  ),
  totalAmount: parseFloatSafe(record['Total Amount'] || record['total_amount']),
  finalAmount: parseFloatSafe(
    record['Final Amount'] ||
      record['final_amount'] ||
      record['Net Amount'] ||
      record['net_amount']
  ),

  // Transaction details
  date: record['Date'] || record['date'] || '',
  paymentMethod: record['Payment Method'] || record['payment_method'] || '',
  orderStatus: record['Order Status'] || record['order_status'] || '',
  deliveryType: record['Delivery Type'] || record['delivery_type'] || '',

  // Store & staff
  storeId: record['Store ID'] || record['store_id'] || '',
  storeLocation: record['Store Location'] || record['store_location'] || '',
  salespersonId:
    record['Salesperson ID'] ||
    record['salesperson_id'] ||
    record['Sales Person ID'] ||
    record['sales_person_id'] ||
    '',
  employeeName:
    record['Employee Name'] ||
    record['employee_name'] ||
    record['Sales Person Name'] ||
    record['sales_person_name'] ||
    '',
});

/**
 * Stream CSV and load at most MAX_RECORDS rows into memory.
 * This avoids loading all 1,000,000 rows on machines with low RAM.
 */
export const loadCSVData = async () => {
  const csvPath = path.join(__dirname, '../data/sales_data.csv');

  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    console.error('Please place your CSV file at: backend/src/data/sales_data.csv');
    return [];
  }

  const stats = fs.statSync(csvPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`📁 Loading CSV from: ${csvPath} (${sizeMB} MB)`);

  const maxRecordsEnv = process.env.MAX_RECORDS;
  const maxRecords =
    maxRecordsEnv && !Number.isNaN(Number(maxRecordsEnv))
      ? Number(maxRecordsEnv)
      : MAX_RECORDS_DEFAULT;

  console.log(`⚙️ Will load up to ${maxRecords} records into memory`);

  const results = [];
  const readStream = fs.createReadStream(csvPath);

  const parser = readStream.pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
  );

  let index = 0;
  try {
    for await (const record of parser) {
      results.push(normalizeRecord(record, index));
      index += 1;

      if (results.length >= maxRecords) {
        console.log(
          `⏹️ Reached MAX_RECORDS=${maxRecords}. Stopping further read from CSV.`
        );
        readStream.destroy();
        break;
      }
    }
  } catch (err) {
    console.error('❌ Error while streaming CSV:', err);
    throw err;
  }

  console.log(`✅ Loaded ${results.length} normalized sales records into memory`);
  return results;
};

export default { loadCSVData };
