import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { Trash2, MessageCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { db } from '@/configs/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '@/components/seo/SeoHead';
import { MobileButton } from '@/components/ui/CustomUI';

export default function CartPage() {
    const { cart, removeFromCart, totalPrice, clearCart } = useCart();
    const { showAlert, showConfirm } = useUI();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            // 1. Save Inquiry to Firestore
            await addDoc(collection(db, "inquiries"), {
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    imageUrl: item.imageUrl
                })),
                totalPrice,
                status: 'pending',
                createdAt: Date.now()
            });

            // 2. Format and Open WhatsApp
            const phone = "+2347018370807"; // ABBEY'S NUMBER
            let message = "Hello Abbey, I'd like to place an order from your website:\n\n";

            cart.forEach(item => {
                message += `• ${item.quantity}x ${item.name} (₦${(item.price * item.quantity).toLocaleString()})\n`;
            });

            message += `\n*Total: ₦${totalPrice.toLocaleString()}*\n\nPlease let me know how to proceed with payment.`;

            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');

            // 3. Clear Cart
            clearCart();
            showAlert("Order sent! Your cart has been cleared.", "success");
        } catch (error) {
            console.error("Inquiry recording failed", error);
            showAlert("Failed to connect to our server. Please try again.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <SeoHead title="Your Cart | Abbey Collections" description="View and manage your shopping cart" />
                <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-sm border border-gray-100">
                    <div className="mb-6 inline-flex p-6 bg-pink-50 rounded-full text-pink-500">
                        <ShoppingBag size={64} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Cart is Empty</h2>
                    <p className="text-gray-500 mb-8">Your collections await you. Let's find something beautiful!</p>
                    <Link to="/" className="w-full">
                        <MobileButton className="w-full text-lg">
                            <ArrowLeft size={20} />
                            Back to Shop
                        </MobileButton>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 pb-24">
            <SeoHead title="Your Cart | Abbey Collections" description="Review your items and checkout via WhatsApp" />

            <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl font-black text-gray-900">Your Selection</h1>
                <button
                    onClick={() => showConfirm("Remove all items from your selection?", clearCart)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm font-semibold flex items-center gap-1"
                >
                    <Trash2 size={16} />
                    Clear All
                </button>
            </div>

            <div className="space-y-4 mb-12">
                {cart.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 group">
                        <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{item.name}</h3>
                            <p className="text-pink-600 font-black">₦{item.price.toLocaleString()}</p>
                            <p className="text-gray-400 text-xs mt-1">Qty: {item.quantity}</p>
                        </div>
                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100 sticky bottom-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Grand Total</p>
                        <p className="text-4xl font-black text-gray-900">₦{totalPrice.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400 text-sm">Including delivery</p>
                        <p className="text-pink-600 text-xs font-bold">Checkout via WhatsApp</p>
                    </div>
                </div>

                <MobileButton
                    variant="success"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full text-xl py-5"
                >
                    {isProcessing ? (
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <MessageCircle size={28} strokeWidth={2.5} />
                            Complete Order on WhatsApp
                        </>
                    )}
                </MobileButton>
                <p className="text-center mt-6 text-gray-400 text-sm italic font-medium">
                    This will structured your order and open Abbey's WhatsApp chat.
                </p>
            </div>
        </div>
    );
}
