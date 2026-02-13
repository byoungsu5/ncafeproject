---
description: MSA 전환을 위한 메뉴 서비스 헥사고날 아키텍처 설계도
---

# ⬢ 메뉴 관리 시스템 헥사고날 아키텍처 청사진 (Hexagonal Architecture)

이 문서는 향후 MSA(Microservices Architecture) 전환을 고려하여 메뉴 관리 시스템을 독립적인 서비스로 설계하기 위한 헥사고날 아키텍처(Ports and Adapters) 설계도입니다.

## 1. 아키텍처 핵심 원칙
- **도메인 중심 설계 (Domain-Centric)**: 비즈니스 규칙이 가장 중심에 위치하며 외부 기술에 오염되지 않습니다.
- **포트와 어댑터 (Ports and Adapters)**: 외부 시스템(UI, DB, Message Queue)과의 통신은 인터페이스(Port)를 통해서만 이루어집니다.
- **MSA 준비**: 서비스가 독립적인 패키지 구조를 가져 추후 별도의 프로젝트로 분리하기 용이하게 구성합니다.

## 2. 헥사고날 구조 및 패키지 설계

```text
com.new_cafe.app.menu
├── domain (Core Domain)
│   ├── model
│   │   └── Menu.java             <-- 도메인 엔티티 (순수 Java)
│   └── service
│       └── MenuDomainService.java <-- 도메인 전용 복합 로직 (필요시)
├── application (Application Workflows)
│   ├── port
│   │   ├── in (Incoming Ports)
│   │   │   └── MenuUseCase.java   <-- 웹 UI나 외부 서비스가 호출할 명령 인터페이스
│   │   └── out (Outgoing Ports)
│   │       └── MenuRepository.java <-- DB 등 외부 저장을 위한 인터페이스
│   └── service
│       └── MenuApplicationService.java <-- 유스케이스 구현체
└── adapter (Outer World Adapters)
    ├── in
    │   └── web
    │       ├── MenuController.java <-- REST API 컨트롤러
    │       └── dto
    │           ├── MenuRequest.java
    │           └── MenuResponse.java
    └── out
        └── persistence
            ├── MenuPersistenceAdapter.java <-- DB 저장소 실제 구현체
            └── entity
                └── MenuJpaEntity.java      <-- 기술 종속적인 DB 엔티티 (JDBC/JPA 등)
```

## 3. 계층별 역할 설명

### ⬢ 내부 (Inner Hexagon: 비즈니스 로직)
- **Domain Model**: 메뉴의 이름, 가격, 카테고리 등 본질적인 데이터와 규칙을 담습니다.
- **Input Port (UseCase)**: "메뉴를 생성한다", "메뉴를 조회한다"와 같은 비즈니스 관점의 명세입니다.
- **Application Service**: 입력 포트를 구현하며, 데이터 흐름을 조정하고 출력 포트를 호출하여 비즈니스 유스케이스를 완성합니다.

### ⬢ 외부 (Outer Adapters: 기술 구현)
- **Primary Adapters (Inbound)**: 외부의 요청을 애플리케이션 서비스로 전달합니다. (예: Web Controller)
- **Secondary Adapters (Outbound)**: 애플리케이션의 요청을 외부 인프라로 전달합니다. (예: JDBC 리포지토리, 외부 API 연동)

## 4. MSA 전환을 위한 전략

1.  **독립된 데이터베이스**: 추후 메뉴 서비스 전용 DB 분리를 고려하여, 다른 도메인(예: 주문, 유저)과의 직접적인 DB Join을 지양합니다.
2.  **데이터 매핑**: 어댑터 계층에서 `도메인 모델 <-> 외부 DTO/Entity` 간의 변환을 철저히 분리하여 인프라 변경 시 도메인을 보호합니다.
3.  **패키지 격리**: `com.new_cafe.app.menu` 패키지 하위에 모든 것을 모아, 나중에 이 폴더만 통째로 떼어서 새로운 프로젝트를 만들 수 있게 합니다.

---

*이 설계도는 메뉴 관리 시스템의 고도화와 MSA 전환을 위한 탄탄한 기초가 될 것입니다. 승인 시 이 구조에 따른 디렉토리 생성 및 코드 마이그레이션을 시작하겠습니다.*
