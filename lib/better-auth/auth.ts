import dns from "dns";

// Set DNS servers to improve connection reliability
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectToDatabase} from "@/database/mongoose";
import { nextCookies} from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth<any>> | null = null;

export const getAuth = async (): Promise<ReturnType<typeof betterAuth<any>>> => {
    if(authInstance) return authInstance;

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;

        if(!db) throw new Error('MongoDB connection not found');

        authInstance = betterAuth({
            database: mongodbAdapter(db as any),
            secret: process.env.BETTER_AUTH_SECRET,
            baseURL: process.env.BETTER_AUTH_URL,
            emailAndPassword: {
                enabled: true,
                disableSignUp: false,
                requireEmailVerification: false,
                minPasswordLength: 8,
                maxPasswordLength: 128,
                autoSignIn: true,
            },
            plugins: [nextCookies()],
        });

        return authInstance;
    } catch (error) {
        console.warn(' Failed to initialize auth with MongoDB:', error);

        // For development, create a minimal auth instance without database
        if (process.env.NODE_ENV === 'development') {
            console.log('  Using development auth mode (no database)');

            // Create auth without database adapter - BetterAuth supports this for development
            authInstance = betterAuth({
                secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-key',
                baseURL: process.env.BETTER_AUTH_URL,
                emailAndPassword: {
                    enabled: true,
                    disableSignUp: false,
                    requireEmailVerification: false,
                    minPasswordLength: 8,
                    maxPasswordLength: 128,
                    autoSignIn: true,
                },
                plugins: [nextCookies()],
                // No database adapter - auth will work in memory only
            });

            return authInstance;
        }

        throw error;
    }
}