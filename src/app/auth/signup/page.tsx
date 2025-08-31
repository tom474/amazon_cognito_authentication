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
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    const { signUp, confirmSignUp, resendConfirmationCode } = useAuth();
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (
            !formData.email ||
            !formData.username ||
            !formData.phone ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            toast.error("All fields are required");
            return false;
        }

        // Validate phone number format (must start with +)
        if (!formData.phone.startsWith("+")) {
            toast.error(
                "Phone number must include country code (e.g., +1234567890)"
            );
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return false;
        }

        // Check password complexity
        const hasUpperCase = /[A-Z]/.test(formData.password);
        const hasLowerCase = /[a-z]/.test(formData.password);
        const hasNumbers = /\d/.test(formData.password);
        const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(
            formData.password
        );

        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            toast.error(
                "Password must contain uppercase, lowercase, number, and special character"
            );
            return false;
        }

        return true;
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await signUp(
                formData.email,
                formData.password,
                formData.username,
                formData.phone
            );
            setNeedsVerification(true);
            toast.success(
                "Account created! Please check your email for verification code."
            );
        } catch (error) {
            console.error("Sign up error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create account"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!verificationCode) {
            toast.error("Please enter verification code");
            return;
        }

        setIsLoading(true);
        try {
            await confirmSignUp(formData.email, verificationCode);
            toast.success("Email verified successfully! You can now sign in.");
            router.push("/auth/signin");
        } catch (error) {
            console.error("Verification error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to verify email"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            await resendConfirmationCode(formData.email);
            toast.success("Verification code sent to your email");
        } catch (error) {
            console.error("Resend error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to resend verification code"
            );
        }
    };

    if (needsVerification) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold">
                                Verify Your Email
                            </CardTitle>
                            <CardDescription>
                                We sent a verification code to {formData.email}
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleVerification}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="verificationCode">
                                        Verification Code
                                    </Label>
                                    <Input
                                        id="verificationCode"
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={verificationCode}
                                        onChange={(e) =>
                                            setVerificationCode(e.target.value)
                                        }
                                        maxLength={6}
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
                                        ? "Verifying..."
                                        : "Verify Email"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleResendCode}
                                >
                                    Resend Code
                                </Button>
                                <div className="text-center text-sm text-gray-600">
                                    <Link
                                        href="/auth/signin"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Already have an account? Sign in
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
                            Create Account
                        </CardTitle>
                        <CardDescription>
                            Sign up for a new TechStore account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSignUp}>
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
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Your username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+1234567890"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Include country code (e.g., +1 for US)
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Create a strong password"
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
                                <div className="text-xs text-gray-500">
                                    Password must contain uppercase, lowercase,
                                    number, and special character
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm Password
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
                                        placeholder="Confirm your password"
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
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </Button>
                            <div className="text-center text-sm text-gray-600">
                                Already have an account?{" "}
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
