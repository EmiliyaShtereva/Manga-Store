import { useEffect, useState } from 'react';
import * as mangaService from '../../services/mangaService';
import Footer from '../footer/Footer';
import MangaListItem from '../list-item/MangaListItem';
import NavBar from '../navbar/NavBar';
import styles from './HomePage.module.css';
import HomePageSlider from './slider/HomePageSlider';

export default function HomePage() {
    const [manga, setManga] = useState([]);
    useEffect(() => {
        mangaService.getFive()
            .then(result => setManga(result));
    }, []);
    console.log(manga)
    
    return (
        <>
            <NavBar />
            <div className={styles['manga-section']}>
                <HomePageSlider />
                <h2 className={styles['heading-text']}>Most Liked</h2>
                <div className={styles['manga-container']}>
                    {manga.map(m => (
                        <MangaListItem key={m._id} {...m} />
                    ))}
            </div>
                <h2 className={styles['heading-text']}>Most Recent</h2>
                <div className={styles['manga-container']}>
                {manga.map(m => (
                        <MangaListItem key={m._id} {...m} />
                    ))}
            </div>
                <h2 className={styles['heading-text']}>Coming Soon</h2>
                <div className={styles['manga-container']}>
                {manga.map(m => (
                        <MangaListItem key={m._id} {...m} />
                    ))}
            </div>
            </div>
            <Footer />
        </>
    )
}