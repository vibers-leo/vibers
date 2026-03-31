# 미션7 (Mission7) — DB 테이블 명세서

> 작성일: 2026-03-28
> DB: PostgreSQL 16 (NCP vibers-db) + Firestore (AI 대화 로그)
> ORM: ActiveRecord (Rails)

---

## 테이블 관계도

```
users
  ├─< mission_templates (1:N)
  ├─< daily_missions (1:N)
  ├─< ai_sessions (1:N)  ← Firestore
  ├─< streaks (1:N)
  └─< notification_settings (1:1)

mission_templates
  └─< daily_missions (1:N, optional)

daily_missions
  └─< mission_logs (1:N)
```

---

## 1. users — 사용자

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | bigint | PK, auto | 내부 ID |
| firebase_uid | varchar(128) | UNIQUE, NOT NULL | Firebase UID |
| email | varchar(255) | UNIQUE | 이메일 |
| display_name | varchar(100) | NOT NULL | 표시 이름 |
| photo_url | text | nullable | 프로필 사진 URL |
| provider | varchar(20) | NOT NULL | 로그인 제공자 (google/apple/email) |
| timezone | varchar(50) | DEFAULT 'Asia/Seoul' | 사용자 시간대 |
| onboarding_completed | boolean | DEFAULT false | 온보딩 완료 여부 |
| premium | boolean | DEFAULT false | 프리미엄 사용자 |
| ai_chat_count_today | integer | DEFAULT 0 | 오늘 AI 대화 횟수 |
| ai_chat_reset_date | date | nullable | AI 카운트 리셋 날짜 |
| created_at | timestamp | NOT NULL | 가입일 |
| updated_at | timestamp | NOT NULL | 수정일 |

**인덱스:**
- `idx_users_firebase_uid` ON (firebase_uid) UNIQUE
- `idx_users_email` ON (email) UNIQUE

---

## 2. mission_templates — 미션 템플릿 (보관함)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | bigint | PK, auto | |
| user_id | bigint | FK → users, NOT NULL | 소유자 |
| title | varchar(200) | NOT NULL | 미션 제목 |
| description | text | nullable | 상세 설명 |
| category | varchar(30) | NOT NULL | 카테고리 키 (health/development/creation/business/learning/lifestyle) |
| mission_type | varchar(20) | NOT NULL | 미션 타입 (one_time/daily_repeat/weekly_repeat/monthly_repeat/dday/project) |
| icon | varchar(100) | DEFAULT 'solar:star-bold' | Iconify 아이콘 이름 |
| color | varchar(7) | DEFAULT '#3B82F6' | HEX 색상 |
| is_pinned | boolean | DEFAULT false | 고정 미션 여부 (매일 자동 추가) |
| is_archived | boolean | DEFAULT false | 보관 처리 |
| repeat_config | jsonb | nullable | 반복 설정 (아래 상세) |
| dday_target | date | nullable | D-day 목표일 |
| target_progress | integer | DEFAULT 100 | 프로젝트 미션 목표 (%) |
| current_progress | integer | DEFAULT 0 | 프로젝트 미션 현재 진행률 (%) |
| use_count | integer | DEFAULT 0 | 사용 횟수 |
| last_used_at | date | nullable | 마지막 사용일 |
| created_at | timestamp | NOT NULL | |
| updated_at | timestamp | NOT NULL | |

**repeat_config JSONB 예시:**
```json
// 매일 반복
{ "frequency": "daily" }

// 주 3회
{ "frequency": "weekly", "times_per_week": 3 }

// 월 10회
{ "frequency": "monthly", "times_per_month": 10 }
```

**인덱스:**
- `idx_templates_user_id` ON (user_id)
- `idx_templates_user_pinned` ON (user_id, is_pinned) WHERE is_archived = false
- `idx_templates_user_category` ON (user_id, category)

---

## 3. daily_missions — 일일 미션 인스턴스

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | bigint | PK, auto | |
| user_id | bigint | FK → users, NOT NULL | |
| template_id | bigint | FK → mission_templates, nullable | 원본 템플릿 (없으면 즉석 생성) |
| date | date | NOT NULL | 미션 수행 날짜 |
| title | varchar(200) | NOT NULL | 미션 제목 (스냅샷) |
| category | varchar(30) | NOT NULL | 카테고리 |
| mission_type | varchar(20) | NOT NULL | 미션 타입 |
| status | varchar(20) | DEFAULT 'pending' | pending/in_progress/completed/skipped |
| slot_index | integer | NOT NULL, CHECK (0~6) | 7개 슬롯 중 위치 (0~6) |
| progress | integer | nullable | 프로젝트 미션 진행률 (0~100) |
| completed_at | timestamp | nullable | 완료 시각 |
| skip_reason | varchar(200) | nullable | 스킵 사유 |
| created_at | timestamp | NOT NULL | |
| updated_at | timestamp | NOT NULL | |

**제약:**
- `UNIQUE (user_id, date, slot_index)` — 같은 날 같은 슬롯에 중복 불가
- `CHECK (slot_index >= 0 AND slot_index <= 6)` — 7개 슬롯 제한

