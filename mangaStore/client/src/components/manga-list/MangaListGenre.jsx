import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as mangaService from '../../services/mangaService';
import styles from './MangaList.module.css';
import MangaListItem from "../list-item/MangaListItem";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";

export default function MangaListGenre() {
    const { genre } = useParams();
    const [manga, setManga] = useState([]);

    useEffect(() => {
        mangaService.getAll()
            .then(result => setManga(result.filter(m => m?.genre.toLowerCase().includes(genre))));
    }, [genre]);

    return (
        <>
            <NavBar />
            <div className={styles['manga-list']}>
                <h1 className={styles['heading-text']}>{genre[0].toUpperCase() + genre.slice(1)}</h1>
                {/* <label htmlFor="gender">Gender</label>
                    <select name="gender" id="gender" value=''>
                        <option value="f">F</option>
                        <option value="m">M</option>
                    </select> */}
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