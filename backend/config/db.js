import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // ✅ Check for MongoDB URI in environment variables
    const mongoURI = process.env.MONGO_URI || process.env.DATABASE_URL || process.env.MONGODB_URI;
    
    // ✅ Log what we're trying to connect to (without password)
    if (mongoURI) {
      const maskedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
      console.log("🔗 Attempting to connect to MongoDB:", maskedURI);
    } else {
      console.error("❌ No MongoDB URI found in environment variables!");
      console.error("📋 Available env vars:", Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('DATABASE')));
      throw new Error("MONGO_URI, DATABASE_URL, or MONGODB_URI environment variable is required");
    }
    
    // ✅ Connect with options for better error handling
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB Connected successfully!");
    console.log("📊 Database:", mongoose.connection.db.databaseName);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("💡 Make sure you've set MONGO_URI or DATABASE_URL in Render environment variables");
    console.error("💡 Check that your MongoDB Atlas connection string is correct");
    process.exit(1);
  }
};

export default connectDB;
