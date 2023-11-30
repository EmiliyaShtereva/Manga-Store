import { useEffect, useRef, useState } from 'react';
import styles from './Create.module.css';
import useForm from '../../hooks/useForm';
import Footer from '../footer/Footer';
import NavBar from '../navbar/NavBar';

const formInitialstate = {
    name: '',
    author: '',
    imageUrl: '',
    price: '',
    volume: '',
    genre: '',
    status: '',
    pages: '',
    language: '',
    synopsis: '',
}

const createSubmitHandler = () => {
    console.log('created');
}

export default function Create() {
    const nameInputRef = useRef();
    const { values, onChange, onSubmit } = useForm(createSubmitHandler, formInitialstate);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        nameInputRef.current.focus();
    }, []);

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
        if (values.price.length < 1) {
            setErrors(state => ({
                ...state,
                price: 'This field is mandatory'
            }));
        } else {
            if (errors.price) {
                setErrors(state => ({ ...state, price: '' }));
            }
        }
    }

    const genreValidator = () => {
        if (values.genre.length < 1) {
            setErrors(state => ({
                ...state,
                genre: 'This field is mandatory'
            }));
        } else {
            if (errors.genre) {
                setErrors(state => ({ ...state, genre: '' }));
            }
        }
    }

    const statusValidator = () => {
        if (values.status.length < 1) {
            setErrors(state => ({
                ...state,
                status: 'This field is mandatory'
            }));
        } else {
            if (errors.status) {
                setErrors(state => ({ ...state, status: '' }));
            }
        }
    }

    const pagesValidator = () => {
        if (values.pages.length < 1) {
            setErrors(state => ({
                ...state,
                pages: 'This field is mandatory'
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
            <div className={styles['modal']}>
                <form className={styles['form']} onSubmit={onSubmit}>
                    <div className={styles['conteiner']}>
                        <h1>Create</h1>
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
                            type="text"
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
                        <input
                            type="text"
                            id="inputGenre"
                            name="genre"
                            placeholder="Genre"
                            value={values.genre}
                            onChange={onChange}
                            onBlur={genreValidator}
                            className={errors.genre && styles['input-error']}
                        />
                        {errors.genre && <p className={styles['error-message']}>{errors.genre}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputStatus">Status</label>
                        <input
                            type="text"
                            id="inputStatus"
                            name="status"
                            placeholder="Status"
                            value={values.status}
                            onChange={onChange}
                            onBlur={statusValidator}
                            className={errors.status && styles['input-error']}
                        />
                        {errors.status && <p className={styles['error-message']}>{errors.status}</p>}
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
                        Create
                    </button>
                </form>
            </div>
            <Footer />
        </>
    )
}