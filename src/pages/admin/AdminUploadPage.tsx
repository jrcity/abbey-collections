import { useState, useEffect } from 'react';
import { db, storage, auth, googleProvider } from '@/configs/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { signInWithPopup, User as FirebaseUser } from 'firebase/auth';
import { Category } from '@/types';
import SeoHead from '@/components/seo/SeoHead';
import { v4 as uuidv4 } from 'uuid';
import { ShoppingBag, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { MobileInput, MobileTextArea, MobileSelect, MobileButton, MobileFileInput } from '@/components/ui/CustomUI';

export default function AdminUploadPage() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true); // Initial loading for auth check
    const [uploading, setUploading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<Category>('Fashion & Design');
    const [desc, setDesc] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile || !user) return;

        setUploading(true);
        try {
            // 1. Upload Image
            const imageRef = ref(storage, `products/${imageFile.name + uuidv4()}`);
            await uploadBytes(imageRef, imageFile);
            const url = await getDownloadURL(imageRef);

            // 2. Add to Firestore
            await addDoc(collection(db, "products"), {
                name,
                price: Number(price),
                category,
                description: desc,
                imageUrl: url,
                inStock: true,
                createdAt: Date.now()
            });

            alert("Product Uploaded Successfully!");
            setName(''); setPrice(''); setDesc(''); setImageFile(null);
        } catch (error) {
            console.error("Error uploading: ", error);
            alert("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50">
                <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-indigo-50 p-4">
                <SeoHead title="Admin Login | Abbey Collections" description="Login to manage Abbey Collections & Designs" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white max-w-md w-full text-center"
                >
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        className="mb-6 inline-flex p-4 bg-pink-100 rounded-2xl text-pink-600"
                    >
                        <ShoppingBag size={40} />
                    </motion.div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back, Abbey</h2>
                    <p className="text-gray-500 mb-8">Login to manage your collections and designs</p>
                    <MobileButton
                        onClick={handleLogin}
                        className="w-full text-lg"
                    >
                        <UserIcon size={20} />
                        Sign In with Google
                    </MobileButton>
                    <p className="mt-6 text-sm text-gray-400">Secure Admin Gateway • Nexalith</p>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto p-6"
        >
            <SeoHead title="Admin Dashboard" description="Manage your store" />
            <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

            <form onSubmit={handleUpload} className="space-y-6">
                <MobileInput
                    label="Product Name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g. Silk Luxury Gown"
                />

                <div className="grid grid-cols-2 gap-4">
                    <MobileInput
                        label="Price (₦)"
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                        placeholder="0.00"
                    />
                    <MobileSelect
                        label="Category"
                        value={category}
                        onValueChange={val => setCategory(val as Category)}
                        options={[
                            { value: "Fashion & Design", label: "Fashion & Design" },
                            { value: "Cosmetics & Jewelry", label: "Cosmetics & Jewelry" },
                            { value: "Pack Accessories", label: "Pack Accessories" },
                            { value: "Skin Care", label: "Skin Care" }
                        ]}
                    />
                </div>

                <MobileTextArea
                    label="Description"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    required
                    rows={4}
                    placeholder="Describe the product details..."
                />

                <MobileFileInput
                    label="Product Image"
                    accept="image/*"
                    onFileSelect={setImageFile}
                    required
                />

                <MobileButton
                    type="submit"
                    disabled={uploading}
                    className="w-full text-xl py-5"
                >
                    {uploading ? (
                        <span className="flex items-center justify-center gap-3">
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Publishing...
                        </span>
                    ) : 'Publish Product'}
                </MobileButton>
            </form>
        </motion.div>
    );
}