**인덱스:**
- `idx_daily_user_date` ON (user_id, date)
- `idx_daily_user_date_status` ON (user_id, date, status)
- `idx_daily_template` ON (template_id)

---

## 4. mission_logs — 미션 변경 로그

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | bigint | PK, auto | |
| daily_mission_id | bigint | FK → daily_missions, NOT NULL | |
| action | varchar(30) | NOT NULL | created/started/progress_updated/completed/skipped/reordered |
| old_value | jsonb | nullable | 변경 전 값 |
| new_value | jsonb | nullable | 변경 후 값 |
| created_at | timestamp | NOT NULL | |

**인덱스:**
- `idx_logs_daily_mission` ON (daily_mission_id)

---

## 5. streaks — 스트릭 기록

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | bigint | PK, auto | |
| user_id | bigint | FK → users, NOT NULL | |
| streak_type | varchar(20) | NOT NULL | perfect (7/7) / partial (1+/7) |
| start_date | date | NOT NULL | 스트릭 시작일 |
| end_date | date | nullable | 끊긴 날 (진행중이면 null) |
| count | integer | NOT NULL | 연속 일수 |
| is_current | boolean | DEFAULT false | 현재 진행중 스트릭 |
| created_at | timestamp | NOT NULL | |
| updated_at | timestamp | NOT NULL | |

**인덱스:**
- `idx_streaks_user_current` ON (user_id, is_current) WHERE is_current = true
- `idx_streaks_user_type` ON (user_id, streak_type)

---

## 6. notification_settings — 알림 설정

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | bigint | PK, auto | |
| user_id | bigint | FK → users, UNIQUE, NOT NULL | |
| morning_enabled | boolean | DEFAULT true | 아침 리마인더 |
| morning_time | time | DEFAULT '08:00' | |
| midday_enabled | boolean | DEFAULT true | 오후 체크 |
| midday_time | time | DEFAULT '14:00' | |
| evening_enabled | boolean | DEFAULT true | 저녁 알림 |
| evening_time | time | DEFAULT '21:00' | |
| midnight_enabled | boolean | DEFAULT false | 자정 경고 |
| push_token | text | nullable | FCM 토큰 |
| created_at | timestamp | NOT NULL | |
| updated_at | timestamp | NOT NULL | |

---

## 7. daily_summaries — 일간 요약 (캐시 테이블)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | bigint | PK, auto | |
| user_id | bigint | FK → users, NOT NULL | |
| date | date | NOT NULL | |
| total_missions | integer | NOT NULL | 총 미션 수 (보통 7) |
| completed_count | integer | NOT NULL | 완료 수 |
| skipped_count | integer | DEFAULT 0 | 스킵 수 |
| is_perfect | boolean | DEFAULT false | 7/7 달성 여부 |
| first_completed_at | timestamp | nullable | 첫 완료 시각 |
| last_completed_at | timestamp | nullable | 마지막 완료 시각 |
| ai_comment | text | nullable | AI 일간 코멘트 |
| created_at | timestamp | NOT NULL | |

**제약:**
- `UNIQUE (user_id, date)`

**인덱스:**
- `idx_summary_user_date` ON (user_id, date)
- `idx_summary_user_perfect` ON (user_id, is_perfect) WHERE is_perfect = true

---

## Firestore 컬렉션 (AI 대화 로그)

PostgreSQL에 넣기엔 비정형 데이터가 많으므로 Firestore에 저장.

### ai_sessions/{session_id}
```json
{
  "user_id": 1,
  "context": "mission_planning",
  "started_at": "2026-03-28T09:00:00Z",
  "messages": [
    {
      "role": "user",
      "content": "이번 주 유튜브 채널 개설 목표를 세우고 싶어",
      "timestamp": "2026-03-28T09:00:00Z"
    },
    {
      "role": "assistant",
      "content": "좋은 목표네요! ...",
      "model": "gemini-flash",
      "tokens": 450,
      "timestamp": "2026-03-28T09:00:02Z"
    }
  ],
  "suggested_missions": [...],
  "total_tokens": 1200,
  "total_cost_usd": 0.0012
}
```

### ai_weekly_reviews/{user_id}_{week}
```json
{
  "user_id": 1,
  "week": "2026-W13",
  "summary": "이번 주 달성률 78%...",
  "insights": [...],
  "next_week_suggestions": [...],
  "generated_at": "2026-03-30T21:00:00Z"
}
```

---

## 마이그레이션 순서

```bash
# Rails 마이그레이션 생성 순서
rails g migration CreateUsers
rails g migration CreateMissionTemplates
rails g migration CreateDailyMissions
rails g migration CreateMissionLogs
rails g migration CreateStreaks
rails g migration CreateNotificationSettings
rails g migration CreateDailySummaries
```

---

## 데이터 보존 정책

| 데이터 | 보존 기간 | 비고 |
|--------|----------|------|
| users | 영구 | 탈퇴 시 30일 후 삭제 |
| mission_templates | 영구 | is_archived로 소프트 삭제 |
| daily_missions | 영구 | 통계 산출에 필요 |
| mission_logs | 90일 | 이후 자동 삭제 (cron) |
| streaks | 영구 | |
| daily_summaries | 영구 | |
| ai_sessions (Firestore) | 180일 | 비용 관리 |
