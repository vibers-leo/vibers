export type StoragePlatform =
  | 'faneasy'
  | 'vibefolio'
  | 'goodzz'
  | 'matecheck'
  | 'nusucheck'
  | 'runnersconnect'
  | 'artpage'
  | 'common';

export type StorageCategory =
  | 'profiles'
  | 'campaigns'
  | 'banners'
  | 'products'
  | 'documents'
  | 'images'
  | 'videos'
  | 'thumbnails';

export interface PresignedUploadRequest {
  filename: string;
  contentType: string;
  platform: StoragePlatform;
  category: StorageCategory;
  customName?: string;
}

export interface PresignedUploadResult {
  uploadUrl: string;   // PUT 요청 대상 presigned URL
  key: string;         // Object Storage 내 경로 (ex: faneasy/profiles/uuid.jpg)
  publicUrl: string;   // 업로드 완료 후 공개 접근 URL
}
