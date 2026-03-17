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

### 💬 2.2 실시간 AI 채팅 에이전트 (AI Chat Agent)
카페 이용객의 질문에 응답하고 메뉴를 추천하는 지능형 도우미입니다.

- **방식**: **SSE (Server-Sent Events) 스트리밍**.
- **구현 특징**:
  - FastAPI 서빙 서버에서 답변을 토큰 단위로 스트리밍.
  - Next.js API Routes (`/api/ai-chat`)를 프록시로 사용하여 브라우저 버퍼링 이슈 해결 (`X-Accel-Buffering: no` 설정).
  - **RAG(Retrieval Augmented Generation)**: 카페의 실제 메뉴 정보를 기반으로 질문에 답변하도록 구현.

### 📋 2.3 주문 및 메뉴 관리 (Menu & Order Management)
가게 운영과 상품 노출을 위한 핵심 도메인 로직입니다.

- **메뉴 Slug 시스템**: ID 기반이 아닌 `/menu/ice-americano`와 같은 문자열 기반 URL을 지원하여 SEO 및 가독성 향상.
- **실시간 품절(Sold Out) 처리**: Admin 페이지에서 토글 한 번으로 즉시 품절 처리 및 프론트엔드 반영.
- **주문 상태 워크플로**: `PENDING` -> `ACCEPTED` -> `COMPLETED` (또는 `CANCELLED`)로 이어지는 주문 생명주기 관리.
- **Polling 기반 실시간 업데이트**: 관리자 및 사용자 페이지에서 10초 주기로 최신 주문 상태를 최신화하도록 구현.

### 🔐 2.4 보안 인증 및 API 프록시 (BFF Pattern)
클라이언트 보안 최적화 및 API 라우팅을 담당하는 중간 레이어입니다.

- **방식**: **Next.js API Routes + iron-session** 기반 인증.
- **구현 특징**:
  - **JWT 은닉**: 브라우저는 JWT를 직접 저장하거나 보지 못하며, BFF 서버에서만 관리하여 XSS 공격 방어.
  - **httpOnly 쿠키**: 암호화된 세션 정보를 전용 쿠키에 저장하여 안전한 세션 유지.
  - **통합 게이트웨이**: 클라이언트의 모든 요청(`/api/*`)을 BFF가 가로채서 백엔드(Spring) 또는 AI 에이전트로 전달하며 JWT 토큰을 자동 주입.

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
