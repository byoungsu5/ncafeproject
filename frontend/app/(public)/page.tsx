import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.heroText}>
                        <span className={styles.badge}>포켓몬 테마 카페</span>
                        <h1 className={styles.title}>
                            <span className={styles.titleSmall}>세상에서 가장 귀여운 바리스타</span>
                            <span className={styles.titleEmphasis}>고라파덕이 서빙해주는 카페</span>
                        </h1>
                        <p className={styles.description}>
                            세상에서 가장 귀여운 바리스타 파이리가가 만들어주는 스페셜티 커피와
                            수제 디저트를 만나보세요. 따뜻한 주황빛 감성으로 하루를 따뜻하게
                            덮어줄게요.
                        </p>
                        <div className={styles.actions}>
                            <Link href="/menus" className={styles.primaryButton}>
                                카페 소개 보기
                            </Link>
                            <Link href="/menus" className={styles.secondaryButton}>
                                메뉴 구경하기 →
                            </Link>
                        </div>
                    </div>

                    <div className={styles.heroVisual}>
                        <div className={styles.card}>
                            <div className={styles.illustration}>
                                <Image
                                    src="/images/charmander-barista.png"
                                    alt="파이리 바리스타 일러스트"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 480px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
