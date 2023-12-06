import { useEffect, useRef, useState } from 'react';
import styles from './Edit.module.css';
import Footer from '../../footer/Footer';
import NavBar from '../../navbar/NavBar';
import * as mangaService from '../../../services/mangaService'
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../spinner/Spinner';

export default function Edit() {
    const navigate = useNavigate();
    const nameInputRef = useRef();
    const { mangaId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        name: '',
        author: '',
        imageUrl: '',
        price: 0,
        volume: '1',
        genre: 'action',
        status: 'ongoing',
        pages: 1,
        language: '',
        synopsis: '',
    });

    useEffect(() => {
        nameInputRef.current.focus();
    }, []);

    useEffect(() => {
        setIsLoading(true);

        mangaService.getOne(mangaId)
            .then(result => {
                setValues(result);
            })
            .catch(err => {
                console.log(err);
                navigate('/something-went-wrong');
            })
            .finally(() => setIsLoading(false))
    }, [mangaId]);

    const onSubmit = (e) => {
        e.preventDefault();
        mangaService.edit(mangaId, values)
            .then(navigate(`/details/${mangaId}`))
            .catch(err => {
                console.log(err);
                navigate('/something-went-wrong');
            })
    }

    const onChange = (e) => {
        setValues(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    const nameValidator = () => {
        if (values.name.length < 1) {
            setErrors(state => ({
                ...state,
                name: 'This field is mandatory'
            }));
        } else {
            if (errors.name) {
                setErrors(state => ({ ...state, name: '' }));
            }
        }
    }

    const authorValidator = () => {
        if (values.author.length < 1) {
            setErrors(state => ({
                ...state,
                author: 'This field is mandatory'
            }));
        } else {
            if (errors.author) {
                setErrors(state => ({ ...state, author: '' }));
            }
        }
    }

    const imageValidator = () => {
        if (values.imageUrl.length < 1) {
            setErrors(state => ({
                ...state,
                imageUrl: 'This field is mandatory'
            }));
        } else {
            if (errors.imageUrl) {
                setErrors(state => ({ ...state, imageUrl: '' }));
            }
        }
    }

    const priceValidator = () => {
        if (values.price <= 0) {
            setErrors(state => ({
                ...state,
                price: 'Price should be more than 0'
            }));
        } else {
            if (errors.price) {
                setErrors(state => ({ ...state, price: '' }));
            }
        }
    }

    const pagesValidator = () => {
        if (values.pages <= 0) {
            setErrors(state => ({
                ...state,
                pages: 'Pages should be more than 0'
            }));
        } else {
            if (errors.pages) {
                setErrors(state => ({ ...state, pages: '' }));
            }
        }
    }

    const languageValidator = () => {
        if (values.language.length < 1) {
            setErrors(state => ({
                ...state,
                language: 'This field is mandatory'
            }));
        } else {
            if (errors.language) {
                setErrors(state => ({ ...state, language: '' }));
            }
        }
    }

    const synopsisValidator = () => {
        if (values.synopsis.length < 15) {
            setErrors(state => ({
                ...state,
                synopsis: 'Synopsis should have at least 15 characters'
            }));
        } else {
            if (errors.synopsis) {
                setErrors(state => ({ ...state, synopsis: '' }));
            }
        }
    }

    return (
        <>
            <NavBar />
            {isLoading && <Spinner />}
            <div className={styles['modal']}>
                <form className={styles['form']} onSubmit={onSubmit}>
                    <div className={styles['conteiner']}>
                        <h1>Edit</h1>
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputName">Name</label>
                        <input
                            ref={nameInputRef}
                            type="text"
                            id="inputName"
                            name="name"
                            placeholder="Name"
                            value={values.name}
                            onChange={onChange}
                            onBlur={nameValidator}
                            className={errors.name && styles['input-error']}
                        />
                        {errors.name && <p className={styles['error-message']}>{errors.name}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputAuthor">Author</label>
                        <input
                            type="text"
                            id="inputAuthor"
                            name="author"
                            placeholder="Author"
                            value={values.author}
                            onChange={onChange}
                            onBlur={authorValidator}
                            className={errors.author && styles['input-error']}
                        />
                        {errors.author && <p className={styles['error-message']}>{errors.author}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputImageUrl">Image URL</label>
                        <input
                            type="text"
                            id="inputImageUrl"
                            name="imageUrl"
                            placeholder="Image URL"
                            value={values.imageUrl}
                            onChange={onChange}
                            onBlur={imageValidator}
                            className={errors.imageUrl && styles['input-error']}
                        />
                        {errors.imageUrl && <p className={styles['error-message']}>{errors.imageUrl}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputPrice">Price</label>
                        <input
                            type="number"
                            id="inputPrice"
                            name="price"
                            placeholder="Price"
                            value={values.price}
                            onChange={onChange}
                            onBlur={priceValidator}
                            className={errors.price && styles['input-error']}
                        />
                        {errors.price && <p className={styles['error-message']}>{errors.price}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputVolume">Volume</label>
                        <input
                            type="number"
                            id="inputVolume"
                            name="volume"
                            placeholder="Volume"
                            value={values.volume}
                            onChange={onChange}
                        />
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputGenre">Genre</label>
                        <select
                            id="inputGenre"
                            name="genre"
                            value={values.genre}
                            onChange={onChange}
                        >
                            <option value="action">Action</option>
                            <option value="horror">Horror</option>
                            <option value="comedy">Comedy</option>
                            <option value="romance">Romance</option>
                            <option value="mystery">Mystery</option>
                            <option value="sports">Sports</option>
                        </select>
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputStatus">Status</label>
                        <select
                            id="inputStatus"
                            name="status"
                            value={values.status}
                            onChange={onChange}
                        >
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="hiatus">On Hiatus</option>
                        </select>
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputPages">Pages</label>
                        <input
                            type="number"
                            id="inputPages"
                            name="pages"
                            placeholder="Pages"
                            value={values.pages}
                            onChange={onChange}
                            onBlur={pagesValidator}
                            className={errors.pages && styles['input-error']}
                        />
                        {errors.pages && <p className={styles['error-message']}>{errors.pages}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputLanguage">Language</label>
                        <input
                            type="text"
                            id="inputLanguage"
                            name="language"
                            placeholder="Language"
                            value={values.language}
                            onChange={onChange}
                            onBlur={languageValidator}
                            className={errors.language && styles['input-error']}
                        />
                        {errors.language && <p className={styles['error-message']}>{errors.language}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputSynopsis">Synopsis</label>
                        <textarea
                            type="text"
                            id="inputSynopsis"
                            name="synopsis"
                            placeholder="Synopsis"
                            value={values.synopsis}
                            onChange={onChange}
                            onBlur={synopsisValidator}
                            className={errors.synopsis && styles['input-error']}
                        />
                        {errors.synopsis && <p className={styles['error-message']}>{errors.synopsis}</p>}
                    </div>
                    <button
                        className={styles['submit-btn']}
                        type="submit"
                        disabled={Object.values(errors).some(x => x)}
                    >
                        Edit
                    </button>
                </form>
            </div>
            <Footer />
        </>
    )
}