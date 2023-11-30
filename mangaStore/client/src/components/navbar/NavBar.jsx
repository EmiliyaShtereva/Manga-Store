import { useContext, useState } from 'react'
import styles from './NavBar.module.css'
import { Link } from 'react-router-dom';
import SideNav from './side-nav/SideNav';
import AuthContext from '../../context/authContext';

export default function NavBar() {
    const { isAuthenticated } = useContext(AuthContext);
    const [showSideNav, setShowSideNav] = useState(false);

    const navClickHandler = () => {
        setShowSideNav(true);
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
                {!isAuthenticated
                    && (
                        <div className={styles['right']}> <Link to="/sign-in">Sign In</Link></div>
                    )}
                {isAuthenticated
                    && (
                        <>
                            <div className={styles['right']}><Link to="/logout">Logout</Link></div>
                            <div className={styles['right']}><Link to="/cart"><i className="fa fa-cart-shopping"></i></Link></div>
                            <div className={styles['right']}><Link to="/liked"><i className="fa fa-heart"></i></Link></div>
                        </>
                    )}
            </nav>

            {showSideNav && <SideNav onClose={() => setShowSideNav(false)} />}
        </>
    )
}