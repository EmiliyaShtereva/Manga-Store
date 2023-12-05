import { useContext, useState } from 'react'
import styles from './NavBar.module.css'
import { Link } from 'react-router-dom';
import SideNav from './side-nav/SideNav';
import AuthContext from '../../context/authContext';

export default function NavBar() {
    const { isAuthenticated, username } = useContext(AuthContext);
    const [showSideNav, setShowSideNav] = useState(false);

    const navClickHandler = () => {
        setShowSideNav(true);
    }

    return (
        <>
            <nav className={styles['nav-bar']}>
                <button className={styles['left']} onClick={navClickHandler}><i className="fa fa-bars"></i></button>
                <div className={styles['site-logo']}>
                    <Link to="/">
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
                            <div className={styles['right']}><p>Welcome, {username}</p></div>
                        </>
                    )}
            </nav>

            {showSideNav && <SideNav onClose={() => setShowSideNav(false)} />}
        </>
    )
}