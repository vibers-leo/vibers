# @vibers/storage — NCP Object Storage 연동 가이드

## 환경변수 설정

각 앱의 `.env.local` (로컬) 및 Vercel 환경변수에 추가:

```env
# NCP Object Storage
NCP_ACCESS_KEY=your_access_key_here
NCP_SECRET_KEY=your_secret_key_here
NCP_BUCKET_NAME=wero-bucket
NCP_CDN_URL=                             # CDN 연결 시 입력 (없으면 비워둠)
```

## 새 앱에 적용하는 방법 (3단계)

### 1. package.json에 의존성 추가

```json
{
  "dependencies": {
    "@vibers/storage": "*"
  }
}
```

### 2. API Route 복사

```bash
# presign 엔드포인트
cp packages/storage/templates/api/storage/presign/route.ts \
   apps/{앱명}/app/api/storage/presign/route.ts

# delete 엔드포인트
cp packages/storage/templates/api/storage/delete/route.ts \
   apps/{앱명}/app/api/storage/delete/route.ts
```

### 3. 기존 storage-utils.ts 교체

```ts
// lib/storage-utils.ts (기존 Firebase 코드 전체 교체)
export { uploadFile, deleteFile } from '@vibers/storage/client';
export type { StoragePlatform, StorageCategory } from '@vibers/storage';
```

끝. 컴포넌트 코드는 변경 없이 그대로 사용 가능.

---

## NCP 콘솔 설정 (최초 1회)

### CORS 설정 (브라우저 직접 업로드를 위해 필수)

NCP 콘솔 → Object Storage → 버킷 → CORS 설정:

```json
[
  {
    "AllowedOrigins": ["https://faneasy.co.kr", "https://vibefolio.com", "http://localhost:*"],
    "AllowedMethods": ["GET", "PUT", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

### 버킷 ACL

- 기본: **비공개** (presigned URL로만 접근)
- 공개 이미지 서빙이 필요하면: 버킷 ACL → `public-read`로 변경

---

## 파일 구조

```
packages/storage/
├── src/
│   ├── index.ts          # 공통 타입 export
│   ├── types.ts          # StoragePlatform, StorageCategory 등
│   ├── ncp-client.ts     # S3Client 설정
│   ├── server.ts         # 서버 전용 (presigned URL, 직접 업로드, 삭제)
│   └── client.ts         # 브라우저 전용 (presigned URL 경유 업로드)
└── templates/
    └── api/storage/
        ├── presign/route.ts
        └── delete/route.ts
```

## 적용 현황

| 앱 | 상태 | 비고 |
|----|------|------|
| faneasy | ✅ 완료 | storage-utils.ts 교체, API route 추가 |
| vibefolio-nextjs | ⬜ 대기 | Firebase Storage 사용 여부 확인 필요 |
| goodzz | ⬜ 대기 | - |
| 기타 앱 | ⬜ 대기 | 필요 시 위 3단계로 적용 |
