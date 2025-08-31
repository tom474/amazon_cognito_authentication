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
import { hasPermission } from "@/types/auth";
import { Users, Search, Edit, Trash2, UserPlus, Shield } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Sample user data (in a real app, this would come from an API)
const sampleUsers = [
    {
        id: "1",
        username: "john_doe",
        email: "john@example.com",
        role: "user" as const,
        isEmailVerified: true,
        createdAt: "2024-01-01",
        lastLogin: "2024-01-20",
    },
    {
        id: "2",
        username: "jane_smith",
        email: "jane@example.com",
        role: "user" as const,
        isEmailVerified: true,
        createdAt: "2024-01-05",
        lastLogin: "2024-01-19",
    },
    {
        id: "3",
        username: "admin_user",
        email: "admin@techstore.com",
        role: "admin" as const,
        isEmailVerified: true,
        createdAt: "2023-12-01",
        lastLogin: "2024-01-21",
    },
];

export default function AdminUsersPage() {
    const { user } = useAuth();
    const userRole = user?.role || "public";

    if (!hasPermission(userRole, "canManageUsers")) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card className="text-center p-8">
                        <CardContent>
                            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Access Denied
                            </h2>
                            <p className="text-gray-600 mb-6">
                                You need admin privileges to manage users.
                            </p>
                            <Button asChild>
                                <Link href="/">Go Home</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const handleEditUser = (userId: string) => {
        toast.success(`Edit user ${userId} - Feature coming soon!`);
    };

    const handleDeleteUser = (userId: string) => {
        toast.success(`Delete user ${userId} - Feature coming soon!`);
    };

    const handleAddUser = () => {
        toast.success("Add new user - Feature coming soon!");
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                User Management
                            </h1>
                            <p className="text-lg text-gray-600">
                                Manage user accounts and permissions
                            </p>
                        </div>
                        <Button
                            onClick={handleAddUser}
                            className="flex items-center gap-2"
                        >
                            <UserPlus className="h-4 w-4" />
                            Add User
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Label htmlFor="search">Search Users</Label>
                                <div className="relative mt-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search by username or email..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    All Users
                                </Button>
                                <Button variant="outline" size="sm">
                                    Admins
                                </Button>
                                <Button variant="outline" size="sm">
                                    Regular Users
                                </Button>
                                <Button variant="outline" size="sm">
                                    Unverified
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users ({sampleUsers.length})</CardTitle>
                        <CardDescription>
                            Manage user accounts and permissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3">User</th>
                                        <th className="text-left p-3">Email</th>
                                        <th className="text-left p-3">Role</th>
                                        <th className="text-left p-3">
                                            Status
                                        </th>
                                        <th className="text-left p-3">
                                            Created
                                        </th>
                                        <th className="text-left p-3">
                                            Last Login
                                        </th>
                                        <th className="text-left p-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleUsers.map((userData) => (
                                        <tr
                                            key={userData.id}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-medium text-blue-600">
                                                            {userData.username
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {userData.username}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            ID: {userData.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="text-sm">
                                                    {userData.email}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant={getRoleBadgeVariant(
                                                            userData.role
                                                        )}
                                                    >
                                                        {userData.role
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            userData.role.slice(
                                                                1
                                                            )}
                                                    </Badge>
                                                    {userData.role ===
                                                        "admin" && (
                                                        <Shield className="h-4 w-4 text-red-600" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    variant={
                                                        userData.isEmailVerified
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {userData.isEmailVerified
                                                        ? "Verified"
                                                        : "Unverified"}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-sm text-gray-600">
                                                {new Date(
                                                    userData.createdAt
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 text-sm text-gray-600">
                                                {new Date(
                                                    userData.lastLogin
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditUser(
                                                                userData.id
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    {userData.id !==
                                                        user?.id && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDeleteUser(
                                                                    userData.id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {sampleUsers.length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Users
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {
                                    sampleUsers.filter(
                                        (u) => u.role === "admin"
                                    ).length
                                }
                            </div>
                            <div className="text-sm text-gray-600">Admins</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {
                                    sampleUsers.filter((u) => u.role === "user")
                                        .length
                                }
                            </div>
                            <div className="text-sm text-gray-600">
                                Regular Users
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {
                                    sampleUsers.filter((u) => u.isEmailVerified)
                                        .length
                                }
                            </div>
                            <div className="text-sm text-gray-600">
                                Verified
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
