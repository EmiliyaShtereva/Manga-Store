import { useState } from 'react'
import styles from './NavBar.module.css'
import SideNav from './SideNav';

export default function NavBar() {
    const [showSideNav, setShowSideNav] = useState(false);

    const navClickHandler = () => {
        setShowSideNav(true);
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
            <div className={styles['right']}><a href="">Sign-in</a></div>
            {/*for logged users */}
            {/* <div className={styles['right']}><a href="">Logout</a></div>
            <div className={styles['right']}><a href=""><i className="fa fa-heart"></i></a></div>
            <div className={styles['right']}><a href=""><i className="fa fa-cart-shopping"></i></a></div> */}
        </nav>

        {showSideNav && <SideNav onClose={() => setShowSideNav(false)} />}
        </div>
    )
}