# 미션7 (Mission7) — API 기능문서

> 작성일: 2026-03-28
> 스택: Rails API (NCP Docker) + Firebase Auth
> 베이스 URL: `https://mission7.vibers.co.kr/api/v1`

---

## 인증 (Authentication)

모든 API 요청은 Firebase ID Token을 헤더에 포함해야 함.

```
Authorization: Bearer {firebase_id_token}
```

Rails에서 Firebase Admin SDK로 토큰 검증 후 `current_user` 세팅.

---

## 1. 사용자 (Users)

### POST /users/sync
Firebase 로그인 후 서버에 사용자 동기화.
```json
// Request
{
  "firebase_uid": "abc123",
  "display_name": "LEO",
  "email": "juuuno1116@gmail.com",
  "photo_url": "https://...",
  "provider": "google"
}

// Response 200
{
  "id": 1,
  "firebase_uid": "abc123",
  "display_name": "LEO",
  "streak_count": 12,
  "total_perfect_days": 45,
  "created_at": "2026-03-28T09:00:00Z"
}
```

### GET /users/me
현재 사용자 프로필 + 통계 요약.

### PATCH /users/me
프로필 업데이트 (display_name, photo_url, notification_settings).

---

## 2. 미션 템플릿 (Mission Templates)

보관함에 저장해두는 재사용 가능한 미션 정의.

### GET /templates
사용자의 미션 템플릿 목록.
```json
// Response 200
{
  "templates": [
    {
      "id": 1,
      "title": "코딩 1시간",
      "category": "development",
      "mission_type": "daily_repeat",
      "repeat_config": { "frequency": "daily" },
      "is_pinned": true,
      "use_count": 34,
      "last_used_at": "2026-03-27"
    }
  ]
}
```

### POST /templates
새 미션 템플릿 생성.
```json
// Request
{
  "title": "나노바나나2 가이드북 집필",
  "description": "챕터별 원고 작성 진행",
  "category": "creation",
  "mission_type": "project",
  "target_progress": 100,
  "icon": "solar:document-text-bold",
  "color": "#10B981"
}
```

### PATCH /templates/:id
템플릿 수정.

### DELETE /templates/:id
템플릿 삭제 (소프트 삭제).

---

## 3. 일일 미션 (Daily Missions)

특정 날짜에 수행할 미션 인스턴스.

### GET /daily/:date
해당 날짜의 미션 목록 (YYYY-MM-DD).
```json
// Response 200
{
  "date": "2026-03-28",
  "missions": [
    {
      "id": 101,
      "template_id": 1,
      "title": "코딩 1시간",
      "category": "development",
      "mission_type": "daily_repeat",
      "status": "completed",
      "completed_at": "2026-03-28T10:30:00Z",
      "slot_index": 0,
      "progress": null
    },
    {
      "id": 102,
      "template_id": null,
      "title": "유튜브 채널 개설",
      "category": "creation",
      "mission_type": "dday",
      "status": "pending",
      "dday_target": "2026-04-03",
      "slot_index": 3,
      "progress": null
    },
    {
      "id": 103,
      "template_id": 5,
      "title": "나노바나나2 가이드북",
      "category": "creation",
      "mission_type": "project",
      "status": "in_progress",
      "slot_index": 5,
      "progress": 35
    }
  ],
  "completed_count": 3,
  "total_count": 7,
  "is_perfect": false
}
```

### POST /daily/:date/missions
해당 날짜에 미션 추가.
```json
// Request
{
  "template_id": 1,           // 템플릿에서 추가 (선택)
  "title": "크몽 서비스 등록",  // 직접 입력 (template_id 없을 때)
  "category": "business",
  "mission_type": "one_time",
  "slot_index": 4
}
```

### PATCH /daily/:date/missions/:id
미션 상태 업데이트 (완료, 진행률 변경, 스킵 등).
```json
// 완료 처리
{ "status": "completed" }

// 프로젝트 미션 진행률 업데이트
{ "progress": 55 }

// 스킵 처리
{ "status": "skipped", "skip_reason": "일정 변경" }
```

### DELETE /daily/:date/missions/:id
미션 제거 (당일 슬롯에서 제거).

### POST /daily/:date/missions/reorder
미션 슬롯 순서 변경.
```json
{
  "mission_ids": [103, 101, 105, 102, 104, 106, 107]
}
```

---

## 4. AI 코칭 (AI Coaching)

### POST /ai/chat
AI와 대화 (미션 수립/코칭).
```json
// Request
{
  "message": "이번 주 유튜브 채널 개설 목표를 세우고 싶어",
  "context": "mission_planning",
  "session_id": "sess_abc123"
}

// Response 200
{
  "reply": "좋은 목표네요! 이번 주 안에 달성할 수 있게...",
  "suggested_missions": [
    {
      "title": "채널 이름/컨셉 정하기",
      "mission_type": "one_time",
      "category": "creation",
      "suggested_date": "2026-03-31"
    }
  ],
  "model_used": "gemini-flash",
  "tokens_used": 450
}
```

