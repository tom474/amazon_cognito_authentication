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
import { hasPermission } from "@/types/auth";
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    Users,
    Package,
    ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Sample analytics data (in a real app, this would come from an API)
const analyticsData = {
    revenue: {
        total: 45680,
        growth: 12.5,
        thisMonth: 8940,
        lastMonth: 7950,
    },
    orders: {
        total: 342,
        growth: 8.2,
        thisMonth: 67,
        lastMonth: 62,
    },
    users: {
        total: 1245,
        growth: 15.8,
        thisMonth: 89,
        lastMonth: 77,
    },
    products: {
        total: 156,
        inStock: 142,
        lowStock: 8,
        outOfStock: 6,
    },
};

const recentActivities = [
    {
        type: "sale",
        message: "New order #ORD-001 placed by John Doe",
        time: "2 minutes ago",
        amount: 1248,
    },
    {
        type: "user",
        message: "New user registration: jane@example.com",
        time: "15 minutes ago",
    },
    {
        type: "product",
        message: 'Product "iPhone 14 Pro" stock updated',
        time: "1 hour ago",
    },
    {
        type: "sale",
        message: "Order #ORD-002 shipped to Alice Johnson",
        time: "2 hours ago",
        amount: 799,
    },
    {
        type: "user",
        message: "User profile updated: bob@example.com",
        time: "3 hours ago",
    },
];

const topProducts = [
    { name: "iPhone 15 Pro", sales: 45, revenue: 44955 },
    { name: 'MacBook Pro 14"', sales: 23, revenue: 45977 },
    { name: "iPad Air", sales: 34, revenue: 20366 },
    { name: "AirPods Pro", sales: 67, revenue: 16683 },
];

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const userRole = user?.role || "public";

    if (!hasPermission(userRole, "canViewAnalytics")) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card className="text-center p-8">
                        <CardContent>
                            <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Access Denied
                            </h2>
                            <p className="text-gray-600 mb-6">
                                You need admin privileges to view analytics.
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

    const handleRefreshData = () => {
        toast.success("Analytics data refreshed!");
    };

    const handleExportReport = () => {
        toast.success("Exporting report - Feature coming soon!");
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
                                Admin Dashboard
                            </h1>
                            <p className="text-lg text-gray-600">
                                Overview of your e-commerce store performance
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleRefreshData}
                            >
                                Refresh Data
                            </Button>
                            <Button onClick={handleExportReport}>
                                Export Report
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Revenue */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Revenue
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        $
                                        {analyticsData.revenue.total.toLocaleString()}
                                    </p>
                                </div>
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                                <span className="text-sm text-green-600">
                                    +{analyticsData.revenue.growth}%
                                </span>
                                <span className="text-sm text-gray-600 ml-2">
                                    vs last month
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Orders
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {analyticsData.orders.total}
                                    </p>
                                </div>
                                <ShoppingCart className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                                <span className="text-sm text-green-600">
                                    +{analyticsData.orders.growth}%
                                </span>
                                <span className="text-sm text-gray-600 ml-2">
                                    vs last month
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Users
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {analyticsData.users.total}
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                                <span className="text-sm text-green-600">
                                    +{analyticsData.users.growth}%
                                </span>
                                <span className="text-sm text-gray-600 ml-2">
                                    vs last month
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Products
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {analyticsData.products.total}
                                    </p>
                                </div>
                                <Package className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="flex items-center mt-2">
                                <span className="text-sm text-green-600">
                                    {analyticsData.products.inStock} in stock
                                </span>
                                <span className="text-sm text-yellow-600 ml-2">
                                    {analyticsData.products.lowStock} low
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activities</CardTitle>
                            <CardDescription>
                                Latest activities in your store
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            {activity.type === "sale" && (
                                                <DollarSign className="h-4 w-4 text-green-600" />
                                            )}
                                            {activity.type === "user" && (
                                                <Users className="h-4 w-4 text-blue-600" />
                                            )}
                                            {activity.type === "product" && (
                                                <Package className="h-4 w-4 text-orange-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900">
                                                {activity.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs text-gray-500">
                                                    {activity.time}
                                                </p>
                                                {activity.amount && (
                                                    <p className="text-sm font-medium text-green-600">
                                                        +$
                                                        {activity.amount.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    size="sm"
                                >
                                    View All Activities
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Products</CardTitle>
                            <CardDescription>
                                Best performing products this month
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Package className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {product.sales} sales
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                $
                                                {product.revenue.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-green-600">
                                                Revenue
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    size="sm"
                                    asChild
                                >
                                    <Link href="/admin/products">
                                        Manage Products
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Button asChild className="h-20 flex-col">
                                <Link href="/admin/products">
                                    <Package className="h-6 w-6 mb-2" />
                                    Manage Products
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-20 flex-col"
                            >
                                <Link href="/admin/orders">
                                    <ShoppingCart className="h-6 w-6 mb-2" />
                                    View Orders
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-20 flex-col"
                            >
                                <Link href="/admin/users">
                                    <Users className="h-6 w-6 mb-2" />
                                    Manage Users
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-20 flex-col"
                                onClick={handleExportReport}
                            >
                                <BarChart3 className="h-6 w-6 mb-2" />
                                Generate Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
