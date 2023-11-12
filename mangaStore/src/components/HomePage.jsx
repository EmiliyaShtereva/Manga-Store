import Footer from './Footer';
import styles from './HomePage.module.css';
import HomePageMangaSection from './HomePageMangaSection';
import HomePageSlider from './HomePageSlider';
import NavBar from './NavBar';

export default function HomePage() {
    return (
        <>
            <NavBar />
            <div className={styles['manga-section']}>
                <HomePageSlider />
                <h2 className={styles['heading-text']}>Most Liked</h2>
                <HomePageMangaSection />
                <h2 className={styles['heading-text']}>Most Recent</h2>
                <HomePageMangaSection />
                <h2 className={styles['heading-text']}>Coming Soon</h2>
                <HomePageMangaSection />
            </div>
            <Footer />
        </>
    )
}