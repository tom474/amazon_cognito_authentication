"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import MFAForm from "@/components/auth/MFAForm";
import TOTPSetup from "@/components/auth/TOTPSetup";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showMFA, setShowMFA] = useState(false);
    const [showTOTPSetup, setShowTOTPSetup] = useState(false);
    const [mfaType, setMfaType] = useState<"SMS" | "TOTP" | "EMAIL">("SMS");
    const [totpSetupData, setTotpSetupData] = useState<{
        qrCodeUri?: string;
        sharedSecret?: string;
    }>({});

    const { signIn, setupTOTP } = useAuth();
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn(formData.email, formData.password);

            // Check if MFA is required
            if (result.nextStep) {
                console.log("MFA required:", result.nextStep);

                // Determine MFA type from the nextStep
                const nextStep = result.nextStep as {
                    signInStep?: string;
                    totpSetupDetails?: {
                        getSetupUri: (
                            appName: string,
                            userEmail: string
                        ) => URL;
                    };
                };

                // Check if TOTP setup is required
                if (
                    nextStep.signInStep === "CONTINUE_SIGN_IN_WITH_TOTP_SETUP"
                ) {
                    console.log("TOTP setup required:", nextStep);
                    try {
                        // Use the totpSetupDetails from the nextStep
                        const setupData = await setupTOTP(
                            nextStep.totpSetupDetails
                        );
                        setTotpSetupData(setupData);
                        setShowTOTPSetup(true);
                        toast.info(
                            "Please set up your authenticator app to continue"
                        );
                        return;
                    } catch (setupError) {
                        console.error("TOTP setup failed:", setupError);
                        toast.error("Failed to initiate TOTP setup");
                        return;
                    }
                }

                // Handle TOTP verification - always show QR code interface
                if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_TOTP_CODE") {
                    setMfaType("TOTP");
                    setShowTOTPSetup(true);
                    // For existing TOTP users, generate a reference QR (not a new secret)
                    setTotpSetupData({
                        qrCodeUri: "", // Empty QR - component will generate reference QR
                        sharedSecret: "", // No secret for existing users
                    });
                    toast.info("Use your authenticator app to sign in");
                    return;
                }

                setShowMFA(true);
                if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_SMS_CODE") {
                    setMfaType("SMS");
                } else if (
                    nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_EMAIL_CODE"
                ) {
                    setMfaType("EMAIL");
                } else {
                    setMfaType("EMAIL"); // Default to EMAIL instead of SMS
                }

                toast.info("Please enter your MFA code to complete sign in");
                return;
            }

            // Sign in completed without MFA
            toast.success("Welcome back!");
            router.push("/products");
        } catch (error) {
            console.error("Sign in error:", error);

            // Handle specific error cases
            if (error instanceof Error) {
                const errorMessage = error.message;

                if (errorMessage.includes("UserNotConfirmedException")) {
                    toast.error(
                        "Please verify your email first. Check your inbox for verification code."
                    );
                    router.push("/auth/signup"); // Redirect to verification
                } else if (errorMessage.includes("NotAuthorizedException")) {
                    toast.error("Invalid email or password");
                } else if (errorMessage.includes("UserNotFoundException")) {
                    toast.error("No account found with this email");
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error("Failed to sign in");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleMFASuccess = () => {
        toast.success("Welcome back!");
        setShowMFA(false);
        router.push("/products");
    };

    const handleMFACancel = () => {
        setShowMFA(false);
        setFormData({ email: "", password: "" });
        toast.info("Sign in cancelled. Please try again.");
    };

    const handleTOTPSetupSuccess = () => {
        toast.success("Authenticator setup complete! Welcome!");
        setShowTOTPSetup(false);
        router.push("/products");
    };

    const handleTOTPSetupCancel = () => {
        setShowTOTPSetup(false);
        setFormData({ email: "", password: "" });
        toast.info("Authenticator setup cancelled. Please sign in again.");
    };

    // If TOTP setup is required, show the TOTP setup form
    if (showTOTPSetup) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <TOTPSetup
                        qrCodeUri={totpSetupData.qrCodeUri}
                        sharedSecret={totpSetupData.sharedSecret}
                        onSuccess={handleTOTPSetupSuccess}
                        onCancel={handleTOTPSetupCancel}
                        duringSignIn={true}
                    />
                </div>
            </div>
        );
    }

    // If MFA is required, show the MFA form
    if (showMFA) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <MFAForm
                        mfaType={mfaType}
                        onSuccess={handleMFASuccess}
                        onCancel={handleMFACancel}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">
                            Welcome Back
                        </CardTitle>
                        <CardDescription>
                            Sign in to your TechStore account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSignIn}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/auth/reset-password"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4 pt-6">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing In..." : "Sign In"}
                            </Button>
                            <div className="text-center text-sm text-gray-600">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/auth/signup"
                                    className="text-blue-600 hover:underline"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
