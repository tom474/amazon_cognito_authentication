"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Shield, Smartphone, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface MFAFormProps {
    mfaType?: "SMS" | "TOTP" | "EMAIL";
    onSuccess?: () => void;
    onCancel?: () => void;
    onConfirm?: (code: string) => Promise<void>; // Custom confirmation handler
}

export const MFAForm: React.FC<MFAFormProps> = ({
    mfaType = "SMS",
    onSuccess,
    onCancel,
    onConfirm, // Custom confirmation handler
}) => {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { confirmMFA } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) {
            setError("Please enter the verification code");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Use custom confirmation handler if provided, otherwise use default confirmMFA
            if (onConfirm) {
                await onConfirm(code);
            } else {
                await confirmMFA(code);
            }
            onSuccess?.();
        } catch (error) {
            console.error("MFA confirmation error:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Invalid verification code. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getMFAIcon = () => {
        switch (mfaType) {
            case "SMS":
                return <Smartphone className="h-5 w-5" />;
            case "EMAIL":
                return <Mail className="h-5 w-5" />;
            case "TOTP":
                return <Shield className="h-5 w-5" />;
            default:
                return <Shield className="h-5 w-5" />;
        }
    };

    const getMFADescription = () => {
        switch (mfaType) {
            case "SMS":
                return "Enter the 6-digit code sent to your phone via SMS";
            case "EMAIL":
                return "Enter the verification code sent to your email";
            case "TOTP":
                return "Enter the 6-digit code from your authenticator app";
            default:
                return "Enter your verification code";
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                    {getMFAIcon()}
                    <CardTitle className="text-2xl">
                        Two-Factor Authentication
                    </CardTitle>
                </div>
                <CardDescription>{getMFADescription()}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="mfa-code">Verification Code</Label>
                        <Input
                            id="mfa-code"
                            type="text"
                            placeholder="000000"
                            value={code}
                            onChange={(e) => {
                                // Only allow numbers and limit to 6 digits for most MFA codes
                                const value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6);
                                setCode(value);
                            }}
                            maxLength={6}
                            className="text-center text-lg tracking-widest"
                            disabled={isLoading}
                            autoComplete="one-time-code"
                            autoFocus
                        />
                        <p className="text-sm text-muted-foreground">
                            Enter the {mfaType === "TOTP" ? "6" : "6"}-digit
                            code
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || code.length < 6}
                        >
                            {isLoading ? "Verifying..." : "Verify Code"}
                        </Button>

                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Didn&apos;t receive the code?{" "}
                            <button
                                type="button"
                                className="text-primary hover:underline"
                                onClick={() => {
                                    // In a real implementation, you'd call a resend function
                                    console.log("Resend MFA code requested");
                                }}
                                disabled={isLoading}
                            >
                                Resend
                            </button>
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default MFAForm;
