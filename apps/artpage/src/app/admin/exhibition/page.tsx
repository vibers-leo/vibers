"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Edit, ExternalLink } from "lucide-react";

export default function AdminExhibitionList() {
    const [exhibitions, setExhibitions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const q = query(collection(db, "exhibitions"), orderBy("created_at", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setExhibitions(data);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("정말로 삭제하시겠습니까?")) return;
        
        try {
            await deleteDoc(doc(db, "exhibitions", id));
            toast.success("삭제되었습니다.");
            fetchData();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("삭제 중 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-gray-400">로딩 중...</div>;
    }

    return (
        <div className="max-w-screen-xl mx-auto py-20 px-6">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-3xl font-serif font-bold">전시 관리 (Firebase)</h1>
                <Link href="/admin/exhibition/write">
                    <Button className="bg-black text-white hover:bg-gray-800">
                        + 새 전시 등록
                    </Button>
                </Link>
            </div>

            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 border-b">포스터</th>
                            <th className="p-4 border-b">제목 / 작가</th>
                            <th className="p-4 border-b">기간</th>
                            <th className="p-4 border-b">상태</th>
                            <th className="p-4 border-b text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {exhibitions?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-gray-400">
                                    등록된 전시가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            exhibitions?.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 w-24">
                                        <div className="relative w-16 h-20 bg-gray-100 rounded overflow-hidden">
                                            {item.poster_url ? (
                                                <Image
                                                    src={item.poster_url}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-xs text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900">{item.title}</p>
                                        <p className="text-sm text-gray-500">{item.artist}</p>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {item.start_date} ~ {item.end_date}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            {item.is_active ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-medium">
                                                    Inactive
                                                </span>
                                            )}
                                            {item.is_main_slider && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                                    Main Slider
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {item.youtube_url && (
                                                <a href={item.youtube_url} target="_blank" className="p-2 text-gray-400 hover:text-red-600">
                                                    <ExternalLink size={18} />
                                                </a>
                                            )}
                                            <Link href={`/admin/exhibition/edit/${item.id}`}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-gray-400 border-gray-200 hover:text-black hover:border-black"
                                                >
                                                    <Edit size={16} className="mr-1" /> 수정
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                className="text-gray-400 border-gray-200 hover:text-red-600 hover:border-red-600"
                                            >
                                                <Trash2 size={16} className="mr-1" /> 삭제
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
