import { useEffect, useState } from 'react';
import * as mangaService from '../../services/mangaService';
import Footer from '../footer/Footer';
import MangaListItem from '../list-item/MangaListItem';
import NavBar from '../navbar/NavBar';
import styles from './HomePage.module.css';
import Main from './main/Main';
import Spinner from '../spinner/Spinner';

export default function HomePage() {
    const [manga, setManga] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setIsLoading(true);

        mangaService.getLatest()
            .then(result => setManga(result))
            .catch(err => {
                console.log(err);
                navigate('/something-went-wrong');
            })
            .finally(() => setIsLoading(false))
    }, []);

    return (
        <>
            <NavBar />
            <div className={styles['manga-section']}>
                <Main />
                <h2 className={styles['heading-text']}>Latest Manga</h2>
                {isLoading && <Spinner />}
                <div className={styles['manga-container']}>
                    {manga.map(m => (
                        <MangaListItem key={m._id} {...m} />
                    ))}

                    {manga.length === 0 && <h1>There are no manga</h1>}
                </div>
            </div>
            <Footer />
        </>
    )
}