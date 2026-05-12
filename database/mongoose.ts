import mongoose from "mongoose";
import dns from "dns";

// Set DNS servers to improve connection reliability
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/stock-app";

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        // For development, try local MongoDB first, fallback to Atlas
        const uri = process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI?.includes('mongodb+srv')
            ? "mongodb://localhost:27017/stock-app"
            : MONGODB_URI;

        cached.promise = mongoose.connect(uri, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // Shorter timeout for dev
            family: 4,
            retryWrites: true,
            w: 'majority'
        }).then(m => m);
    }

    try {
        cached.conn = await cached.promise;
        console.log(`Connected to MongoDB (${process.env.NODE_ENV})`);
    } catch (err) {
        cached.promise = null;
        console.error('MongoDB Connection Error:', err);

        // For development, provide helpful error messages
        if (process.env.NODE_ENV === 'development') {
            if (err instanceof Error) {
                if (err.message.includes('querySrv')) {
                    console.warn('💡 MongoDB Atlas cluster may be paused. Go to https://cloud.mongodb.com and resume your cluster.');
                } else if (err.message.includes('ECONNREFUSED')) {
                    console.warn('💡 Local MongoDB not running. Install MongoDB or use Atlas.');
                } else if (err.message.includes('authentication')) {
                    console.warn('💡 Check your MongoDB credentials in .env file.');
                }
            }
        }
        throw err;
    }

    return cached.conn;
}