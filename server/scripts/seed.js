import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Venue } from '../models/Venue.js';
import { Template } from '../models/Template.js';
import { Assignment } from '../models/Assignment.js';
import { AuditRecord } from '../models/AuditRecord.js';
import { Auditor } from '../models/Auditor.js';

// Setup ES module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fc_smart_audit';

async function seedDatabase() {
  console.log('=============================================');
  console.log('🌱 Starting FC Smart Audit Database Seed...');
  console.log(`📡 Target MongoDB: ${MONGODB_URI}`);
  console.log('=============================================\n');

  try {
    // 1. Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB.');

    // 2. Read Seed Data
    const seedDataPath = path.resolve(__dirname, '../data/seedData.json');
    if (!fs.existsSync(seedDataPath)) {
      throw new Error(`Seed data file not found at ${seedDataPath}`);
    }
    
    console.log('📥 Loading seed data...');
    const seedPayload = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

    // 3. Wipe Existing Data
    console.log('🗑️ Wiping existing collections...');
    await Venue.deleteMany({});
    await Template.deleteMany({});
    await Assignment.deleteMany({});
    await AuditRecord.deleteMany({});
    await Auditor.deleteMany({});
    console.log('✅ Collections wiped.');

    // 4. Insert Seed Data
    console.log('\n🚀 Inserting fresh seed data...');
    
    if (seedPayload.venues && seedPayload.venues.length > 0) {
      await Venue.insertMany(seedPayload.venues);
      console.log(`   ➔ Seeded ${seedPayload.venues.length} Venues`);
    }

    if (seedPayload.templates && seedPayload.templates.length > 0) {
      await Template.insertMany(seedPayload.templates);
      console.log(`   ➔ Seeded ${seedPayload.templates.length} Templates`);
    }

    if (seedPayload.assignments && seedPayload.assignments.length > 0) {
      await Assignment.insertMany(seedPayload.assignments);
      console.log(`   ➔ Seeded ${seedPayload.assignments.length} Assignments`);
    }

    if (seedPayload.records && seedPayload.records.length > 0) {
      await AuditRecord.insertMany(seedPayload.records);
      console.log(`   ➔ Seeded ${seedPayload.records.length} Audit Records`);
    }

    if (seedPayload.auditors && seedPayload.auditors.length > 0) {
      await Auditor.insertMany(seedPayload.auditors);
      console.log(`   ➔ Seeded ${seedPayload.auditors.length} Auditors`);
    }

    console.log('\n🎉 Seeding Completed Successfully!');
  } catch (error) {
    console.error('\n❌ Error during seeding:', error.message);
    process.exit(1);
  } finally {
    // 5. Disconnect
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB.');
    }
    process.exit(0);
  }
}

seedDatabase();
