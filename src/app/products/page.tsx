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
import { getAllActiveProducts, searchProducts } from "@/data/products";
import { Product } from "@/types/auth";
import { hasPermission } from "@/types/auth";
import { ShoppingCart, Star, Search, Filter } from "lucide-react";
import { toast } from "sonner";

export default function ProductsPage() {
    const { user } = useAuth();
    const { addItem } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<
        "all" | "phones" | "tablets" | "laptops"
    >("all");

    const userRole = user?.role || "public";

    useEffect(() => {
        const allProducts = getAllActiveProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
    }, []);

    useEffect(() => {
        let filtered = products;

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (product) => product.category === selectedCategory
            );
        }

        // Filter by search query
        if (searchQuery) {
            filtered = searchProducts(searchQuery).filter(
                (product) =>
                    selectedCategory === "all" ||
                    product.category === selectedCategory
            );
        }

        setFilteredProducts(filtered);
    }, [products, selectedCategory, searchQuery]);

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        All Products
                    </h1>
                    <p className="text-lg text-gray-600">
                        Discover our complete collection of premium technology
                        products
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2">
                            <Button
                                variant={
                                    selectedCategory === "all"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setSelectedCategory("all")}
                                size="sm"
                            >
                                All Products
                            </Button>
                            <Button
                                variant={
                                    selectedCategory === "phones"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setSelectedCategory("phones")}
                                size="sm"
                            >
                                Phones
                            </Button>
                            <Button
                                variant={
                                    selectedCategory === "tablets"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setSelectedCategory("tablets")}
                                size="sm"
                            >
                                Tablets
                            </Button>
                            <Button
                                variant={
                                    selectedCategory === "laptops"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setSelectedCategory("laptops")}
                                size="sm"
                            >
                                Laptops
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <Card
                            key={product.id}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardHeader className="p-0">
                                <div className="aspect-square relative bg-gray-100 rounded-t-lg">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">
                                                {product.category ===
                                                    "phones" && "📱"}
                                                {product.category ===
                                                    "tablets" && "📲"}
                                                {product.category ===
                                                    "laptops" && "💻"}
                                            </div>
                                            <div className="text-sm">
                                                Product Image
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge
                                        variant="outline"
                                        className="capitalize"
                                    >
                                        {product.category}
                                    </Badge>
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm text-gray-600">
                                            4.5
                                        </span>
                                    </div>
                                </div>
                                <CardTitle className="text-lg mb-2 line-clamp-2">
                                    {product.name}
                                </CardTitle>
                                <CardDescription className="text-sm mb-4 line-clamp-3">
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
                                                : product.stock > 0
                                                ? "secondary"
                                                : "destructive"
                                        }
                                    >
                                        {product.stock > 0
                                            ? `${product.stock} in stock`
                                            : "Out of stock"}
                                    </Badge>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex gap-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Link href={`/products/${product.id}`}>
                                        View Details
                                    </Link>
                                </Button>
                                {hasPermission(userRole, "canAddToCart") &&
                                    product.stock > 0 && (
                                        <Button
                                            onClick={() =>
                                                handleAddToCart(product)
                                            }
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

                {/* No Products Found */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <Filter className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-600">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
