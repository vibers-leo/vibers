# NCP Dual-Write 마이그레이션 — Claude Code 지시 프롬프트

> 이 파일을 Claude Code(AntiGravity/터미널)에 그대로 붙여넣어 사용한다.

---

## 📋 배경 (읽고 시작)

우리는 Firebase Storage → NCP Object Storage 마이그레이션 중이다.
**안전한 자연스러운 전환**을 위해 이중 쓰기(Dual Write) 전략을 쓴다:
- Firebase와 NCP에 동시에 저장
- NCP URL을 우선 반환, 실패 시 Firebase URL로 fallback
- 검증 완료 후 Firebase 제거

공유 패키지 `@vibers/storage` (위치: `packages/storage/`)가 이미 만들어져 있다.
특히 `packages/storage/src/dual.ts`의 `dualUploadFile()` 함수를 사용한다.

---

## 🎯 작업 대상 앱 목록

아래 앱들의 Firebase Storage 업로드 코드를 dual-write로 전환한다:

| 앱 | Firebase Storage 파일 | platform 값 |
|----|----------------------|-------------|
| semophone | `lib/firebase/storage.ts` | `'semophone'` |
| artpage | `src/lib/firebase.ts` + `src/actions/*.ts` | `'artpage'` |
| ai-recipe | `src/lib/firebase/storage.ts` | `'ai-recipe'` |
| aiwar | `frontend/lib/game-storage.ts` 중 파일 업로드 부분 | `'aiwar'` |
| goodzz | `src/lib/storage-service.ts` | `'goodzz'` |
| premiumpage | `lib/firebase.ts` 중 스토리지 부분 | `'premiumpage'` |

faneasy는 이미 완료됨. 건드리지 말 것.

---

## 🔧 각 앱에서 해야 할 작업 (순서대로)

### Step 1 — package.json에 @vibers/storage 추가
```json
"dependencies": {
  "@vibers/storage": "*"
}
```

### Step 2 — API Route 복사 (아직 없는 앱만)
```bash
cp packages/storage/templates/api/storage/presign/route.ts \
   apps/{앱명}/app/api/storage/presign/route.ts

cp packages/storage/templates/api/storage/delete/route.ts \
   apps/{앱명}/app/api/storage/delete/route.ts
```

### Step 3 — Firebase Storage 업로드 함수에 dual-write 적용

**기존 패턴 (변경 전):**
```ts
// lib/firebase/storage.ts
export async function uploadBenefitImage(benefitId: string, file: File): Promise<string> {
  const storageRef = ref(storage, `benefits/${benefitId}/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
```

**변경 후 패턴:**
```ts
import { dualUploadFile } from '@vibers/storage/dual';

export async function uploadBenefitImage(benefitId: string, file: File): Promise<string> {
  const result = await dualUploadFile(
    file,
    async (f) => {
      // 기존 Firebase 업로드 코드 그대로 유지
      const storageRef = ref(storage, `benefits/${benefitId}/${f.name}`);
      await uploadBytes(storageRef, f);
      return getDownloadURL(storageRef);
    },
    'semophone',   // ← 앱별 platform 값
    'images',      // ← 적절한 category
  );
  return result.url;
}
```

### Step 4 — 환경변수 추가 (.env.local)
```env
NEXT_PUBLIC_STORAGE_MODE=dual
NCP_ACCESS_KEY=your_access_key_here
NCP_SECRET_KEY=your_secret_key_here
NCP_BUCKET_NAME=wero-bucket
```

---

## ⚠️ 주의사항

1. **Firebase 코드를 삭제하지 말 것** — dual 모드에서는 Firebase도 계속 써야 함
2. **삭제(delete) 함수는 건드리지 말 것** — 검증 완료 후 별도 처리
3. **기존 Firebase URL이 DB에 저장된 데이터는 그대로** — 새 업로드부터 NCP URL 저장됨
4. **NEXT_PUBLIC_STORAGE_MODE 기본값은 'dual'** — 환경변수 없으면 자동으로 dual 모드
5. **category 값**: `profiles` | `campaigns` | `banners` | `products` | `documents` | `images` | `videos` | `thumbnails` 중 적합한 것 선택

---

## ✅ 완료 후 확인 사항

각 앱 작업 완료 후:
- [ ] 파일 업로드 테스트 → NCP wero-bucket에 파일 올라오는지 확인
- [ ] 반환된 URL이 `kr.object.ncloudstorage.com` 도메인인지 확인
- [ ] Firebase Storage에도 같은 파일이 올라오는지 확인 (dual 검증)
- [ ] CLAUDE.md 스토리지 적용 현황 테이블 업데이트

---

## 🗺️ 전체 마이그레이션 현황 (2026-03-31)

| 앱 | dual-write | 비고 |
|----|-----------|------|
| faneasy | ✅ NCP 전용 완료 | storage-utils.ts 교체됨 |
| artpage | ⬜ 작업 필요 | |
| semophone | ⬜ 작업 필요 | |
| ai-recipe | ⬜ 작업 필요 | |
| aiwar | ⬜ 작업 필요 | game state는 제외, 파일 업로드만 |
| goodzz | ⬜ 작업 필요 | 기존 S3 모드 구조 있음, NCP로 교체 |
| premiumpage | ⬜ 작업 필요 | |
