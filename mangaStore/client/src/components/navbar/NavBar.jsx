import { useContext, useState } from 'react'
import styles from './NavBar.module.css'
import { Link } from 'react-router-dom';
import SideNav from './side-nav/SideNav';
import AuthContext from '../../context/authContext';
import useForm from '../../hooks/useForm';

export default function NavBar() {
    const { isAuthenticated, username, searchHandler } = useContext(AuthContext);
    const [showSideNav, setShowSideNav] = useState(false);
    const { values, onChange, onSubmit } = useForm(searchHandler, {search: ''});

    const navClickHandler = () => {
        setShowSideNav(true);
    }

    return (
        <>
            <nav className={styles['nav-bar']}>
                <button className={styles['left']} onClick={navClickHandler}><i className="fa fa-bars"></i></button>

                <div className={styles['search-container']}>
                    <form onSubmit={onSubmit}>
                        <button className={styles['left']} type="submit"><i className="fa fa-search"></i></button>
                        <input className={styles['left']} value={values.search} onChange={onChange} type="text" placeholder="Search.." name="search" />
                    </form>
                </div>

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