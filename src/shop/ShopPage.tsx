import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/configs/firebase';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import SeoHead from '@/components/seo/SeoHead';
import { ProductSkeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filter, setFilter] = useState<Category | 'All'>('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const items: Product[] = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() } as Product);
            });
            setProducts(items);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const filteredProducts = filter === 'All'
        ? products
        : products.filter(p => p.category === filter);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SeoHead
                title="Shop Online"
                description="Browse our collection of custom designs, skincare, and accessories."
            />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white py-20 text-center mb-12 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
                <div className="relative z-10 px-4">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">Abbey Collections</h1>
                    <p className="text-pink-100 text-xl font-light max-w-2xl mx-auto">Luxury Sewing Designs • Premium Cosmetics • Essential Accessories</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Filters */}
                <div className="flex justify-center mb-16 overflow-x-auto pb-4 no-scrollbar">
                    <div className="flex bg-white p-1.5 rounded-[2.5rem] shadow-sm border border-gray-100 gap-1">
                        {['All', 'Fashion & Design', 'Cosmetics & Jewelry', 'Pack Accessories', 'Skin Care'].map((cat) => (
                            <motion.button
                                key={cat}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilter(cat as any)}
                                className={`px-6 py-3 rounded-[2rem] text-sm font-black transition-all duration-300 whitespace-nowrap
                                    ${filter === cat
                                        ? 'bg-pink-600 text-white shadow-lg shadow-pink-100'
                                        : 'bg-transparent text-gray-400 hover:text-pink-600'}`}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}