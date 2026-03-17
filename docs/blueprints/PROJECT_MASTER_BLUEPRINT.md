# NCafe Project Master Blueprint (프로젝트 마스터 블루프린트)

이 문서는 **NCafe(파이리 카페)** 프로젝트의 기술적 구조, 구현된 핵심 기능, 그리고 각 기능이 어떤 방식으로 설계되었는지를 설명하는 마스터 블루프린트입니다. 본 프로젝트는 현대적인 웹 아키텍처와 실시간 기술, AI 통합을 통해 사용자 경험을 극대화하도록 설계되었습니다.

---

## 🏗️ 1. 전체 서비스 아키텍처 (System Architecture)

NCafe는 크게 3개의 레이어로 구성되어 있으며, 각 레이어는 독립적으로 배포 및 확장이 가능한 구조를 따릅니다.

### ⚛️ Frontend (Next.js)
- **Framework**: Next.js 14/15 (App Router)
- **Design Methodology**: **FSD (Feature-Sliced Design)**
  - UI 로직을 `Shared` -> `Entities` -> `Features` -> `Widgets` -> `Pages` 로 분리하여 관리.
- **Styling**: Vanilla CSS (CSS Modules)를 사용하여 성능 최적화 및 스타일 격리.
- **Key Concepts**: SSR(Server Side Rendering)과 Client-side Interactivity의 조화, **BFF(Backend For Frontend) 패턴** 적용.

### ☕ Backend (Spring Boot)
- **Framework**: Spring Boot 3.4
- **Architecture**: **Hexagonal Architecture (Ports and Adapters)**
  - 비즈니스 로직(Core)을 외부 기술(DB, Web, API)과 분리하여 유지보수성 및 MSA 전이성 확보.
- **Persistence**: Spring Data JPA & JDBC (Migration 단계에 따라 병행 사용).

### 🤖 AI Agent (FastAPI)
- **Framework**: FastAPI (Python 3.12)
- **Capabilities**: Gemini API를 이용한 실시간 스트리밍 채팅, RAG(Retrieval Augmented Generation)를 통한 메뉴 추천 및 안내.

---

## 🚀 2. 핵심 기능 및 구현 방식 (Core Features)

### 💳 2.1 결제 시스템 (Payment System)
사용자가 메뉴를 선택하고 주문을 완료하기 위한 통합 결제 모듈입니다.

- **방식**: **카카오페이(KakaoPay) API** 연동.
- **구현 특징**:
  - **준비(Ready) & 확인(Confirm)** 단계의 2-Phase 커밋 프로세스 적용.
  - 백엔드에 `KakaoPayAdapter`를 구현하여 외부 결제 API와의 통신을 캡슐화.
  - 프론트엔드 `OrderModal`에서 결제 수단 선택 및 QR 코드 팝업 처리.
  - 성공/취소/실패에 따른 리다이렉트 URL 처리 및 주문 상태 업데이트.

### 💬 2.2 지능형 AI 에이전트 (Autonomous AI Agent)
단순한 챗봇을 넘어 사용자의 의도를 파악하고 직접 행동하는 카페 매니저 비서입니다.

- **방식**: **FastAPI + Gemini 2.0 Flash + SSE Streaming**.
- **구현 특징**:
  - **자율 주행 (Function Calling)**: "메뉴판 보여줘"와 같은 요청 시 `navigate_to_page` 도구를 스스로 호출하여 사용자의 브라우저를 해당 페이지로 직접 이동시킴.
  - **살아있는 지식 (RAG)**: 데이터베이스(pgvector)에 저장된 실제 메뉴 및 카페 운영 문서를 검색하여, 환각 현상 없이 정확한 최신 정보(메뉴 추천, 공지 등)를 제공.
  - **페르소나 및 실시간성**: 마스코트 '파이리'의 친근한 말투를 유지하며, **SSE(Server-Sent Events)** 스트리밍을 통해 한 글자씩 실시간으로 타이핑하는 듯한 대화 경험 제공.
  - **BFF 프록시**: Next.js API Routes를 통해 스트리밍 버퍼링 문제를 해결하고(`X-Accel-Buffering: no`), 보안성을 유지하며 AI 서버와 통신.

