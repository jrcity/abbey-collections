import React, { useState, useEffect } from 'react';
import { useUI } from '@/context/UIContext';
import { db, auth, googleProvider } from '@/configs/firebase';
import { signInWithPopup } from 'firebase/auth';
import { Category, Product, Inquiry } from '@/types';
import SeoHead from '@/components/seo/SeoHead';
import { ShoppingBag, User as UserIcon, Package, MessageSquare, BarChart as BarChartIcon, Plus, Pencil, Trash, TrendingUp, DollarSign, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileInput, MobileTextArea, MobileSelect, MobileButton, MobileMultiFileInput, MobileToggle, MobilePagination } from '@/components/ui/CustomUI';
import ProductModal from '@/components/ProductModal';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { seedDatabase } from '@/utils/seed';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Cell
} from 'recharts';

export default function AdminUploadPage() {
    const { showAlert, showConfirm } = useUI();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'inquiries' | 'analytics'>('inventory');

    // Data State
    const [products, setProducts] = useState<Product[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [uploading, setUploading] = useState(false);

    // Form State (for adding/editing)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<Category>('Fashion & Design');
    const [desc, setDesc] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [inStock, setInStock] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [invPage, setInvPage] = useState(1);
    const invPerPage = 10;

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Products & Inquiries
    useEffect(() => {
        if (!user) return;

        const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubProducts = onSnapshot(qProducts, (snap) => {
            setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
        });

        const qInquiries = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
        const unsubInquiries = onSnapshot(qInquiries, (snap) => {
            setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry)));
        });

        return () => { unsubProducts(); unsubInquiries(); };
    }, [user]);

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const validateForm = () => {
        if (!name.trim()) return "Product Name is required.";
        if (!price || isNaN(Number(price)) || Number(price) <= 0) return "Valid Price is required.";
        if (!desc.trim()) return "Description is required.";

        const totalImages = existingImages.length + imageFiles.length + (imageFile ? 1 : 0);
        if (totalImages === 0) return "At least one image is required.";
        if (totalImages > 7) return "Maximum 7 images allowed.";

        return null;
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const error = validateForm();
        if (error) {
            showAlert(error, "error");
            return;
        }

        setUploading(true);
        try {
            let imagesToSave = [...existingImages];

            // Upload new images to Cloudinary
            if (imageFiles.length > 0) {
                const uploadPromises = imageFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

                    const response = await fetch(
                        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                        { method: 'POST', body: formData }
                    );

                    if (!response.ok) throw new Error('Cloudinary upload failed');
                    const data = await response.json();
                    return data.secure_url as string;
                });

                const newUrls = await Promise.all(uploadPromises);
                imagesToSave = [...imagesToSave, ...newUrls];
            }

            // Fallback for older products or if using the old MobileFileInput for some reason
            if (imageFile && imageFiles.length === 0) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    { method: 'POST', body: formData }
                );

                if (!response.ok) throw new Error('Cloudinary upload failed');
                const data = await response.json();
                imagesToSave = [data.secure_url, ...imagesToSave];
            }

            const productData: Partial<Product> = {
                name: name.trim(),
                price: Number(price),
                category,
                description: desc.trim(),
                imageUrl: imagesToSave[0] || '', // Primary image
                images: imagesToSave, // All images
                inStock,
                updatedAt: Date.now()
            };

            if (editingProduct) {
                await updateDoc(doc(db, "products", editingProduct.id), productData);
                showAlert("Product Updated Successfully!", "success");
            } else {
                await addDoc(collection(db, "products"), { ...productData, createdAt: Date.now() });
                showAlert("New Product Published!", "success");
            }

            resetForm();
            setActiveTab('inventory');
        } catch (error) {
            console.error("Operation failed: ", error);
            showAlert("Failed to save product. Please check your connection.", "error");
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setName(''); setPrice(''); setDesc(''); setImageFile(null); setImageFiles([]); setExistingImages([]); setEditingProduct(null); setInStock(true);
    };

    const deleteProduct = (id: string) => {
        showConfirm("This product will be permanently removed from your shop. Proceed?", async () => {
            await deleteDoc(doc(db, "products", id));
            showAlert("Product deleted.", "warning");
        });
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setName(product.name);
        setPrice(product.price.toString());
        setCategory(product.category);
        setDesc(product.description);
        setInStock(product.inStock);
        setExistingImages(product.images || [product.imageUrl]);
        setActiveTab('add');
    };

    const updateInquiryStatus = async (id: string, status: 'sold' | 'cancelled') => {
        await updateDoc(doc(db, "inquiries", id), { status });
    };

    // Prepare Analytics Data
    const chartData = inquiries.reduce((acc: any[], inq) => {
        const date = new Date(inq.createdAt).toLocaleDateString();
        const existing = acc.find(d => d.date === date);
        if (existing) {
            existing.leads += 1;
            if (inq.status === 'sold') {
                existing.sales += 1;
                existing.revenue += inq.totalPrice;
            }
        } else {
            acc.push({
                date,
                leads: 1,
                sales: inq.status === 'sold' ? 1 : 0,
                revenue: inq.status === 'sold' ? inq.totalPrice : 0
            });
        }
        return acc;
    }, []).slice(-7); // Last 7 active days

    const leadsVsSalesData = [
        { name: 'WhatsApp Leads', value: inquiries.length, color: '#f472b6' },
        { name: 'Completed Sales', value: inquiries.filter(i => i.status === 'sold').length, color: '#10b981' }
    ];

    const handleSeed = async () => {
        showConfirm("This will add demo products to your shop. Continue?", async () => {
            try {
                const res = await seedDatabase();
                showAlert(`Successfully added ${res.count} demo products!`, "success");
            } catch (error) {
                showAlert("Seeding failed.", "error");
            }
        });
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
        <div className="min-h-screen bg-gray-50 pb-24">
            <SeoHead title="Admin Dashboard" description="Manage your store" />

            {/* Tab Bar */}
            <div className="bg-white sticky top-20 z-40 shadow-sm border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
                <div className="max-w-4xl mx-auto flex">
                    {[
                        { id: 'inventory', icon: Package, label: 'Inventory' },
                        { id: 'add', icon: Plus, label: editingProduct ? 'Edit' : 'Add' },
                        { id: 'inquiries', icon: MessageSquare, label: 'Inquiries' },
                        { id: 'analytics', icon: BarChartIcon, label: 'Analytics' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as any); if (tab.id !== 'add') resetForm(); }}
                            className={`flex flex-1 items-center justify-center gap-2 py-6 px-4 font-black transition-all border-b-4
                                ${activeTab === tab.id ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            <tab.icon size={20} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4">
                <AnimatePresence mode="wait">
                    {activeTab === 'inventory' && (
                        <motion.div key="inv" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-4">
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={handleSeed}
                                    className="flex items-center gap-2 px-6 py-3 bg-pink-50 text-pink-600 font-black rounded-2xl hover:bg-pink-100 transition-all text-sm"
                                >
                                    <Database size={16} />
                                    Seed Demo Data
                                </button>
                            </div>

                            {products.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 font-bold">No products yet. Tap "Add" to start.</div>
                            ) : (
                                <>
                                    <div className="grid gap-4">
                                        {products
                                            .slice((invPage - 1) * invPerPage, invPage * invPerPage)
                                            .map(p => (
                                                <div key={p.id} className="bg-white p-4 rounded-[2rem] shadow-sm flex items-center gap-4 group">
                                                    <div className="relative">
                                                        <img src={p.imageUrl} className="h-20 w-20 rounded-2xl object-cover bg-gray-50" />
                                                        {p.images && p.images.length > 1 && (
                                                            <div className="absolute -bottom-2 -right-2 bg-pink-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                                                +{p.images.length - 1}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h4 className="font-black text-gray-900 group-hover:text-pink-600 transition-colors">{p.name}</h4>
                                                        <p className="text-pink-600 font-bold">₦{p.price.toLocaleString()}</p>
                                                        <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">{p.category}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEdit(p)} className="p-3 bg-gray-50 text-gray-400 hover:text-pink-600 rounded-xl transition-all"><Pencil size={18} /></button>
                                                        <button onClick={() => deleteProduct(p.id)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"><Trash size={18} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    <MobilePagination
                                        currentPage={invPage}
                                        totalPages={Math.ceil(products.length / invPerPage)}
                                        onPageChange={setInvPage}
                                    />
                                </>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'add' && (
                        <motion.div key="add" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100">
                            <h2 className="text-2xl font-black mb-8">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleUpload} className="space-y-6">
                                <MobileInput label="Product Name" value={name} onChange={e => setName(e.target.value)} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <MobileInput label="Price (₦)" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
                                    <MobileSelect label="Category" value={category} onValueChange={val => setCategory(val as Category)}
                                        options={[
                                            { value: "Fashion & Design", label: "Fashion" },
                                            { value: "Cosmetics & Jewelry", label: "Cosmetics" },
                                            { value: "Pack Accessories", label: "Accessories" },
                                            { value: "Skin Care", label: "Skin Care" }
                                        ]}
                                    />
                                </div>
                                <MobileTextArea label="Description" value={desc} onChange={e => setDesc(e.target.value)} required rows={4} />

                                <MobileMultiFileInput
                                    label="Product Images"
                                    accept="image/*"
                                    onFilesSelect={setImageFiles}
                                    currentImages={existingImages}
                                    onRemoveCurrentImage={(url) => setExistingImages(prev => prev.filter(img => img !== url))}
                                />

                                <MobileToggle
                                    label="Item is currently In-Stock"
                                    checked={inStock}
                                    onChange={setInStock}
                                />

                                <div className="flex flex-col gap-4 pt-4">
                                    <div className="flex gap-4">
                                        {editingProduct && (
                                            <MobileButton variant="secondary" onClick={resetForm} className="flex-1">Cancel</MobileButton>
                                        )}
                                        <MobileButton type="submit" disabled={uploading} className="flex-[2] text-xl">
                                            {uploading ? "Saving..." : (editingProduct ? "Update Product" : "Publish Product")}
                                        </MobileButton>
                                    </div>

                                    {/* Preview Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const error = validateForm();
                                            if (error) {
                                                showAlert(error, "error");
                                                return;
                                            }
                                            setShowPreview(true);
                                        }}
                                        className="w-full py-4 bg-gray-50 text-gray-600 font-black rounded-[1.5rem] border-2 border-gray-100 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag size={20} />
                                        Preview as Customer
                                    </button>
                                </div>
                            </form>

                            {/* Preview Modal */}
                            {showPreview && (
                                <ProductModal
                                    isOpen={showPreview}
                                    onClose={() => setShowPreview(false)}
                                    product={{
                                        name,
                                        price: Number(price),
                                        description: desc,
                                        category,
                                        inStock,
                                        images: [...existingImages, ...imageFiles.map(f => URL.createObjectURL(f))]
                                    }}
                                />
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'inquiries' && (
                        <motion.div key="inq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            {inquiries.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 font-bold">No inquiries yet. Wait for customers!</div>
                            ) : inquiries.map(inq => (
                                <div key={inq.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status: {inq.status}</p>
                                            <p className="font-black text-xl text-gray-900">₦{inq.totalPrice.toLocaleString()}</p>
                                        </div>
                                        {inq.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => updateInquiryStatus(inq.id, 'sold')} className="px-4 py-2 bg-green-50 text-green-600 font-bold rounded-xl flex items-center gap-2 hover:bg-green-600 hover:text-white transition-all"><DollarSign size={16} /> Mark as Sold</button>
                                                <button onClick={() => updateInquiryStatus(inq.id, 'cancelled')} className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all">Cancel</button>
                                            </div>
                                        )}
                                        {inq.status === 'sold' && <div className="px-4 py-2 bg-green-600 text-white font-black rounded-xl">✓ SOLD</div>}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {inq.items.map((it, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl text-xs font-bold text-gray-600">
                                                <img src={it.imageUrl} className="w-6 h-6 rounded-md" />
                                                <span>{it.quantity}x {it.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-[10px] items-center flex gap-1 text-gray-400 font-bold"><TrendingUp size={12} /> {new Date(inq.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            {/* Key Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-tighter mb-2">Total Revenue</p>
                                    <p className="text-3xl font-black text-gray-900">₦{inquiries.filter(i => i.status === 'sold').reduce((s, i) => s + i.totalPrice, 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-tighter mb-2">Total Orders</p>
                                    <p className="text-3xl font-black text-gray-900">{inquiries.filter(i => i.status === 'sold').length}</p>
                                </div>
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-tighter mb-2">Active Products</p>
                                    <p className="text-3xl font-black text-gray-900">{products.length}</p>
                                </div>
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-tighter mb-2">Conversion Rate</p>
                                    <p className="text-3xl font-black text-gray-900">
                                        {inquiries.length > 0 ? Math.round((inquiries.filter(i => i.status === 'sold').length / inquiries.length) * 100) : 0}%
                                    </p>
                                </div>
                            </div>

                            {/* Advanced Charts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Leads vs Sales Chart */}
                                <div className="bg-white p-6 rounded-[3rem] shadow-xl border border-gray-100 h-80">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 px-2">Conversion Performance</h3>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <BarChart data={leadsVsSalesData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                                                {leadsVsSalesData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Revenue Trend */}
                                <div className="bg-white p-6 rounded-[3rem] shadow-xl border border-gray-100 h-80">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 px-2">Revenue Growth</h3>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Line type="monotone" dataKey="revenue" stroke="#db2777" strokeWidth={4} dot={{ r: 6, fill: '#db2777', strokeWidth: 2, stroke: '#fff' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Recent Sales Activity */}
                            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-pink-50 rounded-2xl text-pink-600"><TrendingUp /></div>
                                    <h3 className="text-xl font-black">Recent Closed Deals</h3>
                                </div>
                                <div className="space-y-4">
                                    {inquiries.filter(i => i.status === 'sold').slice(0, 5).map(s => (
                                        <div key={s.id} className="flex justify-between items-center border-b border-gray-50 pb-4">
                                            <div>
                                                <p className="font-bold text-gray-900">Sale #...{s.id.slice(-4)}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(s.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-green-600 font-black">+₦{s.totalPrice.toLocaleString()}</p>
                                                <p className="text-[9px] text-gray-300 font-bold uppercase">{s.items.length} Items</p>
                                            </div>
                                        </div>
                                    ))}
                                    {inquiries.filter(i => i.status === 'sold').length === 0 && <p className="text-center text-gray-400 py-10 font-bold">No sales data yet.</p>}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}