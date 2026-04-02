'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useBenefits } from '@/hooks/useBenefits';
import { Benefit } from '@/types/firestore';
import { uploadBenefitImage, deleteBenefitImage } from '@/lib/firebase/storage';
import Image from 'next/image';

interface BenefitModalProps {
  benefit: Benefit | null;
  onClose: () => void;
  onSubmit: (data: Omit<Benefit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

function BenefitModal({ benefit, onClose, onSubmit }: BenefitModalProps) {
  const [icon, setIcon] = useState(benefit?.icon || '');
  const [title, setTitle] = useState(benefit?.title || '');
  const [description, setDescription] = useState(benefit?.description || '');
  const [order, setOrder] = useState(benefit?.order || 1);
  const [bannerImage, setBannerImage] = useState(benefit?.bannerImage || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(benefit?.bannerImage || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setBannerImage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalBannerImage = bannerImage;

      // 새 이미지 파일이 있으면 업로드
      if (imageFile) {
        setUploadingImage(true);
        const benefitId = benefit?.id || 'new';
        finalBannerImage = await uploadBenefitImage(benefitId, imageFile);
        setUploadingImage(false);

        // 기존 이미지가 있었다면 삭제
        if (benefit?.bannerImage && benefit.bannerImage !== finalBannerImage) {
          await deleteBenefitImage(benefit.bannerImage).catch(console.error);
        }
      }

      await onSubmit({
        icon,
        title,
        description,
        bannerImage: finalBannerImage,
        order,
        isActive: true,
      } as Omit<Benefit, 'id' | 'createdAt' | 'updatedAt'>);
      onClose();
    } catch (error) {
      console.error('제출 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
        <h2 className="text-xl font-bold mb-4">
          {benefit ? '혜택 수정' : '혜택 추가'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 배너 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배너 이미지 (선택사항)
            </label>

            {imagePreview ? (
              <div className="relative w-full aspect-[2/1] bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="미리보기"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                  disabled={submitting || uploadingImage}
                >
                  삭제
                </button>
              </div>
            ) : (
              <label className="w-full aspect-[2/1] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand transition-colors">
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600">클릭하여 이미지 업로드</span>
                <span className="text-xs text-gray-400 mt-1">권장 비율: 2:1 (1200x600)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={submitting || uploadingImage}
                />
              </label>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              아이콘 (이모지)
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="💰"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="지원금 최대로!"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="매장에서만 가능한 최대 지원금"
              rows={3}
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              정렬 순서
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg"
              min="1"
              required
              disabled={submitting}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={submitting || uploadingImage}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-brand text-dark font-bold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
              disabled={submitting || uploadingImage}
            >
              {uploadingImage ? '이미지 업로드 중...' : submitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BenefitsPage() {
  const { benefits, loading, error, createBenefit, updateBenefit, deleteBenefit } = useBenefits();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);

  const handleSubmit = async (data: Omit<Benefit, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingBenefit) {
      await updateBenefit(editingBenefit.id, data);
    } else {
      await createBenefit(data);
    }
    setIsModalOpen(false);
    setEditingBenefit(null);
  };

  const handleDelete = async (benefit: Benefit) => {
    if (confirm(`"${benefit.title}" 혜택을 삭제하시겠습니까?`)) {
      try {
        // 배너 이미지도 삭제
        if (benefit.bannerImage) {
          await deleteBenefitImage(benefit.bannerImage).catch(console.error);
        }
        await deleteBenefit(benefit.id);
      } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">혜택 관리</h1>
          <button
            onClick={() => {
              setEditingBenefit(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-brand text-dark font-bold rounded-lg hover:bg-brand-600 transition-colors"
          >
            + 혜택 추가
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            오류: {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
          </div>
        ) : benefits.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">아직 등록된 혜택이 없습니다.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-brand text-dark font-bold rounded-lg hover:bg-brand-600 transition-colors"
            >
              첫 혜택 추가하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
                {/* 배너 이미지 */}
                {benefit.bannerImage && (
                  <div className="relative w-full aspect-[2/1] bg-gray-100">
                    <Image
                      src={benefit.bannerImage}
                      alt={benefit.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* 카드 내용 */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-4xl">{benefit.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{benefit.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{benefit.description}</p>
                        <p className="text-xs text-gray-400 mt-2">순서: {benefit.order}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingBenefit(benefit);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(benefit)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <BenefitModal
            benefit={editingBenefit}
            onClose={() => {
              setIsModalOpen(false);
              setEditingBenefit(null);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
