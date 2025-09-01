"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Menu,
    ShoppingCart,
    User,
    LogOut,
    Settings,
    Package,
    Users,
    BarChart,
    Smartphone,
    Tablet,
    Laptop,
} from "lucide-react";
import { hasPermission } from "@/types/auth";

export default function Navigation() {
    const { user, isAuthenticated, signOutUser, isLoading } = useAuth();
    const { itemCount } = useCart();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted and handle auth state changes
    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render until mounted to prevent hydration issues
    if (!mounted) return null;

    // Show loading state while auth is being checked
    if (isLoading) {
        return (
            <nav className="border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
                    </div>
                </div>
            </nav>
        );
    }

    const userRole = user?.role || "public";

    const navigationItems = [
        { href: "/", label: "Home" },
        { href: "/products", label: "All Products" },
        { href: "/products/phones", label: "Phones", icon: Smartphone },
        { href: "/products/tablets", label: "Tablets", icon: Tablet },
        { href: "/products/laptops", label: "Laptops", icon: Laptop },
    ];

    const handleSignOut = async () => {
        try {
            await signOutUser();
            // Navigate to homepage after successful sign out
            router.push("/");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-blue-600 text-white p-2 rounded-lg">
                            <Package className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            TechStore
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        {hasPermission(userRole, "canAddToCart") && (
                            <Link href="/cart" className="relative">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="relative"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    {itemCount > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                                        >
                                            {itemCount > 99 ? "99+" : itemCount}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>
                        )}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-xs">
                                                {(
                                                    user?.name ||
                                                    user?.email ||
                                                    user?.username
                                                )
                                                    ?.charAt(0)
                                                    .toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="ml-2 hidden sm:block">
                                            {user?.name ||
                                                user?.email ||
                                                user?.username}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/profile"
                                            className="flex items-center"
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>

                                    {hasPermission(
                                        userRole,
                                        "canViewOrders"
                                    ) && (
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/orders"
                                                className="flex items-center"
                                            >
                                                <Package className="h-4 w-4 mr-2" />
                                                My Orders
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    {hasPermission(
                                        userRole,
                                        "canManageProducts"
                                    ) && (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href="/admin/products"
                                                    className="flex items-center"
                                                >
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    Manage Products
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href="/admin/users"
                                                    className="flex items-center"
                                                >
                                                    <Users className="h-4 w-4 mr-2" />
                                                    Manage Users
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href="/admin/analytics"
                                                    className="flex items-center"
                                                >
                                                    <BarChart className="h-4 w-4 mr-2" />
                                                    Analytics
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    <DropdownMenuItem
                                        onClick={handleSignOut}
                                        className="text-red-600"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/auth/signin">Sign In</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href="/auth/signup">Sign Up</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <Sheet
                            open={mobileMenuOpen}
                            onOpenChange={setMobileMenuOpen}
                        >
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="outline" size="sm">
                                    <Menu className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="w-[300px] sm:w-[400px]"
                            >
                                <nav className="flex flex-col space-y-4 mt-8">
                                    {navigationItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            <div className="flex items-center space-x-3">
                                                {item.icon && (
                                                    <item.icon className="h-5 w-5" />
                                                )}
                                                <span>{item.label}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Welcome Banner */}
            {isAuthenticated && user && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-2 flex items-center justify-center">
                            <span className="text-blue-800 font-medium text-sm">
                                Welcome back,{" "}
                                {user.name || user.email || "User"}! 👋
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
