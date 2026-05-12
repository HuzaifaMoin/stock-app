'use server';

import dns from "dns";

// Set DNS servers to improve connection reliability
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import { getAuth } from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
import {headers} from "next/headers";
import { redirect } from "next/navigation";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    const auth = await getAuth();
    try {
        const response = await auth.api.signUpEmail({ body: { email, password, name: fullName } })

        if(response) {
            // Try to send Inngest event, but don't fail if it doesn't work
            try {
                await inngest.send({
                    name: 'app/user.created',
                    data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
                })
            } catch (inngestError) {
                console.warn('Inngest event failed, but sign up succeeded:', inngestError)
            }
        }

        return { success: true, data: response }
    } catch (e) {
        console.log('Sign up failed', e)
        return { success: false, error: 'Sign up failed' }
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    const auth = await getAuth();
    try {
        const response = await auth.api.signInEmail({ body: { email, password } })

        return { success: true, data: response }
    } catch (e) {
        console.log('Sign in failed', e)
        return { success: false, error: 'Sign in failed' }
    }
}

export const signOut = async () => {
    const auth = await getAuth();
    try {
        await auth.api.signOut({ headers: await headers() });
        return { success: true, redirect: "/sign-in" };
    } catch (e) {
        console.log('Sign out failed', e)
        return { success: false, error: 'Sign out failed' }
    }
}