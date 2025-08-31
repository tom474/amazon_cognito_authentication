"use client";

import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield, Calendar, Settings } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card className="text-center p-8">
                        <CardContent>
                            <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Sign In Required
                            </h2>
                            <p className="text-gray-600 mb-6">
                                You need to sign in to view your profile.
                            </p>
                            <Button asChild>
                                <Link href="/auth/signin">Sign In</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const handleSaveProfile = () => {
        toast.success("Profile update feature coming soon!");
    };

    const handleChangePassword = () => {
        toast.success("Password change feature coming soon!");
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "admin":
                return "destructive";
            case "user":
                return "default";
            default:
                return "secondary";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        My Profile
                    </h1>
                    <p className="text-lg text-gray-600">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Summary */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="h-10 w-10 text-blue-600" />
                                </div>
                                <CardTitle>{user.username}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                                <Badge
                                    variant={getRoleBadgeVariant(user.role)}
                                    className="mt-2"
                                >
                                    {user.role.charAt(0).toUpperCase() +
                                        user.role.slice(1)}{" "}
                                    Access
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span
                                        className={
                                            user.isEmailVerified
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }
                                    >
                                        {user.isEmailVerified
                                            ? "Email Verified"
                                            : "Email Not Verified"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield className="h-4 w-4 text-gray-500" />
                                    <span
                                        className={
                                            user.mfaEnabled
                                                ? "text-green-600"
                                                : "text-gray-600"
                                        }
                                    >
                                        {user.mfaEnabled
                                            ? "MFA Enabled"
                                            : "MFA Disabled"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">
                                        Member since 2024
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>
                                    Update your personal details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">
                                            Username
                                        </Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            defaultValue={user.username}
                                            readOnly
                                            className="bg-gray-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            defaultValue={user.email}
                                            readOnly
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <Button onClick={handleSaveProfile}>
                                    Save Changes
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Account Security */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Account Security
                                </CardTitle>
                                <CardDescription>
                                    Manage your account security settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">
                                            Password
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Change your account password
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={handleChangePassword}
                                    >
                                        Change Password
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">
                                            Multi-Factor Authentication
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Add an extra layer of security to
                                            your account
                                        </p>
                                    </div>
                                    <Button
                                        variant={
                                            user.mfaEnabled
                                                ? "outline"
                                                : "default"
                                        }
                                        onClick={() =>
                                            toast.success(
                                                "MFA setup coming soon!"
                                            )
                                        }
                                    >
                                        {user.mfaEnabled
                                            ? "Disable MFA"
                                            : "Enable MFA"}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">
                                            Email Verification
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {user.isEmailVerified
                                                ? "Your email address is verified"
                                                : "Verify your email address"}
                                        </p>
                                    </div>
                                    {!user.isEmailVerified && (
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                toast.success(
                                                    "Verification email sent!"
                                                )
                                            }
                                        >
                                            Resend Verification
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Role Permissions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Permissions</CardTitle>
                                <CardDescription>
                                    Your current role and access level
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span>Role</span>
                                        <Badge
                                            variant={getRoleBadgeVariant(
                                                user.role
                                            )}
                                        >
                                            {user.role.charAt(0).toUpperCase() +
                                                user.role.slice(1)}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium">
                                            Permissions:
                                        </h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            {user.role === "admin" && (
                                                <>
                                                    <div>
                                                        ✅ Full administrative
                                                        access
                                                    </div>
                                                    <div>
                                                        ✅ Manage products and
                                                        users
                                                    </div>
                                                    <div>
                                                        ✅ View analytics and
                                                        reports
                                                    </div>
                                                    <div>
                                                        ✅ All user permissions
                                                    </div>
                                                </>
                                            )}
                                            {user.role === "user" && (
                                                <>
                                                    <div>
                                                        ✅ Browse and purchase
                                                        products
                                                    </div>
                                                    <div>
                                                        ✅ Manage shopping cart
                                                    </div>
                                                    <div>
                                                        ✅ View order history
                                                    </div>
                                                    <div>
                                                        ✅ Update profile
                                                        settings
                                                    </div>
                                                </>
                                            )}
                                            {user.role === "public" && (
                                                <>
                                                    <div>
                                                        ✅ Browse products
                                                    </div>
                                                    <div>
                                                        ❌ Purchase products
                                                    </div>
                                                    <div>
                                                        ❌ Shopping cart access
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
