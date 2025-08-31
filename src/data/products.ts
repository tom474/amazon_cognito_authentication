import { Product } from "@/types/auth";

export const sampleProducts: Product[] = [
    // Phones
    {
        id: "phone-1",
        name: "iPhone 15 Pro Max",
        description:
            "The most advanced iPhone with titanium design, A17 Pro chip, and pro camera system.",
        price: 1199,
        category: "phones",
        image: "/images/iphone-15-pro-max.jpg",
        stock: 25,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "phone-2",
        name: "Samsung Galaxy S24 Ultra",
        description:
            "Premium Android phone with S Pen, 200MP camera, and AI-powered features.",
        price: 1299,
        category: "phones",
        image: "/images/galaxy-s24-ultra.jpg",
        stock: 30,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "phone-3",
        name: "Google Pixel 8 Pro",
        description:
            "Pure Android experience with exceptional AI photography and Magic Eraser.",
        price: 999,
        category: "phones",
        image: "/images/pixel-8-pro.jpg",
        stock: 20,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },

    // Tablets
    {
        id: "tablet-1",
        name: 'iPad Pro 12.9" M4',
        description:
            "Ultimate iPad with M4 chip, stunning Liquid Retina XDR display, and Apple Pencil support.",
        price: 1099,
        category: "tablets",
        image: "/images/ipad-pro-12.jpg",
        stock: 15,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "tablet-2",
        name: "iPad Air M2",
        description:
            "Powerful and versatile iPad with M2 chip, perfect for creativity and productivity.",
        price: 599,
        category: "tablets",
        image: "/images/ipad-air.jpg",
        stock: 22,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "tablet-3",
        name: "Samsung Galaxy Tab S9 Ultra",
        description:
            'Premium Android tablet with S Pen, 14.6" display, and desktop-class performance.',
        price: 1199,
        category: "tablets",
        image: "/images/galaxy-tab-s9.jpg",
        stock: 18,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },

    // Laptops
    {
        id: "laptop-1",
        name: 'MacBook Pro 16" M3 Max',
        description:
            "Most powerful MacBook Pro with M3 Max chip, up to 128GB unified memory, and all-day battery.",
        price: 3499,
        category: "laptops",
        image: "/images/macbook-pro-16.jpg",
        stock: 12,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "laptop-2",
        name: "MacBook Air M3",
        description:
            "Incredibly thin and light laptop with M3 chip, up to 18 hours of battery life.",
        price: 1099,
        category: "laptops",
        image: "/images/macbook-air-m3.jpg",
        stock: 28,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "laptop-3",
        name: "Dell XPS 13 Plus",
        description:
            "Premium Windows laptop with InfinityEdge display and exceptional build quality.",
        price: 1299,
        category: "laptops",
        image: "/images/dell-xps-13.jpg",
        stock: 16,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "laptop-4",
        name: "ThinkPad X1 Carbon",
        description:
            "Business-grade laptop with enterprise security, carbon fiber construction, and legendary keyboard.",
        price: 1599,
        category: "laptops",
        image: "/images/thinkpad-x1.jpg",
        stock: 14,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
];

export const getProductById = (id: string): Product | undefined => {
    return sampleProducts.find((product) => product.id === id);
};

export const getProductsByCategory = (
    category: Product["category"]
): Product[] => {
    return sampleProducts.filter(
        (product) => product.category === category && product.isActive
    );
};

export const getAllActiveProducts = (): Product[] => {
    return sampleProducts.filter((product) => product.isActive);
};

export const searchProducts = (query: string): Product[] => {
    const lowercaseQuery = query.toLowerCase();
    return sampleProducts.filter(
        (product) =>
            product.isActive &&
            (product.name.toLowerCase().includes(lowercaseQuery) ||
                product.description.toLowerCase().includes(lowercaseQuery))
    );
};
