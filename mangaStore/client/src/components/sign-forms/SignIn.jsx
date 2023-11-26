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
    const { values, onChange, onSubmit } = useForm(signInSubmitHandler, formInitialstate);
    // const [errors, setErrors] = useState({});

    useEffect(() => {
        emailInputRef.current.focus();
    }, []);


    // const submitHandler = (e) => {
    //     e.preventDefault();
    //     const filteredValues = Object.values(formValues).filter(value => value.length == 0);
    //     if (filteredValues.length > 0) {
    //         setErrors(state => ({
    //             ...state,
    //             emptySpaces: 'All spaces should be filled'
    //         }))
    //     } else {
    //         if (errors.emptySpaces) {
    //             setErrors(state => ({ ...state, emptySpaces: '' }));
    //         }
    //         setFormValues(formInitialstate);
    //     }
    // }

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
                    // onBlur={nameValidator}
                    // className={errors.email && styles['input-error']}
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
                    // onBlur={nameValidator}
                    // className={errors.password && styles['input-error']}
                    />
                </div>
                <button
                    className={styles['submit-btn']}
                    type="submit"
                // disabled={Object.values(errors).some(x => x)}
                >
                    Sign In
                </button>
                {/* <p className={styles['error-message']}>{errors.emptySpaces}</p> */}
                <p className={styles['acount-text']}> Don't have an account? Then just <Link to="/sign-up" className={styles['forms-btn']}>Sign Up</Link>!</p>
            </form>
        </div>
        <Footer />
        </>
    )
}