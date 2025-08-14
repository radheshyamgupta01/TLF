// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable");
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectDB() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       return mongoose;
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }

// export default connectDB;




import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // console.error("❌ MONGODB_URI environment variable is not defined");
  throw new Error("Please define the MONGODB_URI environment variable");
}

// console.log("📝 MONGODB_URI found:", MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")); // Hide credentials in logs

let cached = global.mongoose;

if (!cached) {
  // console.log("🔧 Initializing MongoDB cache...");
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // console.log("🔌 connectDB() called");
  
  if (cached.conn) {
    // console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    // console.log("🚀 Creating new MongoDB connection...");
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // console.log("✅ MongoDB connection established successfully");
      return mongoose;
    });
  } else {
    console.log("⏳ Using existing connection promise...");
  }

  try {
    // console.log("🔄 Awaiting MongoDB connection...");
    cached.conn = await cached.promise;
    // console.log("🎉 MongoDB connected! Connection state:", mongoose.connection.readyState);
  } catch (e) {
    // console.error("❌ MongoDB connection failed:", e.message);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
