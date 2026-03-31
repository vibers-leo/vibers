"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const q = query(collection(db, "products"), orderBy("created_at", "desc"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("상품 목록 로딩 실패");
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteDoc(doc(db, "products", id));
            setProducts(products.filter(p => p.id !== id));
            toast.success("삭제되었습니다.");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("삭제 실패");
        }
    };

    if (loading) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="max-w-screen-xl mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-serif font-bold">상품 관리</h1>
                <Button asChild className="bg-black text-white hover:bg-gray-800">
                    <Link href="/admin/products/write" className="flex items-center gap-2">
                        <Plus size={18} /> 상품 등록
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length > 0 ? products.map((product) => (
                    <div key={product.id} className="bg-white border rounded-lg overflow-hidden shadow-sm group hover:shadow-md transition">
                        <div className="relative aspect-[4/5] bg-gray-50">
                            {product.image_url ? (
                                <Image src={product.image_url} alt={product.title} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">NO IMAGE</div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-gray-400">{product.category}</span>
                                <span className="text-sm font-bold">₩{product.price}</span>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-4 line-clamp-1">{product.title}</h3>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                    <Link href={`/mall/${product.id}`} target="_blank">
                                        <ExternalLink size={14} className="mr-1" /> 보기
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-600">
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center text-gray-400">등록된 상품이 없습니다.</div>
                )}
            </div>
        </div>
    );
}
