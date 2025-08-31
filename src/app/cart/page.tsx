"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { hasPermission } from "@/types/auth";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function CartPage() {
    const { user } = useAuth();
    const {
        items,
        updateItemQuantity,
        removeItem,
        clearCart,
        total,
        itemCount,
    } = useCart();

    const userRole = user?.role || "public";

    if (!hasPermission(userRole, "canAddToCart")) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card className="text-center p-8">
                        <CardContent>
                            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Sign In Required
                            </h2>
                            <p className="text-gray-600 mb-6">
                                You need to sign in to view your shopping cart.
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

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(productId);
            toast.success("Item removed from cart");
        } else {
            updateItemQuantity(productId, newQuantity);
        }
    };

    const handleRemoveItem = (productId: string, productName: string) => {
        removeItem(productId);
        toast.success(`${productName} removed from cart`);
    };

    const handleClearCart = () => {
        clearCart();
        toast.success("Cart cleared");
    };

    const handleCheckout = () => {
        toast.success("Checkout feature coming soon!");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Shopping Cart
                    </h1>
                    <div className="flex items-center justify-between">
                        <p className="text-lg text-gray-600">
                            {itemCount === 0
                                ? "Your cart is empty"
                                : `${itemCount} item${
                                      itemCount > 1 ? "s" : ""
                                  } in your cart`}
                        </p>
                        {items.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={handleClearCart}
                                size="sm"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear Cart
                            </Button>
                        )}
                    </div>
                </div>

                {items.length === 0 ? (
                    <Card className="text-center p-12">
                        <CardContent>
                            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Your cart is empty
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Start shopping to add items to your cart
                            </p>
                            <Button asChild>
                                <Link href="/products">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Continue Shopping
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <Card key={item.product.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            {/* Product Image */}
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <div className="text-2xl">
                                                    {item.product.category ===
                                                        "phones" && "📱"}
                                                    {item.product.category ===
                                                        "tablets" && "📲"}
                                                    {item.product.category ===
                                                        "laptops" && "💻"}
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {item.product.name}
                                                        </h3>
                                                        <Badge
                                                            variant="outline"
                                                            className="capitalize mt-1"
                                                        >
                                                            {
                                                                item.product
                                                                    .category
                                                            }
                                                        </Badge>
                                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                            {
                                                                item.product
                                                                    .description
                                                            }
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRemoveItem(
                                                                item.product.id,
                                                                item.product
                                                                    .name
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.product
                                                                        .id,
                                                                    item.quantity -
                                                                        1
                                                                )
                                                            }
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.product
                                                                        .id,
                                                                    item.quantity +
                                                                        1
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity >=
                                                                item.product
                                                                    .stock
                                                            }
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-blue-600">
                                                            $
                                                            {(
                                                                item.product
                                                                    .price *
                                                                item.quantity
                                                            ).toLocaleString()}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            $
                                                            {item.product.price.toLocaleString()}{" "}
                                                            each
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>
                                            Subtotal ({itemCount} items)
                                        </span>
                                        <span>${total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">
                                            {total >= 500 ? "Free" : "$29"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>
                                            ${(total * 0.08).toFixed(2)}
                                        </span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-blue-600">
                                            $
                                            {(
                                                total +
                                                (total >= 500 ? 0 : 29) +
                                                total * 0.08
                                            ).toFixed(2)}
                                        </span>
                                    </div>

                                    {total < 500 && (
                                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                            Add ${(500 - total).toFixed(2)} more
                                            for free shipping!
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleCheckout}
                                        size="lg"
                                        className="w-full"
                                        disabled={itemCount === 0}
                                    >
                                        Proceed to Checkout
                                    </Button>

                                    <Button
                                        asChild
                                        variant="outline"
                                        size="lg"
                                        className="w-full"
                                    >
                                        <Link href="/products">
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Continue Shopping
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
