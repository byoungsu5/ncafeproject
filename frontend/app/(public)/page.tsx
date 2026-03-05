import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.dittoBadge}>✨ Cafe x 메타몽 ✨</div>
          <h1 className={styles.heroTitle}>
            매일 새로운 모습으로 변신하는
            <br />
            <span className={styles.highlight}>달콤한 몽글몽글 공간</span>
          </h1>
          <p className={styles.heroSubtitle}>
            정해진 모습은 없어요. 당신이 원하는 대로,
            <br />
            NCafe가 메타몽처럼 완벽한 공간이 되어드릴게요.
          </p>
          <div className={styles.heroCta}>
            <Link href="/menus" className={styles.ctaPrimary}>
              메타몽 메뉴 맛보기
            </Link>
            <Link href="/community" className={styles.ctaSecondary}>
              몽글몽글 커뮤니티
            </Link>
          </div>
        </div>
        <div className={styles.scrollIndicator}>
          <span>몽글몽글 더 알아보기</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>왜 NCafe일까요?</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🧘</div>
              <h3 className={styles.featureTitle}>자유로운 변신</h3>
              <p className={styles.featureDescription}>
                혼자 집중하고 싶을 땐 스터디존으로,
                친구와 수다 떨 땐 라운지로! 상황에 맞춰
                변하는 유연한 공간을 체험하세요.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🦄</div>
              <h3 className={styles.featureTitle}>유니크한 감성</h3>
              <p className={styles.featureDescription}>
                메타몽의 연보라빛 감성을 담은 유니크한
                인테리어와 소품들이 당신의 창의력을
                자극하고 기분을 몽글몽글하게 해줍니다.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🍰</div>
              <h3 className={styles.featureTitle}>스페셜 메뉴</h3>
              <p className={styles.featureDescription}>
                메타몽 푸딩부터 솜사탕 라떼까지,
                오직 NCafe에서만 만날 수 있는
                특별하고 귀여운 메뉴들이 기다립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coffee & Study Section */}
      <section className={styles.coffeeStudy}>
        <div className={styles.container}>
          <div className={styles.splitContent}>
            <div className={styles.contentLeft}>
              <div className={styles.coffeeIcon}>🟣</div>
              <h2 className={styles.contentTitle}>당신을 닮아가는<br />특별한 커피 타임</h2>
              <p className={styles.contentText}>
                우리는 모두 다르니까요. NCafe의 바리스타는
                당신의 취향에 꼭 맞춘 커스텀 커피를 만듭니다.
                오늘 당신의 기분은 어떤 색인가요?
              </p>
              <Link href="/menus" className={styles.contentLink}>
                메뉴 상세 보기 →
              </Link>
            </div>
            <div className={styles.contentRight}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>1k+</div>
                  <div className={styles.statLabel}>몽글몽글 커뮤니티원</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>Unlimited</div>
                  <div className={styles.statLabel}>공간의 확장성</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ditto Transformation Gallery */}
      <section className={styles.gallery}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>메타몽의 몽글몽글 변신 갤러리</h2>
          <div className={styles.galleryGrid}>
            <div className={styles.galleryCard}>
              <div className={styles.imageWrapper}>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png" alt="Ditto" />
              </div>
              <p>오리지널 메타몽</p>
            </div>
            <div className={styles.galleryCard}>
              <div className={styles.imageWrapper}>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png" alt="Ditto Bulbasaur" className={styles.dittoFilter} />
              </div>
              <p>이상해씨로 변신!</p>
            </div>
            <div className={styles.galleryCard}>
              <div className={styles.imageWrapper}>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png" alt="Ditto Charmander" className={styles.dittoFilter} />
              </div>
              <p>파이리로 변신!</p>
            </div>
            <div className={styles.galleryCard}>
              <div className={styles.imageWrapper}>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png" alt="Ditto Squirtle" className={styles.dittoFilter} />
              </div>
              <p>꼬부기로 변신!</p>
            </div>
            <div className={styles.galleryCard}>
              <div className={styles.imageWrapper}>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Ditto Pikachu" className={styles.dittoFilter} />
              </div>
              <p>피카츄로 변신!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>함께 변신해볼까요?</h2>
          <p className={styles.ctaText}>
            당신만의 특별한 이야기를 NCafe에서 시작하세요
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/signup" className={styles.ctaPrimary}>
              지금 바로 변신하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
