import Link from "next/link";
import styles from "./page.module.css";
import { Coffee, MapPin, Clock, ArrowRight, Instagram, Facebook, Youtube } from "lucide-react";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logo}>NCAFE</div>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
          <Link href="/admin/menus" className={styles.navLink}>Menu</Link>
          <Link href="/location" className={styles.navLink}>Contact</Link>
        </div>
        <Link href="/admin/menus" className={styles.primaryBtn} style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
          Reserve Now
        </Link>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2000&auto=format&fit=crop"
          alt="Premium Cafe Atmosphere"
          className={styles.heroBackground}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Premium Coffee Roasters</span>
          <h1 className={styles.heroTitle}>
            Artistry in Every<br />Drip & Grain
          </h1>
          <p className={styles.heroSubtitle}>
            우리는 단순한 커피를 넘어, 당신의 일상에 영감을 주는<br />
            가장 완벽한 한 잔의 예술을 창조합니다.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/admin/menus" className={styles.primaryBtn}>
              Explore Menu <ArrowRight size={18} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
            </Link>
            <Link href="/about" className={styles.secondaryBtn}>
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Why Choose Us</span>
          <h2 className={styles.sectionHeading}>The NCafe Philosophy</h2>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Coffee size={32} />
            </div>
            <h3 className={styles.featureTitle}>Origin Selection</h3>
            <p className={styles.featureDesc}>
              전 세계 희귀 산지의 스페셜티 생두만을 고집합니다.
              산지별 고유의 테루아를 온전히 느낄 수 있도록 세심하게 로스팅합니다.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <MapPin size={32} />
            </div>
            <h3 className={styles.featureTitle}>Urban Sanctuary</h3>
            <p className={styles.featureDesc}>
              도심 속 소음을 잊게 만드는 평온한 인테리어와 조명.
              당신만의 몰입과 휴식을 위한 최적의 공간을 제공합니다.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Clock size={32} />
            </div>
            <h3 className={styles.featureTitle}>Freshly Baked</h3>
            <p className={styles.featureDesc}>
              화려함보다는 본질에 집중합니다.
              매일 아침 천연 발효종으로 구워내는 건강한 베이커리와 디저트를 경험하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Signature Section */}
      <section className={styles.signatureSection}>
        <div className={styles.signatureContainer}>
          <div className={styles.signatureImageWrapper}>
            <img
              src="https://images.unsplash.com/photo-1442120108414-42e7ea50d035?q=80&w=1200&auto=format&fit=crop"
              alt="Signature Hand Drip"
              className={styles.signatureImage}
            />
          </div>
          <div className={styles.signatureContent}>
            <span className={styles.sectionTag} style={{ color: 'var(--color-primary-300)' }}>Signature Experience</span>
            <h2 className={styles.sectionHeading} style={{ color: '#fff', marginBottom: '32px' }}>Slow Brewed Perfection</h2>
            <p className={styles.signatureQuote}>
              "기다림은 맛의 가장 필수적인 재료입니다. 우리는 한 잔을 내리는 5분의 시간을 소중히 여깁니다."
            </p>
            <p className={styles.heroSubtitle} style={{ textAlign: 'left', marginBottom: '40px' }}>
              숙련된 바리스타의 정교한 핸드 드립 서비스로 커피가 가진
              수천 가지의 아로마 노트를 직접 체험해 보세요.
            </p>
            <Link href="/admin/menus" className={styles.primaryBtn}>
              View Signature Items
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>NCAFE</div>
            <p className={styles.footerDesc}>
              Coffee is not just a drink, it's a culture and a moment of peace in a busy world.
            </p>
            <div className={styles.ctaGroup} style={{ justifyContent: 'flex-start', marginTop: '24px', gap: '12px' }}>
              <Instagram size={20} className={styles.footerLink} />
              <Facebook size={20} className={styles.footerLink} />
              <Youtube size={20} className={styles.footerLink} />
            </div>
          </div>
          <div>
            <h4 className={styles.footerHeading}>Explore</h4>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/admin/menus" className={styles.footerLink}>Menu List</Link>
            <Link href="/about" className={styles.footerLink}>Our Story</Link>
          </div>
          <div>
            <h4 className={styles.footerHeading}>Store</h4>
            <span className={styles.footerLink}>Gangnam, Seoul</span>
            <span className={styles.footerLink}>Mon - Fri: 08:00 - 22:00</span>
            <span className={styles.footerLink}>Sat - Sun: 10:00 - 21:00</span>
          </div>
          <div>
            <h4 className={styles.footerHeading}>Contact</h4>
            <span className={styles.footerLink}>02-1234-5678</span>
            <span className={styles.footerLink}>contact@ncafe.com</span>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 NCafe Premium Roasters. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