### 📋 2.3 주문 및 메뉴 관리 (Menu & Order Management)
가게 운영과 상품 노출을 위한 핵심 도메인 로직입니다.

- **메뉴 Slug 시스템**: ID 기반이 아닌 `/menu/ice-americano`와 같은 문자열 기반 URL을 지원하여 SEO 및 가독성 향상.
- **실시간 품절(Sold Out) 처리**: Admin 페이지에서 토글 한 번으로 즉시 품절 처리 및 프론트엔드 반영.
- **주문 상태 워크플로**: `PENDING` -> `ACCEPTED` -> `COMPLETED` (또는 `CANCELLED`)로 이어지는 주문 생명주기 관리.
- **Polling 기반 실시간 업데이트**: 관리자 및 사용자 페이지에서 10초 주기로 최신 주문 상태를 최신화하도록 구현.

### 🔐 2.4 보안 인증 및 사용자 관리 (Auth & BFF Pattern)
클라이언트 보안 최적화 및 안전한 사용자 인증을 담당하는 핵심 레이어입니다.

- **방식**: **Next.js API Routes + iron-session** 기반의 BFF(Backend For Frontend) 패턴.
- **구현 특징**:
  - **로그인/회원가입**: 백엔드의 **Spring Security**를 통해 비밀번호를 안전하게 암호화하고 검증하며, 인증 성공 시 JWT 토큰을 발급.
  - **JWT 은닉(BFF)**: 브라우저는 JWT를 직접 저장하거나 보지 못하며, BFF 서버가 이를 수신하여 암호화된 **httpOnly 쿠키**에 저장함으로써 XSS 공격을 원천 차단.
  - **세션 관리**: `iron-session`으로 세션을 안전하게 암호화하여 관리하며, 사용자별 권한(Role)에 따른 접근 제어 수행.
  - **통합 게이트웨이**: 클라이언트의 모든 요청(`/api/*`)을 BFF가 가로채서 세션을 확인하고, 백엔드 서버로 요청 시 토큰을 자동 주입.

### 📊 2.5 관리자 대시보드 및 데이터 시각화 (Admin Dashboard & Visualization)
매장 운영 현황을 한눈에 파악하고 전략적인 의사결정을 돕는 분석 도구입니다.

- **방식**: **Recharts** 라이브러리를 활용한 데이터 시각화.
- **구현 특징**:
  - **매출 트렌드**: 최근 7일간의 매출 변동을 선 그래프(Line Chart)로 시각화하여 흐름 파악.
  - **주문/판매 통계**: 일별 주문 건수와 판매 수량을 막대 그래프(Bar Chart)로 비교 분석.
  - **데이터 분석 로직**: 백엔드의 `DashboardQueryService`가 DB 주문 데이터를 기반으로 일별/요일별 통계를 집계하여 제공.

### 🔔 2.6 실시간 주문 관리 및 운영 워크플로 (Real-time Order Management)
매장 운영 효율을 극대화하기 위한 실시간 주문 추적 및 처리 시스템입니다.

- **방식**: **HTTP Polling** 기반의 실시간 업데이트.
- **구현 특징**:
  - **실시간 폴링**: 프론트엔드에서 10초 주기로 주문 서버를 체크하여 새로운 주문을 자동으로 화면에 갱신.
  - **주문 생명주기(Lifecycle)**: `PENDING(대기)` -> `ACCEPTED(준비 중)` -> `COMPLETED(완료/픽업)`의 단계를 원클릭으로 관리.
  - **시각적 상태 시스템**: Lucide-React 아이콘과 컬러 기반의 뱃지 시스템을 통해 주문별 진행 상황을 직관적으로 시각화.
  - **BFF 연동**: 관리자 전용 데이터이므로 BFF 프록시를 통해 보안 토큰이 포함된 안전한 통신 수행.

