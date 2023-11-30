import { useContext, useEffect, useRef, useState } from 'react';
import styles from './SignIn-Up.module.css';
import useForm from '../../hooks/useForm';
import AuthContext from '../../context/authContext';
import { Link } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import Footer from '../footer/Footer';

const formInitialstate = {
    email: '',
    password: '',
}

export default function SignIn() {
    const emailInputRef = useRef();
    const { signInSubmitHandler } = useContext(AuthContext);
    const { errorMessage } = useContext(AuthContext);
    const { values, onChange, onSubmit } = useForm(signInSubmitHandler, formInitialstate);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        emailInputRef.current.focus();
    }, []);

    const emailValidator = () => {
        if (values.email.length < 10) {
            setErrors(state => ({
                ...state,
                email: 'This field is mandatory'
            }));
        } else {
            if (errors.email) {
                setErrors(state => ({ ...state, email: '' }));
            }
        }
    }

    const passwordValidator = () => {
        if (values.password.length < 5) {
            setErrors(state => ({
                ...state,
                password: 'This field is mandatory'
            }));
        } else {
            if (errors.password) {
                setErrors(state => ({ ...state, password: '' }));
            }
        }
    }

    return (
        <>
            <NavBar />
            <div className={styles['modal']}>
                <form className={styles['form']} onSubmit={onSubmit}>
                    <div className={styles['conteiner']}>
                        <h1 className={styles['title']}>Sign In</h1>
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputEmail">Email</label>
                        <input
                            ref={emailInputRef}
                            type="text"
                            id="inputEmail"
                            name="email"
                            placeholder="Email"
                            value={values.email}
                            onChange={onChange}
                            onBlur={emailValidator}
                            className={errors.email && styles['input-error']}
                        />
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputPassword">Password</label>
                        <input
                            type="password"
                            id="inputPassword"
                            name="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={onChange}
                            onBlur={passwordValidator}
                            className={errors.password && styles['input-error']}
                        />
                    </div>
                    <button
                        className={styles['submit-btn']}
                        type="submit"
                        disabled={Object.values(errors).some(x => x)}
                    >
                        Sign In
                    </button>
                    {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
                    <p className={styles['acount-text']}> Don't have an account? Then just <Link to="/sign-up" className={styles['forms-btn']}>Sign Up</Link>!</p>
                </form>
            </div>
            <Footer />
        </>
    )
}