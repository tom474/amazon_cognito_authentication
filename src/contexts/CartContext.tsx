"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product } from "@/types/auth";

interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
}

interface CartContextType extends CartState {
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateItemQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getItemQuantity: (productId: string) => number;
}

type CartAction =
    | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
    | { type: "REMOVE_ITEM"; payload: { productId: string } }
    | {
          type: "UPDATE_QUANTITY";
          payload: { productId: string; quantity: number };
      }
    | { type: "CLEAR_CART" }
    | { type: "LOAD_CART"; payload: CartItem[] };

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

const calculateTotals = (items: CartItem[]) => {
    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, itemCount };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
    let newItems: CartItem[] = [];

    switch (action.type) {
        case "ADD_ITEM":
            const existingItemIndex = state.items.findIndex(
                (item) => item.product.id === action.payload.product.id
            );

            if (existingItemIndex >= 0) {
                newItems = [...state.items];
                newItems[existingItemIndex].quantity += action.payload.quantity;
            } else {
                newItems = [
                    ...state.items,
                    {
                        product: action.payload.product,
                        quantity: action.payload.quantity,
                    },
                ];
            }
            break;

        case "REMOVE_ITEM":
            newItems = state.items.filter(
                (item) => item.product.id !== action.payload.productId
            );
            break;

        case "UPDATE_QUANTITY":
            if (action.payload.quantity <= 0) {
                newItems = state.items.filter(
                    (item) => item.product.id !== action.payload.productId
                );
            } else {
                newItems = state.items.map((item) =>
                    item.product.id === action.payload.productId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                );
            }
            break;

        case "CLEAR_CART":
            newItems = [];
            break;

        case "LOAD_CART":
            newItems = action.payload;
            break;

        default:
            return state;
    }

    const { total, itemCount } = calculateTotals(newItems);

    return {
        items: newItems,
        total,
        itemCount,
    };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        total: 0,
        itemCount: 0,
    });

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("techstore-cart");
        if (savedCart) {
            try {
                const cartItems = JSON.parse(savedCart);
                dispatch({ type: "LOAD_CART", payload: cartItems });
            } catch (error) {
                console.error("Error loading cart from localStorage:", error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("techstore-cart", JSON.stringify(state.items));
    }, [state.items]);

    const addItem = (product: Product, quantity: number = 1) => {
        dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
    };

    const removeItem = (productId: string) => {
        dispatch({ type: "REMOVE_ITEM", payload: { productId } });
    };

    const updateItemQuantity = (productId: string, quantity: number) => {
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" });
    };

    const getItemQuantity = (productId: string): number => {
        const item = state.items.find((item) => item.product.id === productId);
        return item ? item.quantity : 0;
    };

    return (
        <CartContext.Provider
            value={{
                ...state,
                addItem,
                removeItem,
                updateItemQuantity,
                clearCart,
                getItemQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
