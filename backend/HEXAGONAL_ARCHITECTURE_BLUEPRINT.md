# 메뉴(Menu) 시스템 헥사고날 아키텍처 (Hexagonal Architecture) 청사진

MSA(Microservices Architecture) 전환을 대비하여, **메뉴(Menu)** 도메인을 독립적인 모듈로 분리하고 **헥사고날 아키텍처(Ports and Adapters)** 패턴을 적용하기 위한 설계도입니다.

이 구조의 핵심은 애플리케이션 코어(도메인 + 애플리케이션 로직)를 외부 세계(Web, DB 등)로부터 철저히 격리시키는 것입니다. 외부와의 소통은 오직 **포트(Port)** 를 통해서만 이루어지며, **어댑터(Adapter)** 가 그 포트를 구현하거나 호출합니다.

---

## 1. 패키지 구조 (Package Structure)

기존의 계층형(`controller`, `service`, `repository`) 구조를 **도메인 중심의 모듈형 구조**로 재편합니다.

```text
com.new_cafe.app.backend.menu (Bounded Context)
├── domain                     # [Core 1] 도메인 모델 (가장 안쪽)
│   ├── Menu.java              # 핵심 비즈니스 로직을 가진 도메인 객체 (POJO)
│   └── MenuImage.java
│
├── application                # [Core 2] 애플리케이션 비즈니스 규칙 (Hexagon 내부)
│   ├── port                   # 외부와 소통하는 인터페이스 (Ports)
│   │   ├── in                 # [Driving Port] 외부 -> 내부 명령 (Use Case)
│   │   │   ├── CreateMenuUseCase.java
│   │   │   ├── GetMenuUseCase.java
│   │   │   └── RegisterMenuImageUseCase.java
│   │   └── out                # [Driven Port] 내부 -> 외부 요청 (Repository Interface 등)
│   │       ├── LoadMenuPort.java
│   │       ├── SaveMenuPort.java
│   │       └── UpdateMenuPort.java
│   └── service                # [Service] Input Port 구현체
│       └── MenuService.java   # UseCase 인터페이스를 구현하고 도메인 로직을 조율
│
└── adapter                    # [Infrastructure] 외부 세계와의 연결 (Adapters)
    ├── in                     # [Driving Adapter] 입력을 받아 Core로 전달
    │   └── web                # Web Adapter (Controller)
    │       ├── MenuController.java
    │       └── dto            # Web 계층 전용 Request/Response 객체
    │           ├── MenuWebResponse.java
    │           └── MenuWebRequest.java
    └── out                    # [Driven Adapter] Core의 요청을 외부로 전달
        └── persistence        # Persistence Adapter (DB 구현체)
            ├── MenuPersistenceAdapter.java # Output Port 구현 (기존 JDBC Repo 코드)
            └── MenuEntity.java             # (선택) DB 테이블 매핑용 객체. 도메인 객체와 분리 시 사용.
```

---

## 2. 계층별 상세 역할 (Roles)

### 1) 도메인 (Domain)
*   **역할**: 소프트웨어의 본질인 비즈니스 로직과 상태를 가집니다.
*   **특징**: 프레임워크나 DB 기술에 전혀 의존하지 않는 순수 Java 객체(POJO)입니다.
*   **예시**: `Menu` 객체 내에 `changePrice(newPrice)`, `checkAvailability()` 등의 메서드가 포함되어야 합니다.

### 2) 애플리케이션 (Application)
*   **Ports (Internfaces)**:
    *   **In (Use Cases)**: "사용자가 메뉴를 생성한다", "메뉴 목록을 조회한다" 등의 행위를 인터페이스로 정의합니다.
    *   **Out (Outputs)**: "메뉴를 저장한다", "ID로 메뉴를 찾는다" 등의 영속성 처리를 위한 인터페이스입니다. (기존 `Repository` 인터페이스와 유사)
*   **Service**: In Port(Use Case)를 구현합니다. 도메인 객체를 로드(Out Port 사용)하고, 도메인 로직을 실행한 뒤, 변경된 상태를 저장(Out Port 사용)합니다.

### 3) 어댑터 (Adapter)
*   **In (Web)**: HTTP 요청을 받아 Use Case(Port In)를 호출, 결과를 HTTP 응답으로 변환합니다. `MenuController`가 여기에 속합니다.
*   **Out (Persistence)**: Port Out 인터페이스를 구현하여 실제로 DB에 접근합니다. 기존의 `NewMenuRepository`(JDBC 코드)가 `MenuPersistenceAdapter`가 됩니다.
    *   *패턴*: `Adapter`는 DB에서 데이터를 조회(`ResultSet`)하여 `Domain` 객체(`Menu`)로 변환(Mapping)해서 리턴해야 합니다.

---

## 3. 마이그레이션 가이드 (Migration Guide)

기존 코드를 새로운 구조로 옮기는 방법입니다.

| 기존 파일 위치 | 변경될 위치 및 역할 | 비고 |
| :--- | :--- | :--- |
| `entity.Menu` | `menu.domain.Menu` | JPA/Lombok 어노테이션을 최소화하거나 제거하여 순수성을 높임 |
| `service.MenuService` (Interface) | `menu.application.port.in.*UseCase` | 기능별로 인터페이스 분리 권장 (Command/Query 분리) |
| `repository.MenuRepository` (Interface) | `menu.application.port.out.*Port` | `LoadMenuPort`, `SaveMenuPort` 등으로 세분화 가능 |
| `service.NewMenuService` (Impl) | `menu.application.service.MenuService` | UseCase 구현체. 비즈니스 로직은 도메인으로 위임 |
| `repository.NewMenuRepository` (Impl) | `menu.adapter.out.persistence.MenuPersistenceAdapter` | Out Port 구현체. JDBC 로직 유지 |
| `controller.MenuController` | `menu.adapter.in.web.MenuController` | DTO 변환 및 UseCase 호출 담당 |

---

## 4. 데이터 흐름 예시 (Scenario: 메뉴 생성)

1.  **Web Request**: 클라이언트가 `POST /menus` 요청.
2.  **Adapter (In)**: `MenuController`가 요청을 받아 `CreateMenuCommand`(DTO) 생성.
3.  **Port (In)**: `CreateMenuUseCase.createMenu(command)` 호출.
4.  **Service**: `MenuService`가 트랜잭션 시작, `Menu` 도메인 객체 생성 (비즈니스 검증 포함).
5.  **Domian**: `Menu` 객체가 스스로 유효성 검사 수행.
6.  **Port (Out)**: `SaveMenuPort.save(menu)` 호출.
7.  **Adapter (Out)**: `MenuPersistenceAdapter`가 `Menu` 객체를 받아 `INSERT` SQL 실행.
8.  **Return**: 저장된 ID 반환 -> Controller가 응답.

---

이 청사진은 **메뉴 모듈의 독립성**을 보장하므로, 추후 이 모듈만 떼어내어 별도의 마이크로서비스 프로젝트로 분리하기 매우 수월해집니다.
