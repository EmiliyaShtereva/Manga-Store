import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as mangaService from '../../services/mangaService';
import styles from './MangaList.module.css';
import MangaListItem from "../list-item/MangaListItem";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";

export default function MangaList() {
    const navigate = useNavigate();
    // const { genre } = useParams();
    const [manga, setManga] = useState([]);

    let formInitialstate = {
        genre: 'all',
        status: 'all'
    }

    const [formValues, setFormValues] = useState(formInitialstate);

    useEffect(() => {
        // setFormValues(state => ({
        //     ...state,
        // }));

        if (formValues.genre == 'all') {
            if (formValues.status == 'all') {
                mangaService.getAll()
                    .then(result => setManga(result));
            } else {
                mangaService.getAll()
                    .then(result => setManga(result.filter(m => m.status.toLowerCase().includes(formValues.status))));
            }
        } else {
            if (formValues.status == 'all') {
                mangaService.getAll()
                    .then(result => setManga(
                        result
                            .filter(m => m?.genre.toLowerCase().includes(genre))
                    ));
            } else {
                mangaService.getAll()
                    .then(result => setManga(
                        result
                            .filter(m => m?.genre.toLowerCase().includes(genre))
                            .filter(m => m.status.toLowerCase().includes(formValues.status))
                    ));
            }
        }
    }, [formValues.genre, formValues.status]);

    const changeHandler = (e) => {
        setFormValues(state => ({
            ...state,
            [e.target.name]: e.target.value,
        }));

        // if (e.target.name == 'genre') {
        //     navigate(`/genre/${e.target.value}`);
        // }
    };

    return (
        <>
            <NavBar />
            <div className={styles['manga-list']}>
                <h1 className={styles['heading-text']}>{formValues.genre}</h1>
                <div className={styles['selector']}>
                    <label htmlFor="genre">Genre:</label>
                    <select name="genre" id="genre" onChange={changeHandler} value={formValues.genre}>
                        <option value="all">All</option>
                        <option value="action">Action</option>
                        <option value="horror">Horror</option>
                        <option value="comedy">Comedy</option>
                        <option value="romance">Romance</option>
                        <option value="mystery">Mystery</option>
                        <option value="sports">Sports</option>
                    </select>

                    <label htmlFor="status">Status:</label>
                    <select name="status" id="status" onChange={changeHandler} value={formValues.status}>
                        <option value="all">All</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="hiatus">On Hiatus</option>
                    </select>
                </div>
                <div className={styles['manga-container']}>
                    {manga.map(m => (
                        <MangaListItem key={m._id} {...m} />
                    ))}

                    {manga.length === 0 && <h1>There are no manga for this category</h1>}
                </div>
            </div>
            <Footer />
        </>
    )
}