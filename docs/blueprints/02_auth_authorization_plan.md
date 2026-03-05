# 인증 및 권한 구현 계획서 (Auth & Authorization Implementation Plan)

이 문서는 `/admin/**` 경로에 대한 관리자 권한 제어 및 로그인 기능을 구현하기 위한 상세 계획을 담고 있습니다.

## 1. 목표
- 백엔드: Spring Security 및 JWT를 이용한 인증/권한 시스템 구축
- 프론트엔드: Next.js Middleware를 이용한 경로 보호 및 권한별 접근 제어
- `/admin/**` 경로는 `ADMIN` 권한을 가진 사용자만 접근 가능하도록 설정

---

## 2. 백엔드 구현 계획 (Spring Boot)

### [Phase 1: 인프라 구축]
1. **의존성 추가 (`build.gradle`)**:
    - `spring-boot-starter-security`: 보안 프레임워크
    - `jjwt` (io.jsonwebtoken): JWT 생성 및 검증
2. **도메인 모델 수정 (`AuthUser.java`)**:
    - `Role` 필드 추가 (ADMIN, USER)
3. **Security 설정 (`SecurityConfig.java`)**:
    - CORS 설정 (프론트엔드 포트 허용)
    - CSRF 비활성화 (Stateless JWT 방식)
    - `/admin/**` 경로에 `hasRole('ADMIN')` 적용
    - `/api/auth/login`, `/api/auth/register` 등은 전체 허용

### [Phase 2: JWT 인증 로직]
1. **`JwtTokenProvider`**:
    - 토큰 생성 (Secret Key, Expiration 설정)
    - 토큰에서 정보 추출 (Username, Role)
    - 토큰 유효성 검증
2. **`JwtAuthenticationFilter`**:
    - 모든 요청에서 Authorization 헤더 확인
    - 유효한 JWT인 경우 `SecurityContext`에 인증 정보 저장
3. **`AuthService` 완성**:
    - BCrypt를 이용한 비밀번호 암호화 및 비교
    - 로그인 성공 시 실제 JWT 토큰 발급

---

## 3. 프론트엔드 구현 계획 (Next.js)

### [Phase 1: 상태 관리 및 세션]
1. **Zustand Store (`store/useAuthStore.ts`)**:
    - `token`, `userRole` 정보를 로컬 스토리지와 동기화하여 관리
    - `login`, `logout` 액션 정의
2. **Login Page 구현 (`app/login/LoginForm.tsx`)**:
    - 백엔드 API 연동
    - 성공 시 토큰 저장 및 `/admin` (로그인 정보에 따라) 등으로 리다이렉트

### [Phase 2: 경로 보호 (Route Protection)]
1. **Next.js Middleware (`middleware.ts`)**:
    - `/admin`으로 시작하는 모든 요청 가로채기
    - 토큰 존재 여부 확인
    - (옵션) 토큰 내의 권한 정보 확인하여 `ADMIN`이 아니면 접근 차단
2. **접근 제한 페이지 (`app/unauthorized/page.tsx`)**:
    - 권한이 없는 사용자가 접근했을 때 보여줄 안내 페이지

---

## 4. 진행 현황 및 체크리스트
- [ ] 백엔드: Spring Security 의존성 추가
- [ ] 백엔드: AuthUser에 Role 추가 및 엔티티 반영
- [ ] 백엔드: JWT 기능 구현 (Provider, Filter)
- [ ] 백엔드: SecurityConfig 설정 (URL 권한 지정)
- [ ] 프론트엔드: Zustand를 이용한 인증 상태 관리
- [ ] 프론트엔드: LoginForm 고도화
- [ ] 프론트엔드: middleware.ts를 이용한 /admin 경로 보호
- [ ] 프론트엔드: 권한 없음(Unauthorized) 페이지 구현
