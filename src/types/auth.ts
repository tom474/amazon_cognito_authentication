export type UserRole = "public" | "user" | "admin";

export interface User {
    id: string;
    email: string;
    username: string;
    name?: string; // Full name or given_name + family_name
    givenName?: string; // First name
    familyName?: string; // Last name
    phoneNumber?: string; // Phone number
    role: UserRole;
    isEmailVerified: boolean;
    mfaEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: "phones" | "tablets" | "laptops";
    image: string;
    stock: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    createdAt: string;
    updatedAt: string;
}

// Permissions for different user roles
export const PERMISSIONS = {
    public: {
        canViewProducts: true,
        canViewProductDetails: true,
        canAddToCart: false,
        canPurchase: false,
        canViewOrders: false,
        canManageProfile: false,
        canManageProducts: false,
        canManageUsers: false,
        canViewAnalytics: false,
    },
    user: {
        canViewProducts: true,
        canViewProductDetails: true,
        canAddToCart: true,
        canPurchase: true,
        canViewOrders: true,
        canManageProfile: true,
        canManageProducts: false,
        canManageUsers: false,
        canViewAnalytics: false,
    },
    admin: {
        canViewProducts: true,
        canViewProductDetails: true,
        canAddToCart: true,
        canPurchase: true,
        canViewOrders: true,
        canManageProfile: true,
        canManageProducts: true,
        canManageUsers: true,
        canViewAnalytics: true,
    },
} as const;

export const hasPermission = (
    userRole: UserRole,
    permission: keyof typeof PERMISSIONS.public
): boolean => {
    return PERMISSIONS[userRole][permission];
};
