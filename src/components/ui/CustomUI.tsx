import React from 'react';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { ChevronDown, Upload } from 'lucide-react';

interface MobileInputProps extends Omit<HTMLMotionProps<'input'>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'> {
    label?: string;
}

export const MobileInput: React.FC<MobileInputProps> = ({ label, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-[11px] font-black uppercase tracking-tighter text-gray-400 mb-1.5 ml-2">{label}</label>}
            <motion.input
                whileFocus={{ scale: 1.01 }}
                {...(props as any)}
                className={`w-full bg-white border-2 border-gray-100 p-4 rounded-[1.5rem] text-gray-900 font-bold placeholder:text-gray-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-300 shadow-sm ${className}`}
            />
        </div>
    );
};

interface MobileTextAreaProps extends Omit<HTMLMotionProps<'textarea'>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'> {
    label?: string;
}

export const MobileTextArea: React.FC<MobileTextAreaProps> = ({ label, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-[11px] font-black uppercase tracking-tighter text-gray-400 mb-1.5 ml-2">{label}</label>}
            <motion.textarea
                whileFocus={{ scale: 1.01 }}
                {...(props as any)}
                className={`w-full bg-white border-2 border-gray-100 p-4 rounded-[1.5rem] text-gray-900 font-bold placeholder:text-gray-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all duration-300 shadow-sm resize-none ${className}`}
            />
        </div>
    );
};

interface MobileSelectProps extends Omit<HTMLMotionProps<'div'>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref' | 'onChange' | 'onSelect'> {
    label?: string;
    options: { value: string; label: string }[];
    value: string;
    onValueChange: (value: string) => void;
}

export const MobileSelect: React.FC<MobileSelectProps> = ({ label, options, value, onValueChange, className = '', ...props }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const selectedLabel = options.find(opt => opt.value === value)?.label || "Select option";

    return (
        <div className="w-full relative">
            {label && <label className="block text-[11px] font-black uppercase tracking-tighter text-gray-400 mb-1.5 ml-2">{label}</label>}

            {/* Trigger Container */}
            <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white border-2 ${isOpen ? 'border-pink-500 ring-4 ring-pink-100' : 'border-gray-100'} p-4 pr-12 rounded-[1.5rem] text-gray-900 font-bold shadow-sm cursor-pointer relative transition-all duration-300 ${className}`}
                {...props}
            >
                <span className={value ? "text-gray-900" : "text-gray-300"}>{selectedLabel}</span>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown size={20} strokeWidth={3} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </motion.div>

            {/* Premium Action Sheet / Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60]"
                        />

                        {/* Options List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-[70] p-2"
                        >
                            {options.map((opt) => (
                                <motion.div
                                    key={opt.value}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => {
                                        onValueChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`p-4 rounded-[1.2rem] font-bold transition-all cursor-pointer flex items-center justify-between
                                        ${opt.value === value
                                            ? 'bg-pink-600 text-white shadow-lg shadow-pink-100'
                                            : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'}`}
                                >
                                    {opt.label}
                                    {opt.value === value && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

interface MobileButtonProps extends Omit<HTMLMotionProps<'button'>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export const MobileButton: React.FC<MobileButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: "bg-pink-600 text-white shadow-pink-100 hover:bg-pink-700",
        secondary: "bg-white text-gray-900 border-2 border-gray-100 hover:bg-gray-50",
        danger: "bg-red-50 text-red-600 border-2 border-red-50 hover:bg-red-100",
        success: "bg-green-600 text-white shadow-green-100 hover:bg-green-700"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...(props as any)}
            className={`flex items-center justify-center gap-2 py-4 px-6 rounded-[1.5rem] font-black transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        >
            {children}
        </motion.button>
    );
};

interface MobileFileInputProps extends Omit<HTMLMotionProps<'div'>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref' | 'onChange'> {
    label?: string;
    onFileSelect: (file: File | null) => void;
    accept?: string;
    required?: boolean;
}

export const MobileFileInput: React.FC<MobileFileInputProps> = ({ label, onFileSelect, accept, required, className = '', ...props }) => {
    const [fileName, setFileName] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="w-full">
            {label && <label className="block text-[11px] font-black uppercase tracking-tighter text-gray-400 mb-1.5 ml-2">{label}</label>}
            <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full bg-white border-2 border-dashed border-gray-100 p-8 rounded-[2rem] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-pink-300 transition-all shadow-sm ${className}`}
                {...props}
            >
                <div className="p-4 bg-pink-50 rounded-2xl text-pink-500">
                    <Upload size={24} />
                </div>
                <div className="text-center">
                    <p className="font-black text-gray-900">{fileName || "Tap to upload image"}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">High resolution preferred</p>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept={accept}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFileName(file ? file.name : null);
                        onFileSelect(file);
                    }}
                />
            </motion.div>
        </div>
    );
};
