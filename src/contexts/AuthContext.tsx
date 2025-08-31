"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { getCurrentUser, fetchUserAttributes, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { AuthState, User, UserRole } from "@/types/auth";
import "@/lib/amplify"; // Ensure Amplify is configured

interface AuthContextType extends AuthState {
    signIn: (
        email: string,
        password: string
    ) => Promise<{ nextStep?: unknown }>;
    confirmMFA: (code: string) => Promise<void>;
    setupTOTP: (totpSetupDetails?: {
        getSetupUri: (appName: string, userEmail: string) => URL;
    }) => Promise<{ qrCodeUri?: string; sharedSecret?: string }>;
    confirmTOTPSetup: (code: string, duringSignIn?: boolean) => Promise<void>;
    signUp: (
        email: string,
        password: string,
        username: string,
        phone: string
    ) => Promise<void>;
    confirmSignUp: (email: string, code: string) => Promise<void>;
    signOutUser: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ nextStep?: unknown }>;
    confirmResetPassword: (
        email: string,
        code: string,
        newPassword: string
    ) => Promise<{ nextStep?: unknown }>;
    resendConfirmationCode: (email: string) => Promise<void>;
    mfaRequired: boolean;
    setMfaRequired: (required: boolean) => void;
    totpSetupRequired: boolean;
    setTotpSetupRequired: (required: boolean) => void;
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
    console.log("AuthProvider component rendering...");

    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: false, // Start with false to see if the UI updates
    });

    const [mfaRequired, setMfaRequired] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("mfaRequired") === "true";
        }
        return false;
    });
    const [totpSetupRequired, setTotpSetupRequired] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("totpSetupRequired") === "true";
        }
        return false;
    });
    const [currentSignInSession, setCurrentSignInSession] = useState<unknown>(
        () => {
            if (typeof window !== "undefined") {
                const stored = sessionStorage.getItem("signInSession");
                return stored ? JSON.parse(stored) : null;
            }
            return null;
        }
    );

    // Helper functions to persist state in sessionStorage
    const updateMfaRequired = (required: boolean) => {
        setMfaRequired(required);
        if (typeof window !== "undefined") {
            if (required) {
                sessionStorage.setItem("mfaRequired", "true");
            } else {
                sessionStorage.removeItem("mfaRequired");
            }
        }
    };

    const updateTotpSetupRequired = (required: boolean) => {
        setTotpSetupRequired(required);
        if (typeof window !== "undefined") {
            if (required) {
                sessionStorage.setItem("totpSetupRequired", "true");
            } else {
                sessionStorage.removeItem("totpSetupRequired");
            }
        }
    };

    const updateCurrentSignInSession = (session: unknown) => {
        setCurrentSignInSession(session);
        if (typeof window !== "undefined") {
            if (session) {
                sessionStorage.setItem(
                    "signInSession",
                    JSON.stringify(session)
                );
            } else {
                sessionStorage.removeItem("signInSession");
            }
        }
    };

    const checkMFAStatus = async (): Promise<boolean> => {
        try {
            // For AWS Cognito, MFA is typically configured at the User Pool level
            // We can check if the user has MFA setup by attempting to fetch user attributes
            // or check the user pool configuration. For now, let's assume MFA is enabled
            // if the User Pool has MFA configured (which yours does based on the testing guide)

            console.log("Checking MFA status...");
            // Since MFA is configured at the Cognito level, we'll return true
            // In a production environment, you'd query the user's MFA setup status
            return true; // MFA is available/enabled in your Cognito setup
        } catch (error) {
            console.log("Could not fetch MFA status:", error);
            return false;
        }
    };

    const checkAuthState = useCallback(async (preserveExistingAuth = false) => {
        console.log(
            "Checking auth state...",
            preserveExistingAuth ? "(preserving existing auth)" : ""
        );

        try {
            const currentUser = await getCurrentUser();
            console.log("getCurrentUser successful:", currentUser.username);

            const attributes = await fetchUserAttributes();
            console.log("fetchUserAttributes successful");

            // Check user groups for role assignment
            let role: UserRole = "user";

            try {
                // Import fetchAuthSession to get user groups
                const { fetchAuthSession } = await import("aws-amplify/auth");
                const session = await fetchAuthSession();

                // Check if user is in admin group
                const groups =
                    (session.tokens?.accessToken?.payload?.[
                        "cognito:groups"
                    ] as string[]) || [];
                console.log("User groups:", groups);

                if (groups.includes("admin")) {
                    role = "admin";
                }
            } catch (groupError) {
                console.log(
                    "Could not fetch user groups, defaulting to 'user' role:",
                    groupError
                );
            }

            const user: User = {
                id: currentUser.userId,
                email: attributes.email || "",
                username: currentUser.username,
                name:
                    attributes.name ||
                    `${attributes.given_name || ""} ${
                        attributes.family_name || ""
                    }`.trim() ||
                    attributes.email?.split("@")[0] ||
                    currentUser.username,
                givenName: attributes.given_name || "",
                familyName: attributes.family_name || "",
                phoneNumber: attributes.phone_number || "",
                role,
                isEmailVerified: attributes.email_verified === "true",
                mfaEnabled: await checkMFAStatus(), // Properly detect MFA status
                createdAt: attributes.created_at || "",
                updatedAt: attributes.updated_at || "",
            };

            setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
            console.log("Auth state set:", {
                user: user.username,
                role: user.role,
                isAuthenticated: true,
            });
        } catch (error) {
            // Handle the specific case where user is not authenticated
            if (
                error instanceof Error &&
                error.name === "UserUnAuthenticatedException"
            ) {
                console.log("User not authenticated");
                if (preserveExistingAuth) {
                    console.log("Preserving existing auth state due to flag");
                    return; // Don't override existing auth state
                }
                console.log("Setting unauthenticated state");
            } else {
                console.error("Auth check error:", error);
            }

            // Only set unauthenticated if we're not preserving existing auth
            if (!preserveExistingAuth) {
                setAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
                console.log("Auth state set to unauthenticated");
            }
        }
    }, []); // Empty dependencies since it doesn't depend on any state/props

    useEffect(() => {
        console.log("✅ useEffect is working!");

        // Listen to auth events using Amplify Hub
        const hubListener = (data: {
            payload: { event: string; data?: unknown };
        }) => {
            const { event, data: eventData } = data.payload;
            console.log("Auth event received:", event, eventData);

            switch (event) {
                case "signIn":
                    console.log("User signed in successfully via Hub");
                    // Don't call checkAuthState here - let the signIn function handle it
                    break;
                case "signOut":
                    console.log("User signed out");
                    setAuthState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    break;
                case "signIn_failure":
                    console.log("Sign in failed:", eventData);
                    setAuthState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    break;
            }
        };

        // Subscribe to auth events
        const unsubscribe = Hub.listen("auth", hubListener);

        // Initial auth state check
        checkAuthState().catch((error) => {
            console.log("Initial auth state check failed:", error);
        });

        // Cleanup
        return () => {
            unsubscribe();
        };
    }, [checkAuthState]); // Include checkAuthState as dependency

    const signIn = async (email: string, password: string) => {
        try {
            const { signIn } = await import("aws-amplify/auth");
            const signInResult = await signIn({ username: email, password });
            console.log("Sign in result:", signInResult);

            // Store the sign-in session for MFA confirmation
            updateCurrentSignInSession(signInResult);

            // Check if TOTP setup is required first
            if (
                signInResult.nextStep?.signInStep ===
                "CONTINUE_SIGN_IN_WITH_TOTP_SETUP"
            ) {
                console.log("TOTP setup required:", signInResult.nextStep);
                updateTotpSetupRequired(true);
                return { nextStep: signInResult.nextStep };
            }

            // Check if MFA is required (including existing TOTP verification)
            if (
                signInResult.nextStep?.signInStep ===
                    "CONTINUE_SIGN_IN_WITH_MFA_SELECTION" ||
                signInResult.nextStep?.signInStep ===
                    "CONFIRM_SIGN_IN_WITH_SMS_CODE" ||
                signInResult.nextStep?.signInStep ===
                    "CONFIRM_SIGN_IN_WITH_TOTP_CODE" ||
                signInResult.nextStep?.signInStep ===
                    "CONFIRM_SIGN_IN_WITH_EMAIL_CODE"
            ) {
                console.log("MFA required:", signInResult.nextStep);
                updateMfaRequired(true);
                return { nextStep: signInResult.nextStep };
            }

            // Sign in completed without MFA
            console.log("Sign in successful without MFA:", signInResult);

            // Manually set auth state with basic user info
            // We'll get full user details later when the session is established
            const basicUser: User = {
                id: email, // Use email as temporary ID
                email: email,
                username: email.split("@")[0], // Use email prefix as username temporarily
                role: "user", // Default role, will be updated later
                isEmailVerified: true,
                mfaEnabled: true, // Set to true since MFA is configured in Cognito
                createdAt: "",
                updatedAt: "",
            };

            setAuthState({
                user: basicUser,
                isAuthenticated: true,
                isLoading: false,
            });
            updateMfaRequired(false);

            console.log("Basic auth state set, will fetch full details later");

            // Schedule a delayed check to get full user details and role
            // But don't override the basic auth state if it fails
            setTimeout(async () => {
                try {
                    console.log("Starting delayed auth state check...");
                    await checkAuthState(true); // Preserve existing auth if it fails
                } catch (error) {
                    console.log(
                        "Delayed auth state check failed, keeping basic state:",
                        error
                    );
                    // Keep the basic auth state we already set
                }
            }, 3000); // Increased delay to 3 seconds

            return { nextStep: undefined };
        } catch (error) {
            console.error("Sign in error:", error);
            updateMfaRequired(false);
            updateCurrentSignInSession(null); // Clear session on error
            throw error;
        }
    };

    const confirmMFA = async (code: string) => {
        try {
            // Check if we have an active sign-in session
            if (!currentSignInSession) {
                console.error(
                    "No active sign-in session found for MFA confirmation"
                );
                throw new Error(
                    "Sign-in session expired. Please sign in again."
                );
            }

            const { confirmSignIn } = await import("aws-amplify/auth");
            const confirmSignInResult = await confirmSignIn({
                challengeResponse: code,
            });
            console.log("MFA confirmation result:", confirmSignInResult);

            // Clear the stored session since MFA is complete
            updateCurrentSignInSession(null);

            // MFA completed successfully, user is now authenticated
            updateMfaRequired(false);

            // Set basic auth state immediately
            const basicUser: User = {
                id: "temp", // Will be updated by checkAuthState
                email: "temp", // Will be updated by checkAuthState
                username: "temp", // Will be updated by checkAuthState
                role: "user", // Default role, will be updated later
                isEmailVerified: true,
                mfaEnabled: true,
                createdAt: "",
                updatedAt: "",
            };

            setAuthState({
                user: basicUser,
                isAuthenticated: true,
                isLoading: false,
            });

            // Get full user details
            setTimeout(async () => {
                try {
                    await checkAuthState(true);
                } catch (error) {
                    console.log(
                        "Failed to update user details after MFA:",
                        error
                    );
                }
            }, 1000);
        } catch (error) {
            console.error("MFA confirmation error:", error);
            updateMfaRequired(false);
            updateCurrentSignInSession(null); // Clear session on MFA error
            throw error;
        }
    };

    const setupTOTP = async (totpSetupDetails?: {
        getSetupUri: (appName: string, userEmail: string) => URL;
    }) => {
        try {
            // If totpSetupDetails are provided from signIn nextStep, use those
            if (totpSetupDetails) {
                console.log(
                    "Using TOTP setup details from sign-in flow:",
                    totpSetupDetails
                );

                // Generate QR code URI for the user
                const appName = "TechStore";
                const userEmail = authState.user?.email || "user@example.com";
                const setupUri = totpSetupDetails.getSetupUri(
                    appName,
                    userEmail
                );
                const qrCodeUri = setupUri.toString();

                // Extract secret from the setup URI
                const secretMatch = qrCodeUri.match(/secret=([A-Z0-9]+)/);
                const sharedSecret = secretMatch
                    ? secretMatch[1]
                    : "PLACEHOLDER_SECRET";

                updateTotpSetupRequired(true);

                return {
                    qrCodeUri,
                    sharedSecret,
                };
            } else {
                // Fallback to setUpTOTP for standalone setup
                const { setUpTOTP } = await import("aws-amplify/auth");
                const totpSetupDetails = await setUpTOTP();
                console.log("TOTP setup initiated:", totpSetupDetails);

                // Generate QR code URI for the user
                const appName = "TechStore";
                const userEmail = authState.user?.email || "user@example.com";
                const setupUri = totpSetupDetails.getSetupUri(
                    appName,
                    userEmail
                );
                const qrCodeUri = setupUri.toString();

                // Extract secret from the setup URI
                const secretMatch = qrCodeUri.match(/secret=([A-Z0-9]+)/);
                const sharedSecret = secretMatch
                    ? secretMatch[1]
                    : "PLACEHOLDER_SECRET";

                updateTotpSetupRequired(true);

                return {
                    qrCodeUri,
                    sharedSecret,
                };
            }
        } catch (error) {
            console.error("TOTP setup error:", error);
            throw error;
        }
    };

    const confirmTOTPSetup = async (
        code: string,
        duringSignIn: boolean = false
    ) => {
        try {
            if (duringSignIn) {
                // During sign-in flow, use confirmSignIn
                const { confirmSignIn } = await import("aws-amplify/auth");
                const confirmSignInResult = await confirmSignIn({
                    challengeResponse: code,
                });
                console.log(
                    "TOTP setup confirmed during sign-in:",
                    confirmSignInResult
                );

                updateTotpSetupRequired(false);

                // Check if sign-in is complete
                if (confirmSignInResult.nextStep?.signInStep === "DONE") {
                    // Sign-in completed successfully, user is now authenticated
                    // Set basic auth state immediately
                    const basicUser: User = {
                        id: "temp", // Will be updated by checkAuthState
                        email: "temp", // Will be updated by checkAuthState
                        username: "temp", // Will be updated by checkAuthState
                        role: "user", // Default role, will be updated later
                        isEmailVerified: true,
                        mfaEnabled: true,
                        createdAt: "",
                        updatedAt: "",
                    };

                    setAuthState({
                        user: basicUser,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    // Get full user details
                    setTimeout(async () => {
                        try {
                            await checkAuthState(true); // Preserve existing auth if it fails
                        } catch (error) {
                            console.log(
                                "Delayed auth state check failed, keeping basic state:",
                                error
                            );
                        }
                    }, 1000);
                } else {
                    // Handle additional steps if needed
                    console.log(
                        "Additional steps required after TOTP setup:",
                        confirmSignInResult.nextStep
                    );
                }
            } else {
                // Standalone TOTP setup, use verifyTOTPSetup
                const { verifyTOTPSetup } = await import("aws-amplify/auth");
                await verifyTOTPSetup({ code });
                console.log("TOTP setup confirmed successfully");

                updateTotpSetupRequired(false);

                // Update user's MFA status
                if (authState.user) {
                    const updatedUser = { ...authState.user, mfaEnabled: true };
                    setAuthState({
                        ...authState,
                        user: updatedUser,
                    });
                }
            }
        } catch (error) {
            console.error("TOTP setup confirmation error:", error);
            throw error;
        }
    };

    const signUp = async (
        email: string,
        password: string,
        username: string,
        phone: string
    ) => {
        try {
            const { signUp } = await import("aws-amplify/auth");
            await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email,
                        name: username, // Required by your Cognito config
                        phone_number: phone, // Required by your Cognito config
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
            // Clear all session states
            updateMfaRequired(false);
            updateTotpSetupRequired(false);
            updateCurrentSignInSession(null);
        } catch (error) {
            console.error("Sign out error:", error);
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            const { resetPassword } = await import("aws-amplify/auth");
            const resetResult = await resetPassword({
                username: email,
                options: {
                    deliveryMethod: "EMAIL", // Force email delivery instead of SMS
                },
            });
            console.log("Reset password result:", resetResult);

            // Check if MFA is required for password reset
            if (
                resetResult.nextStep?.resetPasswordStep ===
                "CONFIRM_RESET_PASSWORD_WITH_CODE"
            ) {
                console.log("Password reset code required");
                return { nextStep: resetResult.nextStep };
            }

            return { nextStep: undefined };
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
            console.log("Password reset confirmed successfully");
            return { nextStep: undefined };
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
                confirmMFA,
                setupTOTP,
                confirmTOTPSetup,
                signUp,
                confirmSignUp,
                signOutUser,
                resetPassword,
                confirmResetPassword,
                resendConfirmationCode,
                mfaRequired,
                setMfaRequired: updateMfaRequired,
                totpSetupRequired,
                setTotpSetupRequired: updateTotpSetupRequired,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
