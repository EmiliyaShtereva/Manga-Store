import { useState } from 'react'
import styles from './NavBar.module.css'
import SideNav from './SideNav';
import SignIn from './SignIn';

export default function NavBar() {
    const [showSideNav, setShowSideNav] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);
    // const [showSignUp, setShowSignUp] = useState(false);

    const navClickHandler = () => {
        setShowSideNav(true);
    }

    const signInClickHandler = () => {
        setShowSignIn(true);
    }

    return (
        <div>
        <nav className={styles['nav-bar']}>
            <button className={styles['left']} onClick={navClickHandler}><i className="fa fa-bars"></i></button>

            <div className={styles['search-container']}>
                <form>
                    <button className={styles['left']} type="submit"><i className="fa fa-search"></i></button>
                    <input className={styles['left']} type="text" placeholder="Search.." name="search" />
                </form>
            </div>
            <div className={styles['site-logo']}>
                <a href="">
                    <img src="/images/logo3.png" alt="logo" />
                </a>
            </div>
            {/* for guests */}
            <button className={styles['right']} onClick={signInClickHandler}>Sign In</button>
            {/*for logged users */}
            {/* <div className={styles['right']}><a href="">Logout</a></div>
            <div className={styles['right']}><a href=""><i className="fa fa-heart"></i></a></div>
            <div className={styles['right']}><a href=""><i className="fa fa-cart-shopping"></i></a></div> */}
        </nav>

        {showSideNav && <SideNav onClose={() => setShowSideNav(false)} />}

        {showSignIn && <SignIn onClose={() => setShowSignIn(false)} />}

        {/* {showSignUp && <SignUp onClose={() => setShowSignUp(false)} />} */}

        </div>
    )
}