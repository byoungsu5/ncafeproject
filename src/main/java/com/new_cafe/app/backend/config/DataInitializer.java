package com.new_cafe.app.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbc;
    private final PasswordEncoder passwordEncoder;

    @Value("${INITIAL_DATA_PASSWORD}")
    private String initialPassword;

    public DataInitializer(JdbcTemplate jdbc, PasswordEncoder passwordEncoder) {
        this.jdbc = jdbc;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initUsers();

        Integer menuCount = jdbc.queryForObject("SELECT COUNT(*) FROM menus", Integer.class);
        if (menuCount != null && menuCount > 0) {
            return;
        }

        initCategories();
        initMenus();
        initMenuImages();
    }

    private void initUsers() {
        // 기존 'users' 테이블이 있으면 데이터를 업데이트하거나 부족한 정보를 채웁니다.
        // 만약 'users' 테이블이 없다면 (JPA ddl-auto=create 등에 의해 생성됨), 초기 데이터를 넣습니다.
        
        try {
            // admin 계정 (비밀번호: 1234)
            // 기존 admin 계정이 있으면 비밀번호를 BCrypt로 업데이트합니다.
            Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM users WHERE nickname = ?", Integer.class, "admin");
            if (count != null && count > 0) {
                jdbc.update("UPDATE users SET password = ?, role = ? WHERE nickname = ?", 
                    passwordEncoder.encode(initialPassword), "ROLE_ADMIN", "admin");
            } else {
                // 테이블 구조에 따라 다를 수 있으므로 안전하게 처리 (id는 자동생성 가정)
                jdbc.update("INSERT INTO users (nickname, password, role) VALUES (?, ?, ?)",
                    "admin", passwordEncoder.encode(initialPassword), "ROLE_ADMIN");
            }

            // user/newlec 계정 (비밀번호: 1234)
            count = jdbc.queryForObject("SELECT COUNT(*) FROM users WHERE nickname = ?", Integer.class, "newlec");
            if (count != null && count > 0) {
                jdbc.update("UPDATE users SET password = ?, role = ? WHERE nickname = ?", 
                    passwordEncoder.encode(initialPassword), "ROLE_USER", "newlec");
            } else {
                jdbc.update("INSERT INTO users (nickname, password, role) VALUES (?, ?, ?)",
                    "newlec", passwordEncoder.encode(initialPassword), "ROLE_USER");
            }
        } catch (Exception e) {
            System.err.println("사용자 초기화 중 오류 발생 (테이블이 아직 생성되지 않았을 수 있음): " + e.getMessage());
        }
    }

    private void initCategories() {
        String sql = "INSERT INTO categories (name) VALUES (?)";
        String[][] categories = {
            {"커피"},
            {"음료"},
            {"베이커리"},
            {"샌드위치"},
            {"디저트"},
        };
        for (String[] c : categories) {
            jdbc.update(sql, c[0]);
        }
    }

    private void initMenus() {
        String sql = """
            INSERT INTO menus (kor_name, eng_name, description, price, category_id, is_available, sort_order)
            VALUES (?, ?, ?, ?, ?, true, ?)
            """;

        // 커피 (category_id = 1)
        Object[][] coffees = {
            {"에스프레소",       "Espresso",          "깊고 진한 에스프레소 한 잔. 최상급 원두를 사용하여 풍부한 크레마와 깊은 바디감을 느낄 수 있습니다.", 3500, 1L, 1},
            {"아메리카노",       "Americano",         "에스프레소에 뜨거운 물을 더해 깔끔하고 부드러운 맛을 살린 클래식 아메리카노입니다.", 4500, 1L, 2},
            {"카페라떼",         "Cafe Latte",        "부드러운 스팀 밀크와 에스프레소의 조화. 고소하면서도 크리미한 맛이 일품입니다.", 5000, 1L, 3},
            {"카푸치노",         "Cappuccino",        "에스프레소 위에 풍성한 우유 거품을 올린 이탈리아 정통 카푸치노입니다.", 5000, 1L, 4},
            {"바닐라 라떼",      "Vanilla Latte",     "달콤한 바닐라 시럽과 에스프레소, 스팀 밀크가 어우러진 인기 메뉴입니다.", 5500, 1L, 5},
            {"카라멜 마끼아또",  "Caramel Macchiato", "바닐라 시럽, 스팀 밀크 위에 에스프레소와 카라멜 드리즐을 올린 달콤한 음료입니다.", 5500, 1L, 6},
            {"플랫화이트",       "Flat White",        "벨벳처럼 부드러운 마이크로폼 밀크와 리스트레또 에스프레소의 호주식 커피입니다.", 5000, 1L, 7},
            {"헤이즐넛 라떼",    "Hazelnut Latte",    "고소한 헤이즐넛 풍미가 가득한 라떼. 견과류 향을 좋아하시는 분께 추천드립니다.", 5500, 1L, 8},
            {"초코라떼",         "Chocolate Latte",   "진한 초콜릿과 에스프레소, 스팀 밀크의 달콤 쌉싸름한 조화입니다.", 5500, 1L, 9},
            {"바나나 라떼",      "Banana Latte",      "신선한 바나나와 우유, 에스프레소를 블렌딩한 고소하고 달콤한 라떼입니다.", 5500, 1L, 10},
            {"녹차 라떼",        "Green Tea Latte",   "국내산 녹차 파우더와 스팀 밀크로 만든 부드럽고 향긋한 라떼입니다.", 5500, 1L, 11},
            {"시그니처 블렌드",  "Signature Blend",   "NCafe만의 특별한 블렌딩 레시피로 만든 프리미엄 시그니처 커피입니다.", 6000, 1L, 12},
        };

        // 음료 (category_id = 2)
        Object[][] beverages = {
            {"얼그레이 티",    "Earl Grey Tea",       "베르가못 향이 은은하게 퍼지는 클래식 얼그레이 홍차입니다.", 4500, 2L, 1},
            {"아이스티",       "Iced Tea",            "상큼하고 시원한 아이스티. 갈증 해소에 제격인 여름 인기 음료입니다.", 4000, 2L, 2},
            {"레모네이드",     "Lemonade",            "신선한 레몬즙으로 만든 상큼 달콤한 수제 레모네이드입니다.", 4500, 2L, 3},
            {"딸기 스무디",    "Strawberry Smoothie", "신선한 딸기를 듬뿍 넣어 갈아 만든 시원하고 달콤한 스무디입니다.", 5500, 2L, 4},
            {"프라푸치노",     "Frappuccino",         "얼음과 우유, 커피를 블렌딩한 시원하고 달콤한 프로즌 음료입니다.", 6000, 2L, 5},
        };

        // 베이커리 (category_id = 3)
        Object[][] bakery = {
            {"초코 크루아상",    "Chocolate Croissant", "바삭한 크루아상 안에 진한 초콜릿이 가득. 매일 아침 직접 구워냅니다.", 4000, 3L, 1},
            {"크림치즈 베이글",  "Cream Cheese Bagel",  "쫄깃한 베이글에 풍부한 크림치즈를 듬뿍 바른 든든한 아침 메뉴입니다.", 4500, 3L, 2},
            {"비프 베이글",      "Beef Bagel",          "부드러운 소고기 패티와 신선한 채소를 넣은 푸짐한 베이글 샌드위치입니다.", 5500, 3L, 3},
        };

        // 샌드위치 (category_id = 4)
        Object[][] sandwiches = {
            {"햄치즈 샌드위치",      "Ham & Cheese Sandwich",  "클래식한 햄과 체다치즈, 신선한 야채를 겹겹이 쌓은 샌드위치입니다.", 5500, 4L, 1},
            {"스크램블에그 샌드위치", "Scrambled Egg Sandwich", "부드러운 스크램블 에그와 베이컨, 치즈를 넣은 아침 샌드위치입니다.", 5500, 4L, 2},
            {"참치 샌드위치",        "Tuna Sandwich",          "고소한 참치 샐러드와 아삭한 야채를 넣은 든든한 샌드위치입니다.", 5000, 4L, 3},
            {"터키 샌드위치",        "Turkey Sandwich",        "훈제 터키 브레스트와 아보카도, 신선한 채소의 건강한 샌드위치입니다.", 5500, 4L, 4},
        };

        // 디저트 (category_id = 5)
        Object[][] desserts = {
            {"아몬드 쿠키",      "Almond Cookie",      "바삭하면서도 고소한 아몬드가 가득 들어간 수제 쿠키입니다.", 3000, 5L, 1},
            {"버터 쿠키",        "Butter Cookie",      "풍부한 버터 향이 일품인 클래식 수제 쿠키입니다.", 3000, 5L, 2},
            {"초코칩 쿠키",      "Choco Chip Cookie",  "진한 초콜릿 칩이 듬뿍 들어간 촉촉한 아메리칸 스타일 쿠키입니다.", 3500, 5L, 3},
            {"두바이 쫀득 쿠키", "Dubai Chewy Cookie", "쫀득한 식감과 달콤함이 매력적인 두바이 스타일 프리미엄 쿠키입니다.", 4500, 5L, 4},
            {"초콜릿 무스",      "Chocolate Mousse",   "공기처럼 가볍고 진한 벨기에 초콜릿으로 만든 무스 케이크입니다.", 6000, 5L, 5},
            {"딸기 케이크",      "Strawberry Cake",    "신선한 딸기와 부드러운 생크림, 촉촉한 시트의 클래식 딸기 케이크입니다.", 6500, 5L, 6},
            {"티라미수",         "Tiramisu",           "에스프레소를 적신 레이디핑거와 마스카포네 크림의 이탈리아 정통 디저트입니다.", 6500, 5L, 7},
        };

        Object[][][] all = {coffees, beverages, bakery, sandwiches, desserts};
        for (Object[][] category : all) {
            for (Object[] menu : category) {
                jdbc.update(sql, menu[0], menu[1], menu[2], menu[3], menu[4], menu[5]);
            }
        }
    }

    private void initMenuImages() {
        String sql = "INSERT INTO menu_images (menu_id, src_url, sort_order) VALUES (?, ?, 1)";

        // 메뉴 이름 → 이미지 파일 매핑
        String[][] mapping = {
            {"에스프레소",           "espresso.png"},
            {"아메리카노",           "americano.png"},
            {"카페라떼",             "cafelatte.png"},
            {"카푸치노",             "capuchino.png"},
            {"바닐라 라떼",          "vanilla-latte.png"},
            {"카라멜 마끼아또",      "caramel-macchiato.png"},
            {"플랫화이트",           "flatwhite.png"},
            {"헤이즐넛 라떼",        "hazelnutlatte.png"},
            {"초코라떼",             "chocolatelatte.png"},
            {"바나나 라떼",          "bananalatte.png"},
            {"녹차 라떼",            "greentealatte.png"},
            {"시그니처 블렌드",      "signature.png"},
            {"얼그레이 티",          "earl-grey.png"},
            {"아이스티",             "icedtea.png"},
            {"레모네이드",           "lemonade.png"},
            {"딸기 스무디",          "strawberrysmoothie.png"},
            {"프라푸치노",           "frappuccino.png"},
            {"초코 크루아상",        "chocolate-croissant.png"},
            {"크림치즈 베이글",      "bagel-cream-cheese.png"},
            {"비프 베이글",          "beef-bagel.png"},
            {"햄치즈 샌드위치",      "ham-cheese-sandwich.png"},
            {"스크램블에그 샌드위치", "scrambled-egg-sandwich.png"},
            {"참치 샌드위치",        "tuna-sandwich.png"},
            {"터키 샌드위치",        "turkey-sandwich.png"},
            {"아몬드 쿠키",          "almond-cookie.png"},
            {"버터 쿠키",            "butter-cookie.png"},
            {"초코칩 쿠키",          "choco-chip-cookie.png"},
            {"두바이 쫀득 쿠키",     "dubai-zzondeuk-cookie.png"},
            {"초콜릿 무스",          "chocolate-mousse.png"},
            {"딸기 케이크",          "strawberry-cake.png"},
            {"티라미수",             "tiramisu.png"},
        };

        for (String[] entry : mapping) {
            Long menuId = jdbc.queryForObject(
                "SELECT id FROM menus WHERE kor_name = ?", Long.class, entry[0]);
            if (menuId != null) {
                jdbc.update(sql, menuId, entry[1]);
            }
        }
    }
}