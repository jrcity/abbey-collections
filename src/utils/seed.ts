import { v4 as uuidv4 } from 'uuid';
import { Product } from '../types';
import { db } from '../configs/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const initialProducts: Product[] = [
    // --- COSMETICS / SKINCARE ---
    {
        id: uuidv4(),
        name: "Turmeric & Honey Brightening Soap",
        price: 4500,
        category: "Cosmetics & Jewelry", // Fixed to match app categories
        description: "Handmade herbal soap infused with organic turmeric and raw honey to clear dark spots and give a natural glow.",
        imageUrl: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80",
        inStock: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    {
        id: uuidv4(),
        name: "Egyptian Glow Body Oil",
        price: 12000,
        category: "Skin Care", // Fixed to match app categories
        description: "A luxurious blend of essential oils that locks in moisture and gives your skin a radiant, golden shine without being greasy.",
        imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=600&q=80",
        inStock: true,
        createdAt: Date.now() - 100000,
        updatedAt: Date.now()
    },
    {
        id: uuidv4(),
        name: "Coffee Exfoliating Scrub",
        price: 7500,
        category: "Skin Care",
        description: "Deep cleansing scrub to remove dead skin cells and reveal smoother, softer skin. Perfect for use before moisturizing.",
        imageUrl: "https://images.unsplash.com/photo-1567721913486-6585f069b332?auto=format&fit=crop&w=600&q=80",
        inStock: true,
        createdAt: Date.now() - 200000,
        updatedAt: Date.now()
    },

    // --- FASHION / SEWING ---
    {
        id: uuidv4(),
        name: "Classic Ankara Shift Dress",
        price: 18000,
        category: "Fashion & Design",
        description: "A free-size, comfortable Ankara dress with pockets. Perfect for casual Fridays or weekend outings. Available in mixed prints.",
        imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
        inStock: true,
        createdAt: Date.now() - 300000,
        updatedAt: Date.now()
    },
    {
        id: uuidv4(),
        name: "Custom Lace Aso-Ebi (Deposit)",
        price: 50000,
        category: "Fashion & Design",
        description: "Booking deposit for custom Aso-Ebi sewing. Includes corset fitting and intricate stone embellishments. Final price depends on design.",
        imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
        inStock: true,
        createdAt: Date.now() - 400000,
        updatedAt: Date.now()
    },
    {
        id: uuidv4(),
        name: "Adire Silk Bubu Gown",
        price: 35000,
        category: "Fashion & Design",
        description: "Elegant and flowing silk Adire gown. One size fits all. Rich, vibrant colors that do not fade.",
        imageUrl: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=600&q=80",
        inStock: true,
        createdAt: Date.now() - 500000,
        updatedAt: Date.now()
    },

    // --- ACCESSORIES ---
    {
        id: uuidv4(),
        name: "Luxury Rose Gold Wristwatch",
        price: 22000,
        category: "Pack Accessories",
        description: "Water-resistant stainless steel watch for ladies. Comes in a gift box. Perfect for corporate or casual wear.",
        imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
        inStock: true,
        createdAt: Date.now() - 600000,
        updatedAt: Date.now()
    },
    {
        id: uuidv4(),
        name: "Zirconia Knuckle Ring Set",
        price: 4500,
        category: "Pack Accessories",
        description: "A set of 5 stackable fashion rings. Gold plated and non-tarnish if kept dry.",
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
        inStock: false,
        createdAt: Date.now() - 700000,
        updatedAt: Date.now()
    },
    {
        id: uuidv4(),
        name: "Men's Leather Wallet & Belt Combo",
        price: 15000,
        category: "Pack Accessories",
        description: "Genuine leather belt and wallet set. A perfect gift package for him.",
        imageUrl: "https://images.unsplash.com/photo-1627123424574-18bd7517768e?auto=format&fit=crop&w=600&q=80",
        inStock: true,
        createdAt: Date.now() - 800000,
        updatedAt: Date.now()
    }
];

export const seedDatabase = async () => {
    try {
        const productsCol = collection(db, 'products');

        // Clear existing products first (Optional - commented out for safety)
        /*
        const snapshot = await getDocs(productsCol);
        for (const docSnap of snapshot.docs) {
            await deleteDoc(doc(db, 'products', docSnap.id));
        }
        */

        for (const product of initialProducts) {
            const { id, ...data } = product; // Remove id to let Firestore generate its own if preferred, or keep as requested
            await addDoc(productsCol, { ...data, createdAt: Date.now(), updatedAt: Date.now() });
        }

        return { success: true, count: initialProducts.length };
    } catch (error) {
        console.error("Seeding failed: ", error);
        throw error;
    }
};
