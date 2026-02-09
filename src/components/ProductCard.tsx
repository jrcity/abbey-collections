import { Product } from '@/types';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { MobileButton } from '@/components/ui/CustomUI';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleWhatsAppInquiry = () => {
        const phone = "2348000000000"; // REPLACE WITH ABBEY'S NUMBER
        const message = `Hello Abbey, I'm interested in "${product.name}" (₦${product.price.toLocaleString()}). Is it still available?`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative h-72 w-full overflow-hidden bg-gray-50">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-pink-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                        {product.category}
                    </span>
                    {!product.inStock && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                            Sold Out
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors duration-300">
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
                        onClick={() => addToCart(product)}
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
    );
}