import React from 'react';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { ChevronDown, Upload, CheckCircle, AlertTriangle, AlertCircle, Info, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

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
                        if (onFileSelect) onFileSelect(file);
                    }}
                />
            </motion.div>
        </div>
    );
};

interface MobileMultiFileInputProps extends Omit<HTMLMotionProps<'div'>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref' | 'onChange'> {
    label?: string;
    onFilesSelect: (files: File[]) => void;
    currentImages?: string[];
    onRemoveCurrentImage?: (url: string) => void;
    accept?: string;
    maxFiles?: number;
}

export const MobileMultiFileInput: React.FC<MobileMultiFileInputProps> = ({
    label, onFilesSelect, currentImages = [], onRemoveCurrentImage, accept, maxFiles = 7
}) => {
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [previews, setPreviews] = React.useState<string[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const totalImages = currentImages.length + selectedFiles.length + files.length;
        if (totalImages > maxFiles) {
            alert(`You can only upload a maximum of ${maxFiles} images.`);
            return;
        }

        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);
        onFilesSelect(newFiles);

        // Generate previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);

        // Revoke the URL to avoid memory leaks
        URL.revokeObjectURL(previews[index]);

        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
        onFilesSelect(newFiles);
    };

    return (
        <div className="w-full">
            {label && <label className="block text-[11px] font-black uppercase tracking-tighter text-gray-400 mb-1.5 ml-2">{label}</label>}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {/* Existing Images (for editing) */}
                {currentImages.map((url, idx) => (
                    <div key={`curr-${idx}`} className="relative aspect-square rounded-[1.5rem] overflow-hidden border-2 border-gray-100 group">
                        <img src={url} className="w-full h-full object-cover" alt="" />
                        <button
                            type="button"
                            onClick={() => onRemoveCurrentImage?.(url)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-1 text-[8px] text-white text-center font-bold uppercase">Current</div>
                    </div>
                ))}

                {/* New Previews */}
                {previews.map((url, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-square rounded-[1.5rem] overflow-hidden border-2 border-pink-100 group">
                        <img src={url} className="w-full h-full object-cover" alt="" />
                        <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-pink-600/80 py-1 text-[8px] text-white text-center font-bold uppercase">New</div>
                    </div>
                ))}

                {/* Upload Button */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-pink-300 hover:bg-pink-50 transition-all"
                >
                    <div className="p-3 bg-pink-100 rounded-xl text-pink-600">
                        <Plus size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-400">Add More</span>
                </motion.div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                accept={accept}
                multiple
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};
interface MobileToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
}

export const MobileToggle: React.FC<MobileToggleProps> = ({ label, checked, onChange, className = '' }) => {
    return (
        <label className={`flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-[1.5rem] cursor-pointer transition-all ${checked ? 'border-pink-500 bg-pink-50/30' : ''} ${className}`}>
            <span className="font-bold text-gray-900">{label}</span>
            <motion.div
                animate={{ backgroundColor: checked ? '#db2777' : '#e5e7eb' }}
                onClick={() => onChange(!checked)}
                className="w-14 h-8 rounded-full p-1 relative flex items-center"
            >
                <motion.div
                    animate={{ x: checked ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                />
            </motion.div>
        </label>
    );
};

// --- Alert & Confirmation Components ---

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface MobileAlertProps {
    type: AlertType;
    message: string;
    onClose: () => void;
}

export const MobileAlert: React.FC<MobileAlertProps> = ({ type, message, onClose }) => {
    const configs = {
        success: { icon: CheckCircle, bg: 'bg-green-600', shadow: 'shadow-green-200' },
        error: { icon: AlertCircle, bg: 'bg-red-600', shadow: 'shadow-red-200' },
        warning: { icon: AlertTriangle, bg: 'bg-amber-500', shadow: 'shadow-amber-200' },
        info: { icon: Info, bg: 'bg-blue-600', shadow: 'shadow-blue-200' }
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            className={`fixed top-6 left-4 right-4 z-[100] flex items-center gap-4 ${config.bg} p-5 rounded-[2rem] shadow-2xl ${config.shadow} text-white`}
        >
            <div className="bg-white/20 p-2 rounded-xl">
                <Icon size={24} />
            </div>
            <p className="flex-grow font-black text-sm">{message}</p>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
            </button>
        </motion.div>
    );
};

interface MobileConfirmProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const MobileConfirm: React.FC<MobileConfirmProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-[110] flex items-end justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Confirmation Sheet */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-sm bg-white rounded-[3rem] p-8 pb-10 shadow-2xl overflow-hidden"
            >
                <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />

                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-pink-50 rounded-2xl text-pink-600 mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Are you sure?</h3>
                    <p className="text-gray-500 font-bold px-4">{message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <MobileButton variant="secondary" onClick={onCancel} className="text-lg">
                        Cancel
                    </MobileButton>
                    <MobileButton variant="danger" onClick={onConfirm} className="text-lg bg-red-600 text-white shadow-red-100">
                        Confirm
                    </MobileButton>
                </div>
            </motion.div>
        </div>
    );
};

interface MobilePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const MobilePagination: React.FC<MobilePaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
            <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={`p-4 rounded-2xl transition-all shadow-sm flex items-center justify-center
                    ${currentPage === 1
                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        : 'bg-white text-gray-900 hover:text-pink-600 border border-gray-100'}`}
            >
                <ChevronLeft size={20} />
            </motion.button>

            <div className="flex gap-1 overflow-x-auto no-scrollbar px-2 py-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <motion.button
                        key={page}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onPageChange(page)}
                        className={`min-w-[48px] h-[48px] rounded-2xl text-sm font-black transition-all
                            ${currentPage === page
                                ? 'bg-pink-600 text-white shadow-lg shadow-pink-100'
                                : 'bg-white text-gray-400 hover:text-pink-600 border border-gray-100 shadow-sm'}`}
                    >
                        {page}
                    </motion.button>
                ))}
            </div>

            <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`p-4 rounded-2xl transition-all shadow-sm flex items-center justify-center
                    ${currentPage === totalPages
                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        : 'bg-white text-gray-900 hover:text-pink-600 border border-gray-100'}`}
            >
                <ChevronRight size={20} />
            </motion.button>
        </div>
    );
};
