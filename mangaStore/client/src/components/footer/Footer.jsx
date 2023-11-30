import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <div className={styles['footer']}>
            <div className={styles['site-logo']}>
                <Link to="/">
                    <img src="/images/logo3.png" alt="logo" />
                </Link>
                <p>&copy; 2023 Manga Heaven</p>
            </div>
            <div className={styles['links']}>
                <Link to="/contact">Contact Us</Link>
                <Link to="/about">About Us</Link>
                <Link to="/questions">FAQ</Link>
                </div>
        </div>
    )
}