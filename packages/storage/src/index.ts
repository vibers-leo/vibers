// 공통 타입만 export (서버/클라이언트 모두 사용 가능)
export type {
  StoragePlatform,
  StorageCategory,
  PresignedUploadRequest,
  PresignedUploadResult,
} from './types';

// 서버 유틸 (server.ts) → API Route/Server Action에서 import
// 클라이언트 유틸 (client.ts) → 브라우저 컴포넌트에서 import
// 직접 import 경로 사용:
//   import { getPresignedUploadUrl } from '@vibers/storage/server'
//   import { uploadFile } from '@vibers/storage/client'
