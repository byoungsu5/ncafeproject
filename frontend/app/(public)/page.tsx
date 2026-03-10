import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
    return (
        <main className={styles.page}>
            {/* Background elements for premium feel */}
            <div className={styles.bgGlow1} />
            <div className={styles.bgGlow2} />
            <div className={styles.bgGrid} />

            <section className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.heroText}>
                        <div className={styles.badgeWrapper}>
                            <span className={styles.badge}>
                                <span className={styles.badgeDot}></span>
                                포켓몬 테마 카페
                            </span>
                        </div>
                        <h1 className={styles.title}>
                            <span className={styles.titleSmall}>세상에서 가장 귀여운 바리스타</span>
                            <span className={styles.titleEmphasis}>
                                파이리가 만들어주는 카페
                            </span>
                        </h1>
                        <p className={styles.description}>
                            세상에서 가장 귀여운 바리스타 파이리가 만들어주는 스페셜티 커피와
                            수제 디저트를 만나보세요. 따뜻한 주황빛 감성으로 하루를 따뜻하게
                            덮어줄게요.
                        </p>
                        <div className={styles.actions}>
                            <Link href="/menus" className={styles.primaryButton}>
                                카페 소개 보기
                                <span className={styles.buttonGlow}></span>
                            </Link>
                            <Link href="/menus" className={styles.secondaryButton}>
                                메뉴 구경하기
                                <span className={styles.arrow}>→</span>
                            </Link>
                        </div>

                        {/* Stats Panel */}
                        <div className={styles.statsPanel}>
                            <div className={styles.statItem}>
                                <strong className={styles.statValue}>100%</strong>
                                <span className={styles.statLabel}>최상급 원두</span>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.statItem}>
                                <strong className={styles.statValue}>50+</strong>
                                <span className={styles.statLabel}>수제 디저트</span>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.statItem}>
                                <strong className={styles.statValue}>Lv.99</strong>
                                <span className={styles.statLabel}>파이리의 불조절</span>
                            </div>
                        </div>

                    </div>

                    <div className={styles.heroVisual}>
                        <div className={styles.imageWrapper}>
                            <div className={styles.card}>
                                <div className={styles.illustration}>
                                    <Image
                                        src="/images/charmander-barista.png"
                                        alt="파이리 바리스타 일러스트"
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 480px"
                                        className={styles.heroImage}
                                        priority
                                    />
                                    {/* Decorative floating badges */}
                                    <div className={`${styles.floatingBadge} ${styles.badgeTopRight}`}>
                                        ☕ 따끈따끈
                                    </div>
                                    <div className={`${styles.floatingBadge} ${styles.badgeBottomLeft}`}>
                                        🔥 불꽃 로스팅
                                    </div>
                                </div>
                            </div>
                            {/* Decorative rings around the image */}
                            <div className={styles.ring1}></div>
                            <div className={styles.ring2}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className={styles.locationSection}>
                <div className={styles.locationInner}>
                    <div className={styles.locationText}>
                        <div className={styles.badgeWrapper}>
                            <span className={styles.badge}>
                                📍 찾아오시는 길
                            </span>
                        </div>
                        <h2 className={styles.locationTitle}>
                            화산재가 아스라이 날리는<br/>
                            <span className={styles.locationHighlight}>파이리 화산 카페</span>로 오세요!
                        </h2>
                        <p className={styles.locationDescription}>
                            꼬부기와 이상해씨도 매일 찾아오는 환상의 휴식처!<br/>
                            대자연의 숨결이 느껴지는 활화산 절경을 배경으로<br/>
                            파이리가 정성껏 내려주는 참숯 로스팅 커피를 즐겨보세요.
                        </p>
                        
                        <div className={styles.locationInfo}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>🌋</span>
                                <div>
                                    <strong className={styles.infoLabel}>주소</strong>
                                    <p className={styles.infoValue}>관동지방 홍련섬 화산 동굴 앞 절경 1번지</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>⏰</span>
                                <div>
                                    <strong className={styles.infoLabel}>영업 시간</strong>
                                    <p className={styles.infoValue}>매일 09:00 - 22:00 (용암 분출 시 휴무)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.locationVisual}>
                        <div className={styles.locationImageWrapper}>
                            <Image
                                src="/images/cafe-location.jpg"
                                alt="파이리 카페 전경"
                                fill
                                sizes="(max-width: 1024px) 100vw, 600px"
                                className={styles.locationImage}
                            />
                            <div className={styles.imageOverlay}></div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
