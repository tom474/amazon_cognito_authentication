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
import {
    Package,
    Search,
    Eye,
    Truck,
    CheckCircle,
    AlertCircle,
    Clock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Sample order data (in a real app, this would come from an API)
const sampleOrders = [
    {
        id: "ORD-001",
        customerEmail: "john@example.com",
        customerName: "John Doe",
        items: [
            { name: "iPhone 14 Pro", quantity: 1, price: 999 },
            { name: "AirPods Pro", quantity: 1, price: 249 },
        ],
        total: 1248,
        status: "delivered" as const,
        createdAt: "2024-01-15",
        deliveredAt: "2024-01-18",
    },
    {
        id: "ORD-002",
        customerEmail: "jane@example.com",
        customerName: "Jane Smith",
        items: [
            { name: "iPad Air", quantity: 1, price: 599 },
            { name: "Apple Pencil", quantity: 1, price: 129 },
        ],
        total: 728,
        status: "shipping" as const,
        createdAt: "2024-01-18",
        shippedAt: "2024-01-19",
    },
    {
        id: "ORD-003",
        customerEmail: "bob@example.com",
        customerName: "Bob Wilson",
        items: [{ name: 'MacBook Pro 14"', quantity: 1, price: 1999 }],
        total: 1999,
        status: "processing" as const,
        createdAt: "2024-01-20",
    },
    {
        id: "ORD-004",
        customerEmail: "alice@example.com",
        customerName: "Alice Johnson",
        items: [{ name: "iPhone 15", quantity: 2, price: 799 }],
        total: 1598,
        status: "pending" as const,
        createdAt: "2024-01-21",
    },
];

export default function AdminOrdersPage() {
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
                                Access Denied
                            </h2>
                            <p className="text-gray-600 mb-6">
                                You need admin privileges to manage orders.
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

    const handleViewOrder = (orderId: string) => {
        toast.success(`View order ${orderId} - Feature coming soon!`);
    };

    const handleUpdateStatus = (orderId: string, status: string) => {
        toast.success(
            `Update order ${orderId} to ${status} - Feature coming soon!`
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "delivered":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Delivered
                    </Badge>
                );
            case "shipping":
                return (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Shipping
                    </Badge>
                );
            case "processing":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Processing
                    </Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        Pending
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "delivered":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "shipping":
                return <Truck className="h-4 w-4 text-blue-600" />;
            case "processing":
                return <AlertCircle className="h-4 w-4 text-yellow-600" />;
            case "pending":
                return <Clock className="h-4 w-4 text-gray-600" />;
            default:
                return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    const totalRevenue = sampleOrders.reduce(
        (sum, order) => sum + order.total,
        0
    );
    const deliveredOrders = sampleOrders.filter(
        (order) => order.status === "delivered"
    ).length;
    const pendingOrders = sampleOrders.filter(
        (order) => order.status === "pending"
    ).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Order Management
                    </h1>
                    <p className="text-lg text-gray-600">
                        Track and manage customer orders
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {sampleOrders.length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Orders
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                ${totalRevenue.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Revenue
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {deliveredOrders}
                            </div>
                            <div className="text-sm text-gray-600">
                                Delivered
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {pendingOrders}
                            </div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Label htmlFor="search">Search Orders</Label>
                                <div className="relative mt-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search by order ID, customer name, or email..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    All Orders
                                </Button>
                                <Button variant="outline" size="sm">
                                    Pending
                                </Button>
                                <Button variant="outline" size="sm">
                                    Processing
                                </Button>
                                <Button variant="outline" size="sm">
                                    Shipping
                                </Button>
                                <Button variant="outline" size="sm">
                                    Delivered
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>
                            Manage customer orders and track their status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {sampleOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        {/* Order Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">
                                                    {order.id}
                                                </h3>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(
                                                        order.status
                                                    )}
                                                    {getStatusBadge(
                                                        order.status
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-2">
                                                <strong>Customer:</strong>{" "}
                                                {order.customerName} (
                                                {order.customerEmail})
                                            </div>
                                            <div className="text-sm text-gray-600 mb-3">
                                                <strong>Order Date:</strong>{" "}
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                                {order.deliveredAt && (
                                                    <span className="ml-4">
                                                        <strong>
                                                            Delivered:
                                                        </strong>{" "}
                                                        {new Date(
                                                            order.deliveredAt
                                                        ).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {order.shippedAt &&
                                                    !order.deliveredAt && (
                                                        <span className="ml-4">
                                                            <strong>
                                                                Shipped:
                                                            </strong>{" "}
                                                            {new Date(
                                                                order.shippedAt
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {order.items.map(
                                                    (item, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {item.quantity}x{" "}
                                                            {item.name}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* Order Total and Actions */}
                                        <div className="flex flex-col lg:items-end gap-4">
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-green-600">
                                                    $
                                                    {order.total.toLocaleString()}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {order.items.length} item
                                                    {order.items.length > 1
                                                        ? "s"
                                                        : ""}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleViewOrder(
                                                            order.id
                                                        )
                                                    }
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View Details
                                                </Button>

                                                {order.status === "pending" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                order.id,
                                                                "processing"
                                                            )
                                                        }
                                                    >
                                                        Process Order
                                                    </Button>
                                                )}

                                                {order.status ===
                                                    "processing" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                order.id,
                                                                "shipping"
                                                            )
                                                        }
                                                    >
                                                        Mark as Shipping
                                                    </Button>
                                                )}

                                                {order.status ===
                                                    "shipping" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                order.id,
                                                                "delivered"
                                                            )
                                                        }
                                                    >
                                                        Mark as Delivered
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
