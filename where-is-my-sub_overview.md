# 내구독어디가 (where-is-my-sub) 프로젝트 오버뷰

## 프로젝트 정보
- **서비스명**: 내구독어디가
- **GitHub**: https://github.com/paaye7313/where-is-my-sub
- **프론트엔드 배포**: Vercel (GitHub `main` 브랜치 push 시 자동 배포)
- **백엔드 배포**: Render (`https://where-is-my-sub-server.onrender.com`, GitHub `main` 브랜치 push 시 자동 배포)
- **DB**: Render PostgreSQL (무료 플랜, 90일마다 재생성 필요)
- **로컬 경로**: `C:\paaye\project\where-is-my-sub`

---

## 기술 스택

### 프론트엔드
- React (Vite)
- axios
- @dnd-kit/core, @dnd-kit/sortable (드래그 앤 드롭)
- recharts (차트)

### 백엔드
- Node.js + Express
- JWT 인증 (jsonwebtoken)
- bcrypt (비밀번호 암호화)
- pg (PostgreSQL 연결)

### DB
- PostgreSQL

---

## 폴더 구조
```
C:\paaye\where-is-my-sub/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── SubCard.jsx
│   │   ├── SummaryBox.jsx
│   │   ├── AddSubModal.jsx
│   │   └── ServerWakeup.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── AnalyticsPage.jsx
│   │   └── AuthPage.jsx
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── server/
    ├── routes/
    │   ├── auth.js
    │   └── subscriptions.js
    ├── middleware/
    │   └── auth.js
    ├── index.js
    ├── db.js
    └── .env
```

---

## DB 스키마
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  billing_date INTEGER NOT NULL,
  billing_month INTEGER DEFAULT NULL,
  cycle VARCHAR(50) NOT NULL,
  order_index INTEGER DEFAULT 0,
  icon VARCHAR(10) DEFAULT '📦',
  color VARCHAR(20) DEFAULT '#534AB7',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 주요 기능

### 대시보드
- 구독 등록, 수정, 삭제, 검색
- 구독 카드 클릭 시 수정/삭제 버튼 노출 (모바일 UX 개선)
- 드래그 앤 드롭 순서 변경 (PC + 모바일 터치 지원, TouchSensor + touchAction: 'none')
- 순서 수정 모드 (이름순, 금액순, 결제일순 정렬 + 저장/취소)
- 월간/연간 구독 구분 표시 (연간은 결제월/일 + 월환산 표시)
- 상단 요약 카드 (이번 달 지출, 연간 환산, 구독 수) — 연간 구독은 월환산(price/12)으로 계산
- PC에서 최대 너비 800px 중앙 정렬

### 지출 분석
- 구독별 지출 비중 바 차트 (월간/연간 토글 가능)
- 구독 색상이 차트에 그대로 반영
- 필터 토글 버튼으로 특정 구독 제외 가능 (제외해도 버튼은 유지되어 다시 켤 수 있음)
- 월/연간 환산 비교 테이블 (이름, 월간, 연간 기준 오름차순/내림차순 정렬)
- 정렬 기준이 차트와 필터 버튼 순서에도 동일하게 반영됨
- 가장 비싼 구독 표시 (월환산 기준)
- 반응형 레이아웃 (4열 → 3열 → 2열, 768px / 480px 기준)

### 구독 추가/수정 모달
- 빠른 선택 템플릿 (Netflix, 유튜브 프리미엄, Spotify, Apple Music, Disney+, Watcha, wavve, ChatGPT Plus, Claude Pro, Adobe CC, Microsoft 365, 네이버 플러스)
- 이모지 아이콘 선택 (16개)
- 색상 선택 (16가지, 템플릿과 매치되도록 통일됨)
- 결제 주기(월간/연간)를 서비스 이름 바로 아래에 배치
- 연간 결제 선택 시 결제월 입력 필드 노출
- 모달 너비 520px (가로 스크롤 방지)

### 인증
- 회원가입 / 로그인 (JWT, 7일 유효)
- 로그아웃
- localStorage에 토큰 저장, axios interceptor로 자동 첨부

### 인프라
- Render 슬립 모드(15분 비활성) 대응 서버 웨이크업 배너
  - `GET /health` 엔드포인트로 서버 상태 체크
  - 2초 이상 응답 없으면 상단 배너 노출
  - 서버 준비 완료 시 초록색 전환 후 2초 뒤 자동 숨김
  - 서버 연결 실패 시 로그인 에러 메시지 억제 (배너가 대신 안내)
  - 로그인/대시보드 양쪽 화면 모두 적용

---

## API 엔드포인트

Base URL (로컬): `http://localhost:3001/api`
Base URL (배포): `https://where-is-my-sub-server.onrender.com/api`

### 헬스체크
| Method | Endpoint | 설명 | 인증 필요 |
|---|---|---|---|
| GET | `/health` | 서버 상태 확인 (웨이크업 체크용) | X |

### 인증 (`/auth`) — `server/routes/auth.js`
| Method | Endpoint | 설명 | Body | 인증 필요 |
|---|---|---|---|---|
| POST | `/auth/register` | 회원가입 | `{ email, password }` | X |
| POST | `/auth/login` | 로그인, JWT 토큰(7일 유효) 발급 | `{ email, password }` | X |

