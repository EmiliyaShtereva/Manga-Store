import { useContext, useEffect, useRef, useState } from 'react';
import styles from './SignIn-Up.module.css';
import AuthContext from '../../context/authContext';
import useForm from '../../hooks/useForm';
import { Link } from 'react-router-dom';
import Footer from '../footer/Footer';
import NavBar from '../navbar/NavBar';

const formInitialstate = {
    firstName: '',
    lastName: '',
    username: '',
    address: '',
    email: '',
    password: '',
    repeatPassword: '',
}

export default function SignUp() {
    const nameInputRef = useRef();
    const { signUpSubmitHandler } = useContext(AuthContext);
    const { errorMessage } = useContext(AuthContext);
    const { values, onChange, onSubmit } = useForm(signUpSubmitHandler, formInitialstate);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        nameInputRef.current.focus();
    }, []);

    const firstNameValidator = () => {
        if (values.firstName.length < 1) {
            setErrors(state => ({
                ...state,
                firstName: 'First name should have at least 1 character'
            }));
        } else {
            if (errors.firstName) {
                setErrors(state => ({ ...state, firstName: '' }));
            }
        }
    }

    const lastNameValidator = () => {
        if (values.lastName.length < 1) {
            setErrors(state => ({
                ...state,
                lastName: 'Last name should have at least 1 character'
            }));
        } else {
            if (errors.lastName) {
                setErrors(state => ({ ...state, lastName: '' }));
            }
        }
    }

    const usernameValidator = () => {
        if (values.username.length < 1) {
            setErrors(state => ({
                ...state,
                username: 'Username should have at least 1 character'
            }));
        } else {
            if (errors.username) {
                setErrors(state => ({ ...state, username: '' }));
            }
        }
    }

    const addressValidator = () => {
        if (values.address.length < 5) {
            setErrors(state => ({
                ...state,
                address: 'Address should be at least 5 characters'
            }));
        } else {
            if (errors.address) {
                setErrors(state => ({ ...state, address: '' }));
            }
        }
    }

    const emailValidator = () => {
        if (values.email.length < 10) {
            setErrors(state => ({
                ...state,
                email: 'Email should be at least 10 characters'
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
                password: 'Password should be at least 5 characters'
            }));
        } else {
            if (errors.password) {
                setErrors(state => ({ ...state, password: '' }));
            }
        }
    }

    const repeatPasswordValidator = () => {
        if (values.password !== values.repeatPassword) {
            setErrors(state => ({
                ...state,
                repeatPassword: 'Password and Repeat Password should be the same'
            }));
        } else {
            if (errors.repeatPassword) {
                setErrors(state => ({ ...state, repeatPassword: '' }));
            }
        }
    }

    return (
        <>
            <NavBar />
            <div className={styles['modal']}>
                <form className={styles['form']} onSubmit={onSubmit}>
                    <div className={styles['conteiner']}>
                        <h1>Sign Up</h1>
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputFirstName">First name</label>
                        <input
                            ref={nameInputRef}
                            type="text"
                            id="inputFirstName"
                            name="firstName"
                            placeholder="First name"
                            value={values.firstName}
                            onChange={onChange}
                            onBlur={firstNameValidator}
                            className={errors.firstName && styles['input-error']}
                        />
                        {errors.firstName && <p className={styles['error-message']}>{errors.firstName}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputLastName">Last name</label>
                        <input
                            type="text"
                            id="inputLastName"
                            name="lastName"
                            placeholder="Last name"
                            value={values.lastName}
                            onChange={onChange}
                            onBlur={lastNameValidator}
                            className={errors.lastName && styles['input-error']}
                        />
                        {errors.lastName && <p className={styles['error-message']}>{errors.lastName}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputUsername">Username</label>
                        <input
                            type="text"
                            id="inputUsername"
                            name="username"
                            placeholder="Username"
                            value={values.username}
                            onChange={onChange}
                            onBlur={usernameValidator}
                            className={errors.username && styles['input-error']}
                        />
                        {errors.username && <p className={styles['error-message']}>{errors.username}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputAddress">Address</label>
                        <input
                            type="text"
                            id="inputAddress"
                            name="address"
                            placeholder="Address"
                            value={values.address}
                            onChange={onChange}
                            onBlur={addressValidator}
                            className={errors.address && styles['input-error']}
                        />
                        {errors.address && <p className={styles['error-message']}>{errors.address}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputEmail">Email</label>
                        <input
                            type="text"
                            id="inputEmail"
                            name="email"
                            placeholder="Email"
                            value={values.email}
                            onChange={onChange}
                            onBlur={emailValidator}
                            className={errors.email && styles['input-error']}
                        />
                        {errors.email && <p className={styles['error-message']}>{errors.email}</p>}
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
                        {errors.password && <p className={styles['error-message']}>{errors.password}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputRepeatPassword">Repeat Password</label>
                        <input
                            type="password"
                            id="inputRepeatPassword"
                            name="repeatPassword"
                            placeholder="Repeat Password"
                            value={values.repeatPassword}
                            onChange={onChange}
                            onBlur={repeatPasswordValidator}
                            className={errors.repeatPassword && styles['input-error']}
                        />
                        {errors.repeatPassword && <p className={styles['error-message']}>{errors.repeatPassword}</p>}
                    </div>
                    <button
                        className={styles['submit-btn']}
                        type="submit"
                        disabled={Object.values(errors).some(x => x)}
                    >
                        Sign Up
                    </button>
                    {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
                    <p className={styles['acount-text']}>Already have an account? Then just <Link to="/sign-in" className={styles['forms-btn']}>Sign In</Link>!</p>
                </form>
            </div>
            <Footer />
        </>
    )
}