import { useContext, useEffect, useRef, useState } from 'react';
import styles from './Purchase.module.css';
import AuthContext from '../../../context/authContext';
import Footer from '../../footer/Footer';
import NavBar from '../../navbar/NavBar';

export default function Purchase() {
    const nameInputRef = useRef();
    const { user } = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [purchased, setPurchased] = useState(false);
    const [userInfo, setUserInfo] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        email: user.email,
    });

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

    const onSubmit = (e) => {
        e.preventDefault();
        setPurchased(true)
    }

    const onChange = (e) => {
        setUserInfo(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <>
            <NavBar />
            <div className={styles['modal']}>
                <form className={styles['form']} onSubmit={onSubmit}>
                    <div className={styles['conteiner']}>
                        <h1>Purchase</h1>
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputFirstName">First name</label>
                        <input
                            ref={nameInputRef}
                            type="text"
                            id="inputFirstName"
                            name="firstName"
                            placeholder="First name"
                            value={userInfo.firstName}
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
                            value={userInfo.lastName}
                            onChange={onChange}
                            onBlur={lastNameValidator}
                            className={errors.lastName && styles['input-error']}
                        />
                        {errors.lastName && <p className={styles['error-message']}>{errors.lastName}</p>}
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputAddress">Address</label>
                        <input
                            type="text"
                            id="inputAddress"
                            name="address"
                            placeholder="Address"
                            value={userInfo.address}
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
                            value={userInfo.email}
                            onChange={onChange}
                            onBlur={emailValidator}
                            className={errors.email && styles['input-error']}
                        />
                        {errors.email && <p className={styles['error-message']}>{errors.email}</p>}
                    </div>
                    <button
                        className={styles['submit-btn']}
                        type="submit"
                        disabled={Object.values(errors).some(x => x) || purchased}
                    >
                        Purchase
                    </button>
                    {purchased && <p className={styles['purchase']}>Thank you for your purchase!</p>}
                </form>
            </div>
            <Footer />
        </>
    )
}