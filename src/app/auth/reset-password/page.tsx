"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
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
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
    const [step, setStep] = useState<"request" | "confirm">("request");
    const [formData, setFormData] = useState({
        email: "",
        code: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { resetPassword, confirmResetPassword } = useAuth();
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(formData.email);
            toast.success("Reset code sent to your email");
            setStep("confirm");
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to send reset code"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const validateNewPassword = () => {
        if (
            !formData.code ||
            !formData.newPassword ||
            !formData.confirmPassword
        ) {
            toast.error("All fields are required");
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        if (formData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return false;
        }

        // Check password complexity
        const hasUpperCase = /[A-Z]/.test(formData.newPassword);
        const hasLowerCase = /[a-z]/.test(formData.newPassword);
        const hasNumbers = /\d/.test(formData.newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(
            formData.newPassword
        );

        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            toast.error(
                "Password must contain uppercase, lowercase, number, and special character"
            );
            return false;
        }

        return true;
    };

    const handleConfirmReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateNewPassword()) return;

        setIsLoading(true);
        try {
            await confirmResetPassword(
                formData.email,
                formData.code,
                formData.newPassword
            );
            toast.success(
                "Password reset successful! You can now sign in with your new password."
            );
            router.push("/auth/signin");
        } catch (error) {
            console.error("Confirm reset password error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to reset password"
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (step === "confirm") {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold">
                                Reset Your Password
                            </CardTitle>
                            <CardDescription>
                                Enter the code sent to {formData.email} and your
                                new password
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleConfirmReset}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Reset Code</Label>
                                    <Input
                                        id="code"
                                        name="code"
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        maxLength={6}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter new password"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword
                                                )
                                            }
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Password must contain uppercase,
                                        lowercase, number, and special character
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        Confirm New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Confirm new password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword ? (
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
                                    {isLoading
                                        ? "Resetting Password..."
                                        : "Reset Password"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setStep("request")}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                                <div className="text-center text-sm text-gray-600">
                                    Remember your password?{" "}
                                    <Link
                                        href="/auth/signin"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
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
                            Forgot Password?
                        </CardTitle>
                        <CardDescription>
                            Enter your email address and we&apos;ll send you a
                            reset code
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleRequestReset}>
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
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4 pt-6">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? "Sending Reset Code..."
                                    : "Send Reset Code"}
                            </Button>
                            <div className="text-center text-sm text-gray-600">
                                Remember your password?{" "}
                                <Link
                                    href="/auth/signin"
                                    className="text-blue-600 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
