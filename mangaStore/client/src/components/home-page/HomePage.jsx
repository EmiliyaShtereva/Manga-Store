import Footer from './Footer';
import styles from './HomePage.module.css';
import HomePageSlider from './HomePageSlider';
import MangaListItem from './MangaListItem';
import NavBar from './NavBar';

export default function HomePage() {
    return (
        <>
            <NavBar />
            <div className={styles['manga-section']}>
                <HomePageSlider />
                <h2 className={styles['heading-text']}>Most Liked</h2>
                <div className={styles['manga-container']}>
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
            </div>
                <h2 className={styles['heading-text']}>Most Recent</h2>
                <div className={styles['manga-container']}>
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
            </div>
                <h2 className={styles['heading-text']}>Coming Soon</h2>
                <div className={styles['manga-container']}>
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
            </div>
            </div>
            <Footer />
        </>
    )
}