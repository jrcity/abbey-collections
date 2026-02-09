import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Sparkles } from 'lucide-react';
import { MobileButton } from '@/components/ui/CustomUI';

const slides = [
    {
        id: 1,
        title: "Elegance Redefined",
        subtitle: "Luxury Fashion & Custom Designs",
        image: "/hero-fashion.png",
        cta: "Explore Fashion",
        icon: <Star className="text-pink-400" size={20} />
    },
    {
        id: 2,
        title: "Radiant Beauty",
        subtitle: "Premium Cosmetics & Jewelry",
        image: "/hero-cosmetics.png",
        cta: "Shop Beauty",
        icon: <Sparkles className="text-rose-300" size={20} />
    },
    {
        id: 3,
        title: "Pure Vitality",
        subtitle: "Advanced Skincare Solutions",
        image: "/hero-skincare.png",
        cta: "View Skincare",
        icon: <Sparkles className="text-pink-300" size={20} />
    },
    {
        id: 4,
        title: "Signature Style",
        subtitle: "Exquisite Accessories & Bags",
        image: "/hero-accessories.png",
        cta: "Discover More",
        icon: <Star className="text-pink-400" size={20} />
    },
    {
        id: 5,
        title: "Bespoke Tailoring",
        subtitle: "Exclusive Custom Dressmaking",
        image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=2000",
        cta: "Start Design",
        icon: <Sparkles className="text-rose-300" size={20} />
    },
    {
        id: 6,
        title: "Essential Glow",
        subtitle: "Herbal Skincare Mastery",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=2000",
        cta: "Shop Skincare",
        icon: <Star className="text-pink-400" size={20} />
    },
    {
        id: 7,
        title: "Elite Collections",
        subtitle: "Curated Masterpieces for You",
        image: "https://images.unsplash.com/photo-1560243563-062bff001d68?auto=format&fit=crop&q=80&w=2000",
        cta: "Explore All",
        icon: <Sparkles className="text-rose-300" size={20} />
    }
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[current];

    return (
        <div className="relative h-[80vh] w-full overflow-hidden mb-12 rounded-b-[4rem] shadow-2xl -mt-20">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.img
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 10, ease: "linear" }}
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-20">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20"
                        >
                            {slide.icon}
                            <span className="text-white text-xs font-black uppercase tracking-[0.2em]">
                                {slide.subtitle}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl"
                        >
                            {slide.title}
                        </motion.h1>

                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            <MobileButton className="px-8 py-5 text-lg">
                                <ShoppingBag size={24} />
                                {slide.cta}
                            </MobileButton>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`transition-all duration-300 rounded-full 
                            ${current === idx ? "w-8 h-2 bg-pink-500" : "w-2 h-2 bg-white/40"}`}
                    />
                ))}
            </div>
        </div>
    );
}
