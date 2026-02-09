import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { totalItems } = useCart();

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-xl z-50 border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/abbeyc.png"
                            alt="Abbey Collections Logo"
                            className="h-12 w-auto object-contain"
                        />
                        <div className="flex flex-col -gap-1">
                            <span className="text-xl font-black text-pink-600 group-hover:text-pink-700 transition-colors leading-none">Abbey</span>
                            <span className="text-xl font-light text-gray-800 leading-none">Collections</span>
                        </div>
                    </Link>

                    {/* Links */}
                    <div className="flex space-x-8 items-center">
                        <Link to="/" className="text-gray-600 hover:text-pink-600 font-semibold transition-colors">Shop</Link>
                        <Link to="/cart" className="text-gray-600 hover:text-pink-600 transition-all relative p-2 bg-gray-50 rounded-xl hover:bg-pink-50">
                            <ShoppingBag size={24} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-pink-200 animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}