import { useState } from 'react';
import Footer from '../footer/Footer';
import NavBar from '../navbar/NavBar';
import styles from './Contact.module.css';
import { useNavigate } from 'react-router-dom';

const formInitialstate = {
    name: '',
    email: '',
    message: ''
}

export default function Contact() {
    const [formValues, setFormValues] = useState(formInitialstate);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setFormValues(state => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const filteredValues = Object.values(formValues).filter(value => value.length == 0);
        if (filteredValues.length > 0) {
            setErrors(state => ({
                ...state,
                emptySpaces: 'All spaces should be filled'
            }))
        } else {
            if (errors.emptySpaces) {
                setErrors(state => ({ ...state, emptySpaces: '' }));
            }
            setFormValues(formInitialstate);
            navigate('/home');
        }
    }

    return (
        <>
            <NavBar />
            <div className={styles['contact-conteiner']}>
                <h1>Contact Us</h1>
                <p>Welcome to <p className={styles['shop-name']}>MANGA HEAVEN</p>! We're here to assist you with any inquiries or concerns you may have. Feel free to reach out to us using the following contact information:</p>
                <div className={styles['set-apart']}>
                    <p className={styles['different-text']}>Customer Support Email:</p>
                    <p>support@mangaheaven.com</p>
                    <p className={styles['different-text']}>Customer Support Phone:</p>
                    <p>0899856485</p>
                </div>

                <form className={styles['contact-form']} onSubmit={submitHandler}>
                    <h1>Get in Touch</h1>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputName">Name</label>
                        <input
                            type="text"
                            id="inputName"
                            name="name"
                            placeholder="Name"
                            value={formValues.password}
                            onChange={changeHandler}
                        />
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputEmail">Email</label>
                        <input
                            type="text"
                            id="inputEmail"
                            name="email"
                            placeholder="Email"
                            required=""
                            value={formValues.email}
                            onChange={changeHandler}
                        />
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputMessage">Message</label>
                        <textarea
                            id="inputMessage"
                            name="message"
                            rows="4"
                            cols="50"
                            placeholder="Message"
                            required=""
                            value={formValues.password}
                            onChange={changeHandler}
                        ></textarea>
                    </div>
                    <p className={styles['error-message']}>{errors.emptySpaces}</p>
                    <button
                        className={styles['submit-btn']}
                        type="submit"
                        disabled={Object.values(errors).some(x => x)}
                    >
                        Send
                    </button>
                </form>
            </div>
            <Footer />
        </>
    )
}