### POST /ai/recommend
오늘의 미션 AI 추천.
```json
// Request
{
  "date": "2026-03-28",
  "current_missions": [101, 102],
  "slots_remaining": 5
}

// Response 200
{
  "recommendations": [
    {
      "title": "30분 걷기",
      "reason": "최근 5일 연속 완료한 미션이에요",
      "source": "repeat_history",
      "confidence": 0.95
    },
    {
      "title": "팬이지 결제 모듈 리서치",
      "reason": "D-day까지 6일 남았어요",
      "source": "dday_urgency",
      "confidence": 0.88
    },
    {
      "title": "비타민 먹기",
      "reason": "오늘은 건강 카테고리 미션이 없네요",
      "source": "category_balance",
      "confidence": 0.72
    }
  ]
}
```

### GET /ai/weekly-review
주간 리뷰 데이터 + AI 코멘트.

---

## 5. 통계 (Statistics)

### GET /stats/daily/:date
일간 통계.

### GET /stats/weekly?week=2026-W13
주간 통계 (달성률 그래프, 카테고리 분포).

### GET /stats/monthly?month=2026-03
월간 통계 (히트맵, 프로젝트 추이).
```json
// Response 200
{
  "month": "2026-03",
  "heatmap": {
    "2026-03-01": { "completed": 5, "total": 7 },
    "2026-03-02": { "completed": 7, "total": 7 },
    ...
  },
  "perfect_days": 12,
  "total_completed": 156,
  "longest_streak": 8,
  "current_streak": 3,
  "category_distribution": {
    "development": 45,
    "health": 30,
    "creation": 28,
    "business": 20,
    "learning": 15,
    "other": 18
  }
}
```

### GET /stats/streaks
스트릭 현황 (현재 연속 일수, 최장 기록 등).

### GET /stats/projects
프로젝트 미션 진행률 현황.
```json
{
  "projects": [
    {
      "template_id": 5,
      "title": "나노바나나2 가이드북",
      "current_progress": 35,
      "progress_history": [
        { "date": "2026-03-25", "progress": 20 },
        { "date": "2026-03-27", "progress": 30 },
        { "date": "2026-03-28", "progress": 35 }
      ],
      "estimated_completion": "2026-04-15"
    }
  ]
}
```

---

## 6. 알림 설정 (Notifications)

### GET /notifications/settings
알림 설정 조회.

### PATCH /notifications/settings
알림 설정 변경.
```json
{
  "morning_reminder": { "enabled": true, "time": "08:00" },
  "midday_check": { "enabled": true, "time": "14:00" },
  "evening_reminder": { "enabled": true, "time": "21:00" },
  "midnight_warning": { "enabled": false }
}
```

---

## 7. 공유 (Sharing)

### POST /share/card
공유 카드 이미지 생성.
```json
// Request
{
  "date": "2026-03-28",
  "type": "daily_summary"
}

// Response 200
{
  "card_url": "https://storage.vibers.co.kr/mission7/cards/2026-03-28_abc.png",
  "share_text": "Mission7 | 오늘 7/7 퍼펙트 달성! 🔥 12일 연속"
}
```

---

## 8. 프리셋/카테고리 (Presets)

### GET /presets
시스템 제공 미션 프리셋 목록.

### GET /categories
미션 카테고리 목록 (아이콘, 색상 포함).
```json
{
  "categories": [
    { "key": "health", "label": "건강/운동", "icon": "solar:heart-pulse-bold", "color": "#EF4444" },
    { "key": "development", "label": "개발/코딩", "icon": "solar:code-bold", "color": "#3B82F6" },
    { "key": "creation", "label": "창작/콘텐츠", "icon": "solar:pallete-2-bold", "color": "#8B5CF6" },
    { "key": "business", "label": "비즈니스", "icon": "solar:chart-bold", "color": "#10B981" },
    { "key": "learning", "label": "학습/독서", "icon": "solar:book-bold", "color": "#F59E0B" },
    { "key": "lifestyle", "label": "생활/습관", "icon": "solar:sun-bold", "color": "#EC4899" }
  ]
}
```

---

## 에러 응답 형식

```json
{
  "error": {
    "code": "MISSION_LIMIT_EXCEEDED",
    "message": "하루 최대 7개의 미션만 추가할 수 있습니다.",
    "status": 422
  }
}
```

| 코드 | HTTP | 설명 |
|------|------|------|
| AUTH_REQUIRED | 401 | 인증 필요 |
| USER_NOT_FOUND | 404 | 사용자 없음 |
| MISSION_LIMIT_EXCEEDED | 422 | 7개 초과 |
| MISSION_NOT_FOUND | 404 | 미션 없음 |
| AI_QUOTA_EXCEEDED | 429 | AI 호출 한도 초과 |
| INVALID_DATE | 422 | 잘못된 날짜 형식 |

---

## Rate Limiting

| 엔드포인트 | 제한 |
|-----------|------|
| AI /chat | 사용자당 일 10회 (무료) / 50회 (프리미엄) |
| AI /recommend | 사용자당 일 5회 |
| 기타 API | 사용자당 분 60회 |
