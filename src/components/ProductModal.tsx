import { useState } from 'react';
import { Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { MobileButton } from '@/components/ui/CustomUI';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { db } from '@/configs/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface ProductModalProps {
    product: Partial<Product>;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const { addToCart } = useCart();
    const { showAlert } = useUI();
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const images = product.images && product.images.length > 0
        ? product.images
        : (product.imageUrl ? [product.imageUrl] : []);

    const handleAddToCart = () => {
        if (product.id) {
            addToCart(product as Product);
            showAlert(`${product.name} added to your selection!`, 'success');
        }
    };

    const handleWhatsAppInquiry = async () => {
        if (!product.id) return;

        try {
            // 1. Save Inquiry to Firestore
            await addDoc(collection(db, "inquiries"), {
                items: [{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    imageUrl: product.imageUrl || (product.images && product.images[0]) || ''
                }],
                totalPrice: product.price || 0,
                status: 'pending',
                createdAt: Date.now()
            });

            // 2. Open WhatsApp
            const phone = "+2347018370807";
            const message = `Hello Abbey, I'm interested in "${product.name}" (₦${product.price?.toLocaleString()}). Is it still available?`;
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        } catch (error) {
            console.error("Inquiry recording failed", error);
            showAlert("Failed to record inquiry. Redirecting to WhatsApp anyway...", "error");
            // Still open WhatsApp as fallback
            const phone = "+2347018370807";
            const message = `Hello Abbey, I'm interested in "${product.name}" (₦${product.price?.toLocaleString()}). Is it still available?`;
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        }
    };

    const nextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-900 shadow-lg hover:bg-white transition-all"
                    >
                        <X size={24} />
                    </button>

                    {/* Image Section */}
                    <div className="w-full md:w-1/2 bg-gray-50 relative flex flex-col">
                        <div className="relative flex-grow min-h-[300px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImageIndex}
                                    src={images[activeImageIndex]}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="w-full h-full object-cover"
                                    alt={product.name}
                                />
                            </AnimatePresence>

                            {/* Gallery Navigation */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="p-4 flex gap-3 overflow-x-auto no-scrollbar bg-white/50 backdrop-blur-sm border-t border-gray-100">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-4 transition-all
                                            ${activeImageIndex === idx ? 'border-pink-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto no-scrollbar">
                        <div className="mb-2">
                            <span className="inline-block px-4 py-1.5 bg-pink-50 text-pink-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                                {product.category}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">
                                {product.name}
                            </h2>
                            <p className="text-3xl font-black text-pink-600">
                                ₦{product.price?.toLocaleString()}
                            </p>
                        </div>

                        <div className="my-8 flex-grow">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">Description</h4>
                            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </div>

                        {/* Status */}
                        {!product.inStock && (
                            <div className="mb-8 p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 font-bold">
                                <X size={20} />
                                This item is currently Sold Out
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <MobileButton
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className="flex-1 py-5 text-xl"
                            >
                                <ShoppingBag size={24} />
                                Add to Cart
                            </MobileButton>
                            <MobileButton
                                variant="secondary"
                                onClick={handleWhatsAppInquiry}
                                className="flex-1 py-5 text-xl"
                            >
                                <MessageCircle size={24} />
                                Chat with Abbey
                            </MobileButton>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
