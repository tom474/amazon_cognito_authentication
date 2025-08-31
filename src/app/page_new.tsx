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
import { getProductsByCategory } from "@/data/products";
import { Product } from "@/types/auth";
import { hasPermission } from "@/types/auth";
import { ShoppingCart, Star, Truck, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
    const { user } = useAuth();
    const { addItem } = useCart();
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

    const userRole = user?.role || "public";

    useEffect(() => {
        // Get some featured products from each category
        const phones = getProductsByCategory("phones").slice(0, 2);
        const tablets = getProductsByCategory("tablets").slice(0, 1);
        const laptops = getProductsByCategory("laptops").slice(0, 2);
        setFeaturedProducts([...phones, ...tablets, ...laptops]);
    }, []);

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

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Premium Tech Products
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Discover the latest smartphones, tablets, and
                            laptops from top brands
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                asChild
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-gray-100"
                            >
                                <Link href="/products">Shop Now</Link>
                            </Button>
                            {!user && (
                                <Button
                                    asChild
                                    size="lg"
                                    className="border-2 border-white !text-white !bg-transparent hover:!bg-white hover:!text-blue-600 hover:border-white"
                                >
                                    <Link href="/auth/signup">
                                        Create Account
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Free Shipping
                            </h3>
                            <p className="text-gray-600">
                                Free shipping on orders over $500
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Secure Payment
                            </h3>
                            <p className="text-gray-600">
                                Your payment information is protected
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <RefreshCw className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                30-Day Returns
                            </h3>
                            <p className="text-gray-600">
                                Easy returns within 30 days
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* User Role Indicator */}
            {user && (
                <section className="py-8 bg-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h2 className="text-lg font-semibold mb-2">
                                Welcome back, {user.username}!
                            </h2>
                            <div className="flex items-center space-x-4">
                                <Badge
                                    variant={
                                        user.role === "admin"
                                            ? "destructive"
                                            : user.role === "user"
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {user.role.charAt(0).toUpperCase() +
                                        user.role.slice(1)}{" "}
                                    Access
                                </Badge>
                                <div className="text-sm text-gray-600">
                                    {user.role === "admin" &&
                                        "You have full administrative access"}
                                    {user.role === "user" &&
                                        "You can browse and purchase products"}
                                    {user.role === "public" &&
                                        "Sign up for a better shopping experience"}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Featured Products
                        </h2>
                        <p className="text-lg text-gray-600">
                            Handpicked selection of our best-selling items
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProducts.map((product) => (
                            <Card
                                key={product.id}
                                className="hover:shadow-lg transition-shadow"
                            >
                                <CardHeader className="p-0">
                                    <div className="aspect-square relative bg-gray-100 rounded-t-lg">
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            <div className="text-center">
                                                <div className="text-4xl mb-2">
                                                    📱
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
                                    <CardTitle className="text-lg mb-2">
                                        {product.name}
                                    </CardTitle>
                                    <CardDescription className="text-sm mb-4 line-clamp-2">
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
                                                    : "destructive"
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
                                    {hasPermission(
                                        userRole,
                                        "canAddToCart"
                                    ) && (
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

                    <div className="text-center mt-12">
                        <Button asChild size="lg">
                            <Link href="/products">View All Products</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Shop by Category
                        </h2>
                        <p className="text-lg text-gray-600">
                            Find exactly what you&apos;re looking for
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                category: "phones",
                                title: "Smartphones",
                                icon: "📱",
                                description: "Latest phones from top brands",
                            },
                            {
                                category: "tablets",
                                title: "Tablets",
                                icon: "📲",
                                description:
                                    "Powerful tablets for work and play",
                            },
                            {
                                category: "laptops",
                                title: "Laptops",
                                icon: "💻",
                                description: "High-performance laptops",
                            },
                        ].map((item) => (
                            <Link
                                key={item.category}
                                href={`/products/${item.category}`}
                            >
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                    <CardContent className="p-8 text-center">
                                        <div className="text-6xl mb-4">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {item.description}
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Shop {item.title}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                TechStore
                            </h3>
                            <p className="text-gray-400">
                                Your trusted partner for premium technology
                                products.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-medium mb-4">
                                Products
                            </h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link
                                        href="/products/phones"
                                        className="hover:text-white"
                                    >
                                        Smartphones
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/products/tablets"
                                        className="hover:text-white"
                                    >
                                        Tablets
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/products/laptops"
                                        className="hover:text-white"
                                    >
                                        Laptops
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-medium mb-4">
                                Support
                            </h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link href="#" className="hover:text-white">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white">
                                        Shipping Info
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white">
                                        Returns
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-medium mb-4">
                                Account
                            </h4>
                            <ul className="space-y-2 text-gray-400">
                                {user ? (
                                    <>
                                        <li>
                                            <Link
                                                href="/profile"
                                                className="hover:text-white"
                                            >
                                                My Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/orders"
                                                className="hover:text-white"
                                            >
                                                My Orders
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link
                                                href="/auth/signin"
                                                className="hover:text-white"
                                            >
                                                Sign In
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/auth/signup"
                                                className="hover:text-white"
                                            >
                                                Sign Up
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 TechStore. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