### 구독 (`/subscriptions`) — `server/routes/subscriptions.js`
모든 라우트는 `authMiddleware` 통과 필요 (헤더에 `Authorization: Bearer {token}`)

| Method | Endpoint | 설명 | Body |
|---|---|---|---|
| GET | `/subscriptions` | 로그인한 유저의 구독 목록 조회 (order_index 순) | - |
| POST | `/subscriptions` | 구독 추가 | `{ name, price, billingDate, billingMonth, cycle, icon, color }` |
| PUT | `/subscriptions/reorder` | 구독 순서 일괄 저장 | `{ orderedIds: [id, id, ...] }` |
| PUT | `/subscriptions/:id` | 구독 수정 | `{ name, price, billingDate, billingMonth, cycle, icon, color }` |
| DELETE | `/subscriptions/:id` | 구독 삭제 | - |

**주의**: Express 라우팅 특성상 `/reorder`는 반드시 `/:id` 라우트보다 **위에** 선언되어야 함 (아래 순서로 안 하면 `/reorder`가 `:id`로 잘못 매칭되어 순서 저장이 동작하지 않음).

### 프론트엔드 API 래퍼 — `src/api.js`
axios 인스턴스에 `Authorization` 헤더를 자동으로 붙이는 interceptor 적용. 함수명: `register`, `login`, `getSubscriptions`, `addSubscription`, `updateSubscription`, `deleteSubscription`, `reorderSubscriptions`

---

## 트러블슈팅 히스토리

프로젝트 진행하면서 실제로 겪고 해결한 문제들. 비슷한 증상이 재발하면 참고할 것.

