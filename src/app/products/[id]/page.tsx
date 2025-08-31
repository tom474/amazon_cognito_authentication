"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProductById } from "@/data/products";
import { Product } from "@/types/auth";
import { hasPermission } from "@/types/auth";
import {
    ShoppingCart,
    Star,
    ArrowLeft,
    Heart,
    Share2,
    Truck,
    Shield,
    RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
    const params = useParams();
    const { user } = useAuth();
    const { addItem } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const userRole = user?.role || "public";
    const productId = params.id as string;

    useEffect(() => {
        const foundProduct = getProductById(productId);
        setProduct(foundProduct || null);
        setLoading(false);
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) return;

        if (!hasPermission(userRole, "canAddToCart")) {
            toast.error("Please sign in to add items to cart");
            return;
        }

        addItem(product, quantity);
        toast.success(`${quantity}x ${product.name} added to cart`);
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="aspect-square bg-gray-200 rounded-lg"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-20 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Product Not Found
                        </h1>
                        <p className="text-gray-600 mb-8">
                            The product you&apos;re looking for doesn&apos;t
                            exist.
                        </p>
                        <Button asChild>
                            <Link href="/products">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Products
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                    <Link href="/" className="hover:text-blue-600">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-blue-600">
                        Products
                    </Link>
                    <span>/</span>
                    <Link
                        href={`/products/${product.category}`}
                        className="hover:text-blue-600 capitalize"
                    >
                        {product.category}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-lg shadow-sm border">
                            <div className="h-full flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <div className="text-8xl mb-4">
                                        {product.category === "phones" && "📱"}
                                        {product.category === "tablets" && "📲"}
                                        {product.category === "laptops" && "💻"}
                                    </div>
                                    <div className="text-lg">Product Image</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="capitalize">
                                    {product.category}
                                </Badge>
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${
                                                star <= 4
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-2">
                                        (4.5) • 128 reviews
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl font-bold text-blue-600">
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
                        </div>

                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-700">
                                {product.description}
                            </p>
                        </div>

                        {/* Quantity and Add to Cart */}
                        {hasPermission(userRole, "canAddToCart") &&
                            product.stock > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm font-medium text-gray-700">
                                            Quantity:
                                        </label>
                                        <div className="flex items-center border rounded-md">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        quantity - 1
                                                    )
                                                }
                                                disabled={quantity <= 1}
                                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-2 border-x">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        quantity + 1
                                                    )
                                                }
                                                disabled={
                                                    quantity >= product.stock
                                                }
                                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button
                                            onClick={handleAddToCart}
                                            size="lg"
                                            className="flex-1"
                                        >
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            Add to Cart
                                        </Button>
                                        <Button variant="outline" size="lg">
                                            <Heart className="h-5 w-5" />
                                        </Button>
                                        <Button variant="outline" size="lg">
                                            <Share2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                        {!hasPermission(userRole, "canAddToCart") && (
                            <Card className="p-6 bg-blue-50 border-blue-200">
                                <p className="text-blue-800 text-center">
                                    <Link
                                        href="/auth/signin"
                                        className="font-medium underline"
                                    >
                                        Sign in
                                    </Link>{" "}
                                    to add items to your cart
                                </p>
                            </Card>
                        )}

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                            <div className="text-center">
                                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Truck className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    Free Shipping
                                </div>
                                <div className="text-xs text-gray-600">
                                    On orders over $500
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Shield className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    1 Year Warranty
                                </div>
                                <div className="text-xs text-gray-600">
                                    Full manufacturer warranty
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <RefreshCw className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    30-Day Returns
                                </div>
                                <div className="text-xs text-gray-600">
                                    Easy returns policy
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to Products */}
                <div className="mt-12 pt-8 border-t">
                    <Button asChild variant="outline">
                        <Link href="/products">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Products
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
