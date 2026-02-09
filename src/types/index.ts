export type Category = 'Fashion & Design' | 'Cosmetics & Jewelry' | 'Pack Accessories' | 'Skin Care';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: Category;
    description: string;
    imageUrl: string;
    inStock: boolean;
    createdAt: number; // Timestamp for sorting
}

export interface UserUser {
    uid: string;
    email: string | null;
    displayName: string | null;
}