| 증상 | 원인 | 해결 |
|---|---|---|
| `npm -v` 실행 시 보안 오류로 버전이 안 뜸 | Windows PowerShell 실행 정책이 스크립트 실행을 차단 | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` 실행 후 Y 입력 |
| `SubCard.jsx` import 시 `does not provide an export named 'default'` | 파일을 저장하지 않은 상태였음 | 파일 저장(Ctrl+S) 후 재시도 |
| 컴포넌트 수정 후 아무 반응 없음 (콘솔 에러도 없음) | `App.jsx`에서 상태(`showModal`)를 Header와 Dashboard 양쪽에서 따로 관리해 리렌더링 시 상태가 꼬임 | 모달 상태를 Dashboard 한 곳에서만 관리하도록 구조 변경 |
| `Uncaught ReferenceError: useState is not defined` | 일부 코드만 교체하다 보니 `import { useState } from 'react'`가 파일에서 빠짐 | 이후로는 "전체 교체 / 일부 수정"을 명확히 구분해서 안내하기로 함 |
| PowerShell에서 `PGPASSWORD=xxx psql -h ...` 형태 명령이 안 먹음 | PowerShell은 bash처럼 `VAR=value command` 인라인 문법을 지원하지 않음 | `$env:PGPASSWORD="xxx"` 로 먼저 환경변수 설정 후 `psql -h ...` 별도 실행 |
| 모바일 브라우저에서 드래그 앤 드롭이 전혀 동작하지 않음 | `@dnd-kit`의 `PointerSensor`만 등록되어 있어 터치 이벤트를 못 받음 + 터치 시 브라우저 기본 스크롤과 충돌 | `TouchSensor` 센서 추가(`activationConstraint: { delay: 500, tolerance: 8 }`) + 드래그 핸들에 `touchAction: 'none'` 스타일 추가 |
| 구독 순서를 드래그로 바꾼 뒤 새로고침하면 원래 순서로 복원됨 | 백엔드 `subscriptions.js`에서 `/reorder` 라우트가 `/:id` 라우트보다 아래에 선언되어 Express가 "reorder"를 id 파라미터로 인식해버림 | `/reorder` 라우트를 `/:id` 라우트들보다 위로 이동 |
| `AnalyticsPage.jsx`에서 return문에 `<style>`과 `<div>`를 나란히 반환해 렌더링 안 됨 | React는 하나의 JSX 요소만 return 가능한데 두 개를 나란히 반환함 | `<>...</>` Fragment로 감싸서 하나의 트리로 통합 |
| 구독 추가 시 500 에러, 서버 로그에 `"icon" 칼럼은 "subscriptions" 릴레이션에 없음` | Render DB에는 `ALTER TABLE`로 icon/color 컬럼을 추가했지만 로컬 PostgreSQL DB에는 반영하지 않음 | 로컬 DB에도 동일하게 `ALTER TABLE subscriptions ADD COLUMN ...` 실행. 이후 스키마 변경은 "로컬 + Render 둘 다" 적용하는 걸 원칙으로 삼음 |
| 구독 수정 모달을 열어도 결제월/결제일 값이 채워지지 않음 | `SubCard`에서 `onEdit`으로 넘길 때는 카멜케이스(`billingDate`, `billingMonth`)로 넘기는데, `AddSubModal`에서는 DB 원본 필드명인 스네이크케이스(`billing_date`, `billing_month`)로 읽으려 해서 값이 `undefined`가 됨 | input의 `defaultValue`를 `editData?.billingDate || editData?.billing_date` 처럼 양쪽 케이스를 다 체크하도록 수정 |
| 어느 날 갑자기 로그인 시 500 에러, 구독 조회 401 에러 | Render 무료 PostgreSQL 플랜이 90일 경과로 DB가 자동 삭제됨 (대시보드에 DB 자체가 안 보임) | DB를 동일한 이름으로 재생성 → 새 Internal Database URL을 Render 서버 환경변수 `DB_URL`에 갱신 → `users`, `subscriptions` 테이블 재생성(스키마 전체) → 기존 계정/데이터는 모두 유실되므로 재가입 필요 |

---

## 환경변수

### 백엔드 로컬 (`server/.env`)
```
DB_USER=postgres
DB_PASSWORD=로컬_비밀번호
DB_HOST=localhost
DB_PORT=5432
DB_NAME=whereismysub
JWT_SECRET=로컬_랜덤_시크릿
```

### Render 환경변수
```
DB_URL=Internal Database URL
JWT_SECRET=배포용_랜덤_시크릿(로컬과 다른 값)
NODE_ENV=production
```

### 프론트엔드 (`.env.production`)
VITE_API_URL=https://where-is-my-sub-server.onrender.com/api

### 프론트엔드 로컬 (`.env.local`)
VITE_API_URL=http://localhost:3001/api

`src/db.js`는 `DB_URL`이 있으면 그걸 우선 사용하고(Render용), 없으면 개별 환경변수를 사용(로컬용)하도록 분기 처리되어 있음.

---

## 개발/운영 시 주의사항
- Render 무료 PostgreSQL은 **90일마다 자동 삭제**됨 → 삭제되면 DB 재생성 후 테이블(users, subscriptions) 다시 생성하고, Render 서버 환경변수의 `DB_URL`도 새 값으로 갱신해야 함
- DB 스키마(컬럼 추가 등) 변경 시 **로컬 DB와 Render DB 둘 다** 동일하게 반영해야 함 (이 때문에 겪었던 버그: icon/color 컬럼을 Render에만 추가하고 로컬에는 빼먹어서 로컬 테스트에서 500 에러 발생)
- Render 무료 서버는 **15분 비활성 시 슬립 모드** 진입 → 첫 요청이 느리거나 실패할 수 있음
- 로컬 개발은 두 가지 방식 지원:
  - **네이티브**: 터미널 두 개 필요 — 프론트(`npm run dev`), 백엔드(`cd server` → `node index.js`). PostgreSQL이 로컬에 설치되어 있어야 함
  - **Docker**: `docker compose up --build` 한 번으로 프론트(5173)/백엔드(3001)/PostgreSQL(15432→컨테이너 내부 5432) 전부 기동. `server/db/init.sql`이 최초 실행 시 테이블 자동 생성. `server/.env`의 `JWT_SECRET`만 있으면 되고 DB 접속 정보는 `docker-compose.yml`에서 고정값(postgres/postgres/whereismysub)으로 오버라이드됨
  - 여러 PC를 오가며 개발하는 경우 Docker 방식이 PostgreSQL 재설치 없이 바로 시작할 수 있어 더 편함
- 프론트/백엔드 데이터 필드명 주의: DB는 스네이크 케이스(`billing_date`, `billing_month`), 프론트 컴포넌트 간 전달은 카멜케이스(`billingDate`, `billingMonth`)를 쓰는 경우가 섞여 있어 수정 모달에 값이 안 채워지는 버그가 있었음 → 값을 읽을 때 `editData?.billingDate || editData?.billing_date`처럼 양쪽 다 체크하는 방식으로 해결한 이력 있음
- Render PostgreSQL 접속 방법 (Windows PowerShell):
  ```powershell
  $env:PGPASSWORD="Render에서_복사한_비밀번호"
  ```
  그 다음 Render 대시보드의 PSQL Command에서 `PGPASSWORD=...` 부분을 제외한 `psql -h dpg-...` 부분만 실행

---

## 개발 스타일 / 선호 사항
- 코드 전달 시 "전체 교체"인지 "일부만 수정"인지 명확히 구분해서 안내할 것
- 커밋은 기능 단위로 자주, 커밋 메시지는 `feat:`, `fix:`, `chore:`, `docs:` 접두사 사용
- UI는 심플하고 미니멀한 톤 (메인 컬러 `#534AB7` 보라색)
- 새로운 기능 추가 전 목업이나 방향을 먼저 확인받는 것을 선호
- 모바일 UX를 PC 못지않게 신경 씀 (터치 드래그, 반응형 그리드, 탭-투-확장 UI 등)

---

## 향후 진행 가능한 작업 아이디어
- 광고(Google AdSense) 삽입 검토 (로그인 필요 서비스라 승인이 까다로울 수 있음, 랜딩페이지 필요)
- README 지속 업데이트
- 배포 안정성 개선 (Render 슬립모드/DB 만료 이슈 대응 - 유료 전환 또는 대체 서비스 검토)
