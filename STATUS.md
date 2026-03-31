# Vibers Platform — 프로젝트 현황

> 최종 업데이트: 2026-03-24 by [TCC]
> 상태: 모노레포 통합 완료 (13개 앱), 빌드 전체 통과, 문서화 표준화 완료

## 현재 상태
- [x] Turborepo 루트 구조 생성
- [x] packages/ui 초기화
- [x] packages/config 초기화 (tsconfig.base.json)
- [x] packages/design-system 초기화 (디자인 토큰)
- [x] 13개 Next.js 프로젝트 통합 완료
- [x] bun install 완료 (1626 packages)
- [x] 전체 앱 빌드 테스트 통과 (13/13)
- [x] git remote 주소 vibers-leo로 변경 완료 (8개 앱)
- [x] jcatalog 삭제 (premiumpage 이전 이름, 불필요)
- [x] 전체 문서화 표준화 완료 (CLAUDE.md 13/13, DESIGN_GUIDE.md 13/13, STATUS.md 13/13, OKR.md 5/5)
- [ ] 윈도우 PC 추가 프로젝트 통합

## apps/ 내 프로젝트 목록 (13개)
| 앱 | package name | 빌드 | git remote | 비고 |
|---|---|---|---|---|
| semophone | @vibers/semophone | ✅ | vibers-leo/semophone | dev 확인 (localhost:3001) |
| art-way | @vibers/art-way | ✅ | vibers-leo/art-way | |
| arthyun | @vibers/arthyun | ✅ | vibers-leo/arthyun | |
| artpage | @vibers/artpage | ✅ | vibers-leo/artpage | UI 컴포넌트 보강함 |
| faneasy | @vibers/faneasy | ✅ | vibers-leo/faneasy | uuid, playwright 추가 |
| my-next-guide | @vibers/my-next-guide | ✅ | vibers-leo/my-next-guide | |
| myaiprintshop | @vibers/myaiprintshop | ✅ | vibers-leo/myaiprintshop | |
| rminu | @vibers/rminu | ✅ | vibers-leo/oceantech | 레포명 oceantech |
| vibefolio-nextjs | @vibers/vibefolio-nextjs | ✅ | vibers-vibefolio/vivefolio-nextjs-src | 별도 org |
| vibers | @vibers/vibers | ✅ | 🔲 git 없음 | |
| agency-landing | @vibers/agency-landing | ✅ | 🔲 git 없음 | |
| everyones-ai | @vibers/everyones-ai | ✅ | 🔲 git 없음 | |
| richlychee | @vibers/richlychee | ✅ | 🔲 git 없음 | |

## 삭제된 앱
| 앱 | 사유 |
|---|---|
| jcatalog | premiumpage의 이전 이름. 2026-03-23 삭제 |

## 다음 액션
- [ ] git 없는 4개 앱 레포 생성 및 연결 (agency-landing, everyones-ai, richlychee, vibers)
- [ ] 윈도우 PC에서 추가 Next.js 프로젝트 가져오기
- [ ] 각 앱 `bun run dev --filter=@vibers/앱이름` 으로 개별 동작 확인
- [ ] 각 앱 package-lock.json 삭제 (다중 lockfile 경고 해소)
- [ ] 공통 컴포넌트를 @vibers/ui로 점진적 이관
- [ ] Vercel 앱별 배포 연결 확인
