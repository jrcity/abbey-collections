import { useState } from 'react';
import { Product } from '@/types';
import { MessageCircle, ShoppingBag, Maximize2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { motion } from 'framer-motion';
import { MobileButton } from '@/components/ui/CustomUI';
import ProductModal from '@/components/ProductModal';

import { db } from '@/configs/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { showAlert } = useUI();
    const [showModal, setShowModal] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
        showAlert(`${product.name} added to your selection!`, 'success');
    };

    const handleWhatsAppInquiry = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            // 1. Save Inquiry to Firestore
            await addDoc(collection(db, "inquiries"), {
                items: [{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    imageUrl: product.imageUrl
                }],
                totalPrice: product.price,
                status: 'pending',
                createdAt: Date.now()
            });

            // 2. Open WhatsApp
            const phone = "+2347018370807"; // REPLACE WITH ABBEY'S NUMBER
            const message = `Hello Abbey, I'm interested in "${product.name}" (₦${product.price.toLocaleString()}). Is it still available?`;
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        } catch (error) {
            console.error("Inquiry recording failed", error);
            showAlert("Failed to connect to our server. Opening WhatsApp anyway...", "error");

            // Still open WhatsApp as fallback
            const phone = "+2347018370807";
            const message = `Hello Abbey, I'm interested in "${product.name}" (₦${product.price.toLocaleString()}). Is it still available?`;
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        }
    };

    const isNew = product.createdAt && (Date.now() - product.createdAt < 72 * 60 * 60 * 1000); // 72 hours

    return (
        <>
            <motion.div
                whileHover={{ y: -10 }}
                onClick={() => setShowModal(true)}
                className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full cursor-pointer"
            >
                {/* Image Container */}
                <div className="relative h-72 w-full overflow-hidden bg-gray-50">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileHover={{ scale: 1.1 }}
                            className="bg-white/80 backdrop-blur-md p-4 rounded-full text-pink-600 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                            <Maximize2 size={24} />
                        </motion.div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 pointer-events-none">
                        <div className="flex justify-between items-start w-full">
                            <div className="flex flex-col gap-2">
                                <span className="bg-white/90 backdrop-blur-md text-pink-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm w-fit border border-pink-100/50">
                                    {product.category}
                                </span>
                                {isNew && (
                                    <motion.span
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg w-fit flex items-center gap-1"
                                    >
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                        New Collection
                                    </motion.span>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 items-end">
                                {!product.inStock && (
                                    <span className="bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                        Sold Out
                                    </span>
                                )}
                                {product.images && product.images.length > 1 && (
                                    <span className="bg-pink-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border border-white/20">
                                        {product.images.length} Images
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors duration-300 line-clamp-1">
                            {product.name}
                        </h3>
                        <p className="text-2xl font-black text-gray-900">
                            ₦{product.price.toLocaleString()}
                        </p>
                    </div>

                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
                        {product.description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <MobileButton
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className="w-full"
                        >
                            <ShoppingBag size={20} />
                            Add to Cart
                        </MobileButton>

                        <MobileButton
                            variant="secondary"
                            onClick={handleWhatsAppInquiry}
                            className="w-full"
                        >
                            <MessageCircle size={20} />
                            Inquiry
                        </MobileButton>
                    </div>
                </div>
            </motion.div>

            <ProductModal
                product={product}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
}