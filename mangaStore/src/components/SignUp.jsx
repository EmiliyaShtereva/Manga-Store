import { useEffect, useRef, useState } from 'react';
import styles from './SignIn-Up.module.css';

const formInitialstate = {
    name: '',
    address: '',
    email: '',
    password: '',
    repeatPassword: '',
}

export default function SignUp({
    onClose,
    onSignIn
}) {
    const nameInputRef = useRef();
    const [formValues, setFormValues] = useState(formInitialstate);
    const [errors, setErrors] = useState({});

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
        }
    }

    const nameValidator = () => {
        if (formValues.name.length < 1) {
            setErrors(state => ({
                ...state,
                name: 'Name should have at least 1 character'
            }));
        } else {
            if (errors.name) {
                setErrors(state => ({ ...state, name: '' }));
            }
        }
    }

    const addressValidator = () => {
        if (formValues.address.length < 5) {
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
        if (formValues.email.length < 10) {
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
        if (formValues.password.length < 5) {
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
        if (formValues.password !== formValues.repeatPassword) {
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

    useEffect(() => {
        nameInputRef.current.focus();
    }, []);

    return (
        <div className={styles['overlay']}>
            <div className={styles['backdrop']} onClick={onClose}></div>
            <div className={styles['modal']}>
                <form className={styles['form']} onSubmit={submitHandler}>
                    <div className={styles['conteiner']}>
                        <h1>Sign Up</h1>
                    </div>
                    <button className={styles['close-btn']} type="button" onClick={onClose}><i className="fa fa-xmark"></i></button>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputName">Name</label>
                        <input
                            ref={nameInputRef}
                            type="text"
                            id="inputName"
                            name="name"
                            placeholder="Name"
                            required=""
                            value={formValues.name}
                            onChange={changeHandler}
                            onBlur={nameValidator}
                            className={errors.name && styles['input-error']}
                        />
                        {errors.name && <p className={styles['error-message']}>{errors.name}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputAddress">Address</label>
                        <input
                            type="text"
                            id="inputAddress"
                            name="address"
                            placeholder="Address"
                            required=""
                            value={formValues.address}
                            onChange={changeHandler}
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
                            required=""
                            value={formValues.email}
                            onChange={changeHandler}
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
                            required=""
                            value={formValues.password}
                            onChange={changeHandler}
                            onBlur={passwordValidator}
                            className={errors.password && styles['input-error']}
                        />
                        {errors.password && <p className={styles['error-message']}>{errors.password}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputRepeatPassword">Repeat Password</label>
                        <input
                            type="repeatPassword"
                            id="inputRepeatPassword"
                            name="repeatPassword"
                            placeholder="Repeat Password"
                            required=""
                            value={formValues.repeatPassword}
                            onChange={changeHandler}
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
                    <p className={styles['error-message']}>{errors.emptySpaces}</p>
                    <p className={styles['acount-text']}>Already have an account? Then just <button className={styles['forms-btn']} type="button" onClick={onSignIn}>Sign In</button>!</p>
                </form>
            </div>
        </div>
    )
}