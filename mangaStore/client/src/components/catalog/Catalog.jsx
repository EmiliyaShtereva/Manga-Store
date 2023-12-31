import { useEffect, useState } from "react";
import * as mangaService from '../../services/mangaService';
import styles from './Catalog.module.css';
import MangaListItem from "../list-item/MangaListItem";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import Spinner from "../spinner/Spinner";
import { useNavigate } from "react-router-dom";

export default function Catalog() {
    const navigate = useNavigate()
    const [manga, setManga] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    let formInitialstate = {
        genre: 'all',
        status: 'all'
    }

    const [formValues, setFormValues] = useState(formInitialstate);

    useEffect(() => {
        setIsLoading(true);

        if (formValues.genre == 'all') {
            if (formValues.status == 'all') {
                mangaService.getAll()
                    .then(result => setManga(result))
                    .catch(err => {
                        console.log(err);
                        navigate('/something-went-wrong');
                    })
                    .finally(() => setIsLoading(false))
            } else {
                mangaService.getStatus(formValues.status)
                    .then(result => setManga(result))
                    .catch(err => {
                        console.log(err);
                        navigate('/something-went-wrong');
                    })
                    .finally(() => setIsLoading(false))
            }
        } else {
            if (formValues.status == 'all') {
                mangaService.getGenre(formValues.genre)
                    .then(result => setManga(result))
                    .catch(err => {
                        console.log(err);
                        navigate('/something-went-wrong');
                    })
                    .finally(() => setIsLoading(false))
            } else {
                mangaService.getGenreAndStatus(formValues.genre, formValues.status)
                    .then(result => setManga(result))
                    .catch(err => {
                        console.log(err);
                        navigate('/something-went-wrong');
                    })
                    .finally(() => setIsLoading(false))
            }
        }
    }, [formValues.genre, formValues.status]);

    const changeHandler = (e) => {
        setFormValues(state => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <>
            <NavBar />
            <div className={styles['manga-list']}>
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
                {isLoading && <Spinner />}
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