### 🛒 2.7 장바구니 시스템 (Cart System)
사용자가 원하는 메뉴를 담아 한 번에 주문할 수 있도록 돕는 클라이언트 상태 관리 모듈입니다.

- **방식**: **Zustand** 라이브러리를 이용한 전역 상태 관리.
- **구현 특징**:
  - **실시간 데이터 동기화**: 여러 페이지를 이동해도 장바구니 내용이 유지되며, 수량 변경 시 총 금액이 즉시 계산됨.
  - **유연한 수량 조절**: 단일 저장소(`store.ts`)에서 메뉴 추가, 수량 증감, 삭제 로직을 통합 관리.
  - **주문 워크플로 연동**: 장바구니 데이터를 백엔드가 이해할 수 있는 주문 요청서(`OrderRequest`) 구조로 변환하여 결제 시스템으로 전달.

---

## 🛠️ 3. 기술적 청사진 (Technical Blueprints)

### 📁 3.1 백엔드: 헥사고날 구조 (Domain Centric)
`com.new_cafe.app.backend.[domain]` 하위에 다음과 같은 구조를 유지합니다.
- `domain`: 순수 자바 객체 (POJO). 비즈니스 규칙의 중심.
- `application.port.in`: 외부에서 들어오는 유즈케이스 (주문하기, 결제하기 등).
- `application.port.out`: 외부로 나가는 요청 (DB 저장, 결제 서버 전송 등).
- `adapter.in.web`: Controller 레이어. 요청 변환.
- `adapter.out.persistence`: Repository 레이어. 데이터 영속성 처리.

### 📁 3.2 프론트엔드: FSD 레이어드 구조
- `src/shared`: 공통 UI 컴포넌트 (`Button`, `Modal`, `Input`), API Client, Utils.
- `src/entities`: 도메인별 데이터 소유 (`MenuCard`, `OrderSummary`).
- `src/features`: 사용자 상호작용 (`Add To Cart`, `Toggle SoldOut`).
- `src/widgets`: 레이아웃 독립적인 큰 블록 (`MenuGrid`, `AdminSidebar`).
- `app/`: Next.js 라우팅 및 페이지 조립.

### 📁 3.3 BFF: 중간 보안 레이어 (API Router)
`app/api` 경로 하위에서 데이터 흐름을 제어합니다.
- `auth/`: 로그인, 로그아웃, 세션 조회를 담당하며 쿠키와 JWT 간의 변환 처리.
- `[...path]/`: Catch-all 라우트를 통해 클라이언트 요청을 백엔드 서버로 Proxy하고 에러 처리 및 토큰 주입 수행.

---

## 🚢 4. 인프라 및 배포 (DevOps)

- **Containerization**: Docker 및 Docker Compose를 활용하여 FE, BE, AI, DB 환경을 단일 컨테이너 환경으로 관리.
- **Automation**: GitHub Actions를 통한 CI/CD 파이프라인 구축 (`deploy.yml`).
- **Dev Tooling**: `.env` 파일을 통한 환경 변수 관리 및 로컬 개발용 `docker-compose.local.yml` 지원.

---

## 🎯 5. 요약: "어떻게 만들어졌는가?"

이 프로젝트는 **"확장이 용이한 구조"**와 **"직관적인 사용자 상호작용"**에 집중하여 제작되었습니다. 헥사고날 아키텍처는 비즈니스 로직이 프레임워크에 종속되지 않게 도와주며, AI 에이전트는 단순한 텍스트 답변을 넘어 메뉴 데이터와 결합된 RAG 기술을 통해 실제 서비스의 가치를 높이고 있습니다.
