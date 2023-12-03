import { useEffect, useState } from 'react'
import styles from './MangaDetails.module.css'
import { useParams } from 'react-router-dom';
import * as mangaService from '../../services/mangaService';
import Footer from '../footer/Footer';
import NavBar from '../navbar/NavBar';

export default function MangaDetails() {
    const [manga, setManga] = useState({});
    const { mangaId } = useParams();

    useEffect(() => {
        mangaService.getOne(mangaId)
            .then(setManga);
    },[])

    return (
        <>
            <NavBar />
            <div className={styles['manga-details']}>
                <div className={styles['header']}>
                    <div className={styles['image-container']}>
                        <img src={manga.imageUrl} alt={manga.name} />
                    </div>
                    <div className={styles['manga-info']}>
                        <h1>{manga.name} Vol.{manga.volume}</h1>
                        <p className={styles['author']}>{manga.author}</p>
                        <div className={styles['info-container']}>
                            <p className={styles['info']}>Genre: </p> <p>{manga.genre?.charAt(0).toUpperCase() + manga.genre?.slice(1)}</p>
                        </div>
                        <div className={styles['info-container']}>
                            <p className={styles['info']}>Status: </p> <p>{manga.status?.charAt(0).toUpperCase() + manga.status?.slice(1)}</p>
                        </div>
                        <div className={styles['info-container']}>
                            <p className={styles['info']}>Pages: </p> <p>{manga.pages}</p>
                        </div>
                        <div className={styles['info-container']}>
                            <p className={styles['info']}>Language: </p> <p>{manga.language}</p>
                        </div>
                        <p className={styles['price']}>${manga.price}</p>
                        <div className={styles['buttons']}>
                            <input type="number" defaultValue={1} />
                            <button className={styles['cart']}><i className="fa fa-cart-shopping"></i> Add to cart</button>
                            <button className={styles['like']}><i className="fa fa-heart"></i> Add to liked</button>
                        </div>
                    </div>
                    <div className={styles['synopsis']}>
                        <h1>Synopsis</h1>
                        <p>{manga.synopsis}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}