"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, fetchUserAttributes, signOut } from "aws-amplify/auth";
import { AuthState, User, UserRole } from "@/types/auth";

interface AuthContextType extends AuthState {
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (
        email: string,
        password: string,
        username: string
    ) => Promise<void>;
    confirmSignUp: (email: string, code: string) => Promise<void>;
    signOutUser: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    confirmResetPassword: (
        email: string,
        code: string,
        newPassword: string
    ) => Promise<void>;
    resendConfirmationCode: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    const checkAuthState = async () => {
        try {
            const currentUser = await getCurrentUser();
            const attributes = await fetchUserAttributes();

            // Extract role from custom attributes or default to 'user'
            const role: UserRole =
                (attributes["custom:role"] as UserRole) || "user";

            const user: User = {
                id: currentUser.userId,
                email: attributes.email || "",
                username: currentUser.username,
                role,
                isEmailVerified: attributes.email_verified === "true",
                mfaEnabled: false,
                createdAt: "",
                updatedAt: "",
            };

            setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            console.error("Auth check error:", error);
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    };

    useEffect(() => {
        checkAuthState();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const { signIn } = await import("aws-amplify/auth");
            await signIn({ username: email, password });
            await checkAuthState();
        } catch (error) {
            console.error("Sign in error:", error);
            throw error;
        }
    };

    const signUp = async (
        email: string,
        password: string,
        username: string
    ) => {
        try {
            const { signUp } = await import("aws-amplify/auth");
            await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email,
                        preferred_username: username,
                        "custom:role": "user", // Default role
                    },
                    autoSignIn: false,
                },
            });
        } catch (error) {
            console.error("Sign up error:", error);
            throw error;
        }
    };

    const confirmSignUp = async (email: string, code: string) => {
        try {
            const { confirmSignUp } = await import("aws-amplify/auth");
            await confirmSignUp({ username: email, confirmationCode: code });
        } catch (error) {
            console.error("Confirm sign up error:", error);
            throw error;
        }
    };

    const signOutUser = async () => {
        try {
            await signOut();
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        } catch (error) {
            console.error("Sign out error:", error);
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            const { resetPassword } = await import("aws-amplify/auth");
            await resetPassword({ username: email });
        } catch (error) {
            console.error("Reset password error:", error);
            throw error;
        }
    };

    const confirmResetPassword = async (
        email: string,
        code: string,
        newPassword: string
    ) => {
        try {
            const { confirmResetPassword } = await import("aws-amplify/auth");
            await confirmResetPassword({
                username: email,
                confirmationCode: code,
                newPassword,
            });
        } catch (error) {
            console.error("Confirm reset password error:", error);
            throw error;
        }
    };

    const resendConfirmationCode = async (email: string) => {
        try {
            const { resendSignUpCode } = await import("aws-amplify/auth");
            await resendSignUpCode({ username: email });
        } catch (error) {
            console.error("Resend confirmation code error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                signIn,
                signUp,
                confirmSignUp,
                signOutUser,
                resetPassword,
                confirmResetPassword,
                resendConfirmationCode,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
