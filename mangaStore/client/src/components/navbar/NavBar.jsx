import { useState } from 'react'
import styles from './NavBar.module.css'
import { Link } from 'react-router-dom';
import SideNav from './side-nav/SideNav';
import SignIn from './sign-forms/SignIn';
import SignUp from './sign-forms/SignUp';

export default function NavBar() {
    const [showSideNav, setShowSideNav] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const navClickHandler = () => {
        setShowSideNav(true);
    }

    const signInClickHandler = () => {
        setShowSignIn(true);
    }

    const onSignUpCLick = () => {
        setShowSignIn(false);
        setShowSignUp(true);
    }

    const onSignInCLick = () => {
        setShowSignIn(true);
        setShowSignUp(false);
    }

    return (
        <>
            <nav className={styles['nav-bar']}>
                <button className={styles['left']} onClick={navClickHandler}><i className="fa fa-bars"></i></button>

                <div className={styles['search-container']}>
                    <form>
                        <button className={styles['left']} type="submit"><i className="fa fa-search"></i></button>
                        <input className={styles['left']} type="text" placeholder="Search.." name="search" />
                    </form>
                </div>
                <div className={styles['site-logo']}>
                    <Link to="/home">
                        <img src="/images/logo3.png" alt="logo" />
                    </Link>
                </div>
                {/* for guests */}
                <button className={styles['right']} onClick={signInClickHandler}>Sign In</button>
                {/*for logged users */}
                {/* <div className={styles['right']}><a href="">Logout</a></div>
            <div className={styles['right']}><a href=""><i className="fa fa-heart"></i></a></div>
            <div className={styles['right']}><a href=""><i className="fa fa-cart-shopping"></i></a></div> */}
            </nav>

            {showSideNav && <SideNav onClose={() => setShowSideNav(false)} />}

            {showSignIn && <SignIn onClose={() => setShowSignIn(false)} onSignUp={onSignUpCLick} />}

            {showSignUp && <SignUp onClose={() => setShowSignUp(false)} onSignIn={onSignInCLick} />}

        </>
    )
}