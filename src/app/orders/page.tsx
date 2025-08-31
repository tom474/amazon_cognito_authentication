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
import { Package, Truck, CheckCircle, Clock, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { hasPermission } from "@/types/auth";

// Sample order data (in a real app, this would come from an API)
const sampleOrders = [
    {
        id: "ORD-001",
        date: "2024-01-15",
        status: "delivered" as const,
        total: 1199,
        items: [{ name: "iPhone 15 Pro Max", quantity: 1, price: 1199 }],
    },
    {
        id: "ORD-002",
        date: "2024-01-10",
        status: "shipped" as const,
        total: 1099,
        items: [{ name: 'iPad Pro 12.9" M4', quantity: 1, price: 1099 }],
    },
    {
        id: "ORD-003",
        date: "2024-01-05",
        status: "pending" as const,
        total: 3499,
        items: [{ name: 'MacBook Pro 16" M3 Max', quantity: 1, price: 3499 }],
    },
];

export default function OrdersPage() {
    const { user } = useAuth();

    const userRole = user?.role || "public";

    if (!hasPermission(userRole, "canViewOrders")) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card className="text-center p-8">
                        <CardContent>
                            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Sign In Required
                            </h2>
                            <p className="text-gray-600 mb-6">
                                You need to sign in to view your orders.
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "delivered":
                return (
                    <Badge className="bg-green-100 text-green-800">
                        Delivered
                    </Badge>
                );
            case "shipped":
                return (
                    <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        Pending
                    </Badge>
                );
            case "cancelled":
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "delivered":
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case "shipped":
                return <Truck className="h-5 w-5 text-blue-600" />;
            case "pending":
                return <Clock className="h-5 w-5 text-yellow-600" />;
            default:
                return <Package className="h-5 w-5 text-gray-600" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        My Orders
                    </h1>
                    <p className="text-lg text-gray-600">
                        Track and manage your purchase history
                    </p>
                </div>

                {sampleOrders.length === 0 ? (
                    <Card className="text-center p-12">
                        <CardContent>
                            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                No orders yet
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Start shopping to see your orders here
                            </p>
                            <Button asChild>
                                <Link href="/products">Start Shopping</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {sampleOrders.map((order) => (
                            <Card key={order.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {getStatusIcon(order.status)}
                                                Order #{order.id}
                                            </CardTitle>
                                            <CardDescription>
                                                Placed on{" "}
                                                {new Date(
                                                    order.date
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </CardDescription>
                                        </div>
                                        <div className="text-right">
                                            {getStatusBadge(order.status)}
                                            <div className="text-lg font-bold text-blue-600 mt-1">
                                                ${order.total.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {order.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between py-2 border-t first:border-t-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Package className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            Quantity:{" "}
                                                            {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">
                                                        $
                                                        {item.price.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 mt-6 pt-4 border-t">
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                        {order.status === "delivered" && (
                                            <Button variant="outline" size="sm">
                                                Reorder
                                            </Button>
                                        )}
                                        {order.status === "shipped" && (
                                            <Button variant="outline" size="sm">
                                                Track Package
                                            </Button>
                                        )}
                                        {order.status === "pending" && (
                                            <Button variant="outline" size="sm">
                                                Cancel Order
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Order Summary Stats */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Order Statistics</CardTitle>
                        <CardDescription>Your shopping summary</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {sampleOrders.length}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Orders
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    $
                                    {sampleOrders
                                        .reduce(
                                            (sum, order) => sum + order.total,
                                            0
                                        )
                                        .toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Spent
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {
                                        sampleOrders.filter(
                                            (order) =>
                                                order.status === "delivered"
                                        ).length
                                    }
                                </div>
                                <div className="text-sm text-gray-600">
                                    Delivered
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
