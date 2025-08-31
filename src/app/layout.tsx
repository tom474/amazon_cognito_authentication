import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";
import "@/lib/amplify";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "TechStore - Premium Technology Products",
    description:
        "Your one-stop shop for the latest smartphones, tablets, and laptops from top brands.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} antialiased`}>
                <AuthProvider>
                    <CartProvider>
                        {children}
                        <Toaster />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
