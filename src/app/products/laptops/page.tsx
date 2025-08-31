"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getProductsByCategory, searchProducts } from "@/data/products";
import { Product } from "@/types/auth";
import { hasPermission } from "@/types/auth";
import { ShoppingCart, Star, Search, Laptop } from "lucide-react";
import { toast } from "sonner";

export default function LaptopsPage() {
    const { user } = useAuth();
    const { addItem } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const userRole = user?.role || "public";

    useEffect(() => {
        const laptopProducts = getProductsByCategory("laptops");
        setProducts(laptopProducts);
        setFilteredProducts(laptopProducts);
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = searchProducts(searchQuery).filter(
                (product) => product.category === "laptops"
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [products, searchQuery]);

    const handleAddToCart = (product: Product) => {
        if (!hasPermission(userRole, "canAddToCart")) {
            toast.error("Please sign in to add items to cart");
            return;
        }
        addItem(product);
        toast.success(`${product.name} added to cart`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Laptop className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Laptops
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600">
                        High-performance laptops for professionals and
                        enthusiasts
                    </p>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search laptops..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <Card
                            key={product.id}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardHeader className="p-0">
                                <div className="aspect-square relative bg-gray-100 rounded-t-lg">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <div className="text-center">
                                            <div className="text-6xl mb-2">
                                                💻
                                            </div>
                                            <div className="text-sm">
                                                Product Image
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline">Laptop</Badge>
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm text-gray-600">
                                            4.5
                                        </span>
                                    </div>
                                </div>
                                <CardTitle className="text-lg mb-2">
                                    {product.name}
                                </CardTitle>
                                <CardDescription className="text-sm mb-4">
                                    {product.description}
                                </CardDescription>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-blue-600">
                                        ${product.price.toLocaleString()}
                                    </span>
                                    <Badge
                                        variant={
                                            product.stock > 10
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {product.stock} in stock
                                    </Badge>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 pt-0 flex gap-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Link href={`/products/${product.id}`}>
                                        View Details
                                    </Link>
                                </Button>
                                {hasPermission(userRole, "canAddToCart") && (
                                    <Button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1"
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Add to Cart
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <Laptop className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No laptops found
                        </h3>
                        <p className="text-gray-600">
                            Try adjusting your search criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
