export type Category = 'Fashion & Design' | 'Cosmetics & Jewelry' | 'Pack Accessories' | 'Skin Care';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: Category;
    description: string;
    imageUrl: string;
    inStock: boolean;
    createdAt: number;
    salesCount?: number; // For analytics
}

export interface Inquiry {
    id: string;
    items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        imageUrl: string;
    }[];
    totalPrice: number;
    status: 'pending' | 'sold' | 'cancelled';
    createdAt: number;
}

export interface UserUser {
    uid: string;
    email: string | null;
    displayName: string | null;
}