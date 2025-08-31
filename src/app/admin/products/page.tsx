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
import { getAllActiveProducts } from "@/data/products";
import { hasPermission } from "@/types/auth";
import { Package, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminProductsPage() {
    const { user } = useAuth();
    const userRole = user?.role || "public";

    if (!hasPermission(userRole, "canManageProducts")) {
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
                                You need admin privileges to manage products.
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

    const products = getAllActiveProducts();

    const handleEditProduct = (productId: string) => {
        toast.success(`Edit product ${productId} - Feature coming soon!`);
    };

    const handleDeleteProduct = (productId: string) => {
        toast.success(`Delete product ${productId} - Feature coming soon!`);
    };

    const handleAddProduct = () => {
        toast.success("Add new product - Feature coming soon!");
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
                                Product Management
                            </h1>
                            <p className="text-lg text-gray-600">
                                Manage your product catalog
                            </p>
                        </div>
                        <Button
                            onClick={handleAddProduct}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Label htmlFor="search">Search Products</Label>
                                <div className="relative mt-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search by name, category, or description..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    All Categories
                                </Button>
                                <Button variant="outline" size="sm">
                                    Phones
                                </Button>
                                <Button variant="outline" size="sm">
                                    Tablets
                                </Button>
                                <Button variant="outline" size="sm">
                                    Laptops
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Products ({products.length})</CardTitle>
                        <CardDescription>
                            Manage your product inventory and details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">
                                            Product
                                        </th>
                                        <th className="text-left p-2">
                                            Category
                                        </th>
                                        <th className="text-left p-2">Price</th>
                                        <th className="text-left p-2">Stock</th>
                                        <th className="text-left p-2">
                                            Status
                                        </th>
                                        <th className="text-left p-2">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="p-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        {product.category ===
                                                            "phones" && "📱"}
                                                        {product.category ===
                                                            "tablets" && "📲"}
                                                        {product.category ===
                                                            "laptops" && "💻"}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-xs text-gray-600 max-w-xs truncate">
                                                            {
                                                                product.description
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-2">
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize"
                                                >
                                                    {product.category}
                                                </Badge>
                                            </td>
                                            <td className="p-2 font-medium">
                                                $
                                                {product.price.toLocaleString()}
                                            </td>
                                            <td className="p-2">
                                                <Badge
                                                    variant={
                                                        product.stock > 10
                                                            ? "default"
                                                            : product.stock > 0
                                                            ? "secondary"
                                                            : "destructive"
                                                    }
                                                >
                                                    {product.stock}
                                                </Badge>
                                            </td>
                                            <td className="p-2">
                                                <Badge
                                                    variant={
                                                        product.isActive
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {product.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </td>
                                            <td className="p-2">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            window.open(
                                                                `/products/${product.id}`,
                                                                "_blank"
                                                            )
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditProduct(
                                                                product.id
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteProduct(
                                                                product.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
                                {products.length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Products
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {products.filter((p) => p.isActive).length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Active Products
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {products.filter((p) => p.stock < 10).length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Low Stock
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {products.reduce((sum, p) => sum + p.stock, 0)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Inventory
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
