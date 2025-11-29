import connectDB from './src/lib/mongodb.ts';

async function testDB() {
  try {
    const db = await connectDB();
    console.log("MongoDB connected!");
    process.exit(0);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

testDB();
