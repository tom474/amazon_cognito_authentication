"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import Image from "next/image";
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
import {
    AlertCircle,
    Shield,
    Download,
    Copy,
    Check,
    Smartphone,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface TOTPSetupProps {
    qrCodeUri?: string;
    sharedSecret?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    duringSignIn?: boolean;
}

export const TOTPSetup: React.FC<TOTPSetupProps> = ({
    qrCodeUri = "",
    sharedSecret = "",
    onSuccess,
    onCancel,
    duringSignIn = false,
}) => {
    const [qrCodeImage, setQrCodeImage] = useState<string>("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [secretCopied, setSecretCopied] = useState(false);
    const { confirmTOTPSetup, user } = useAuth();

    // Check if this is verification mode (existing user) or setup mode (new user)
    const isVerificationMode = duringSignIn && (!qrCodeUri || qrCodeUri === "");
    const isSetupMode = !isVerificationMode && qrCodeUri && qrCodeUri !== "";

    useEffect(() => {
        if (isSetupMode && qrCodeUri) {
            const generateQRCode = async () => {
                try {
                    const qrImage = await QRCode.toDataURL(qrCodeUri, {
                        width: 256,
                        margin: 2,
                        color: {
                            dark: "#000000",
                            light: "#ffffff",
                        },
                    });
                    setQrCodeImage(qrImage);
                } catch (error) {
                    console.error("QR Code generation failed:", error);
                    setError("Failed to generate QR code");
                }
            };
            generateQRCode();
        } else if (isVerificationMode) {
            // For existing users, generate a QR code that shows their account info
            // This doesn't create a new secret, just provides a visual reference
            const generateReferenceQR = async () => {
                try {
                    const userEmail = user?.email || "user@example.com";
                    const displayText = `TechStore Account\n${
                        user?.name || userEmail
                    }\nUse your existing authenticator app`;

                    const qrImage = await QRCode.toDataURL(displayText, {
                        width: 200,
                        margin: 2,
                        color: {
                            dark: "#4F46E5",
                            light: "#ffffff",
                        },
                    });
                    setQrCodeImage(qrImage);
                } catch (error) {
                    console.error("Reference QR generation failed:", error);
                }
            };
            generateReferenceQR();
        }
    }, [qrCodeUri, isSetupMode, isVerificationMode, user]);

    const handleCopySecret = async () => {
        if (sharedSecret) {
            try {
                await navigator.clipboard.writeText(sharedSecret);
                setSecretCopied(true);
                setTimeout(() => setSecretCopied(false), 2000);
            } catch (error) {
                console.error("Failed to copy secret:", error);
            }
        }
    };

    const handleDownloadQR = () => {
        if (qrCodeImage) {
            const link = document.createElement("a");
            link.download = isSetupMode
                ? "totp-qr-code.png"
                : "techstore-account.png";
            link.href = qrCodeImage;
            link.click();
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!verificationCode.trim() || verificationCode.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Always use confirmTOTPSetup for consistency
            await confirmTOTPSetup(verificationCode, duringSignIn);
            onSuccess?.();
        } catch (error) {
            console.error("TOTP verification failed:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Invalid code. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-2xl">
                        {isSetupMode ? "Set Up Authenticator" : "Sign In"}
                    </CardTitle>
                </div>
                <CardDescription>
                    {isSetupMode
                        ? "Scan the QR code with your authenticator app, then enter the 6-digit code"
                        : "Enter the 6-digit code from your authenticator app"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                {/* QR Code Section - Always shown when available */}
                {(qrCodeImage || isSetupMode) && (
                    <div className="space-y-4">
                        <div className="text-center space-y-3">
                            {qrCodeImage ? (
                                <div className="inline-block p-4 bg-white rounded-lg border">
                                    <Image
                                        src={qrCodeImage}
                                        alt="TOTP QR Code"
                                        width={isSetupMode ? 256 : 200}
                                        height={isSetupMode ? 256 : 200}
                                        className="mx-auto"
                                    />
                                </div>
                            ) : (
                                <div className="inline-block p-4 bg-gray-100 rounded-lg border">
                                    <div className="w-64 h-64 flex items-center justify-center text-gray-500">
                                        <div className="text-center space-y-2">
                                            <Smartphone className="h-12 w-12 mx-auto opacity-50" />
                                            <p className="text-sm">
                                                Loading QR Code...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* QR Code Actions */}
                            <div className="flex justify-center gap-2">
                                {qrCodeImage && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDownloadQR}
                                        className="text-xs"
                                    >
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Manual Entry for Setup Mode */}
                        {isSetupMode && sharedSecret && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600 text-center">
                                    Can&apos;t scan? Enter this code manually:
                                </p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                                        {sharedSecret}
                                    </code>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopySecret}
                                    >
                                        {secretCopied ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        {isSetupMode && (
                            <div className="space-y-2 text-sm text-gray-600">
                                <p className="font-medium">Instructions:</p>
                                <ol className="list-decimal list-inside space-y-1 text-xs">
                                    <li>Open your authenticator app</li>
                                    <li>
                                        Scan the QR code or enter the code
                                        manually
                                    </li>
                                    <li>Enter the 6-digit code below</li>
                                </ol>
                            </div>
                        )}

                        {isVerificationMode && (
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Open your existing authenticator app and
                                    enter the current code below
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Code Input Section - Always shown */}
                <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="verification-code"
                            className="text-sm font-medium"
                        >
                            Authenticator Code
                        </Label>
                        <Input
                            id="verification-code"
                            type="text"
                            placeholder="000000"
                            value={verificationCode}
                            onChange={(e) => {
                                const value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6);
                                setVerificationCode(value);
                                setError("");
                            }}
                            className="text-center text-lg font-mono tracking-wider"
                            maxLength={6}
                            autoComplete="one-time-code"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={
                                isLoading || verificationCode.length !== 6
                            }
                        >
                            {isLoading
                                ? "Verifying..."
                                : isSetupMode
                                ? "Complete Setup"
                                : "Sign In"}
                        </Button>
                    </div>
                </form>

                {/* Helpful tips */}
                <div className="text-xs text-gray-500 text-center space-y-1">
                    <p>💡 The code changes every 30 seconds</p>
                    {isVerificationMode && (
                        <p>
                            🔒 Use the same authenticator app you set up
                            previously
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TOTPSetup;
