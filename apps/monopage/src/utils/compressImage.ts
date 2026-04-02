import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1, // 최대 1MB
    maxWidthOrHeight: 1920, // 최대 해상도 FHD
    useWebWorker: true,
    fileType: 'image/webp', // WebP로 변환
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return new File([compressedFile], file.name.replace(/\.[^/.]+$/, ".webp"), { type: 'image/webp' });
  } catch (error) {
    console.error("Image compression error:", error);
    return file; // 실패 시 원본 반환
  }
};
