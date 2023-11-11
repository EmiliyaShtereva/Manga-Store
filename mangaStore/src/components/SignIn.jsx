import { useEffect, useRef, useState } from 'react';
import styles from './SignIn-Up.module.css';

const formInitialstate = {
    email: '',
    password: '',
}

export default function SignIn({
    onClose,
    onSignUp
}) {
    const emailInputRef = useRef();
    const [formValues, setFormValues] = useState(formInitialstate);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        emailInputRef.current.focus();
    }, []);

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

    return (
        <div className={styles['overlay']}>
            <div className={styles['backdrop']} onClick={onClose}></div>
            <div className={styles['modal']}>
                <form className={styles['form']} onSubmit={submitHandler}>
                    <div className={styles['conteiner']}>
                        <h1 className="title">Sign In</h1>
                    </div>
                    <button className={styles['close-btn']} type="button" onClick={onClose}><i className="fa fa-xmark"></i></button>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputEmail">Email</label>
                        <input
                            ref={emailInputRef}
                            type="text"
                            id="inputEmail"
                            name="email"
                            placeholder="Email"
                            required=""
                            value={formValues.email}
                            onChange={changeHandler}
                            // onBlur={nameValidator}
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
                            required=""
                            value={formValues.email}
                            onChange={changeHandler}
                            // onBlur={nameValidator}
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
                    <p className={styles['error-message']}>{errors.emptySpaces}</p>
                    <p className={styles['acount-text']}> Don't have an account? Then just <button className={styles['forms-btn']} type="button" onClick={onSignUp}>Sign Up</button>!</p>
                </form>
            </div>
        </div>
    )
}