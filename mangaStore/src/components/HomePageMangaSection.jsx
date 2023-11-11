import styles from './HomePageMangaSection.module.css';
import MangaListItem from './MangaListItem';

export default function HomePageMangaSection() {
    return (
        <>
            <div className={styles['manga-container']}>
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
            </div>
        </>
    )
}