import { useNavigate } from 'react-router-dom';
import styles from './SideNav.module.css';
import { useState } from 'react';

export default function SideNav({ onClose }) {
    const navigate = useNavigate();
    const [showGenres, setShowGenres] = useState(false);

    const onGenreClick = () => {
        if (showGenres == false) {
            setShowGenres(true);
        } else {
            setShowGenres(false);
        }
    }

    return (
        <div className={styles['sidenav-overlay']}>
            <div className={styles['sidenav-backdrop']} onClick={onClose}></div>
            <div className={styles['sidenav']}>
                <button onClick={() => navigate('/home')}>Home</button>
                <button onClick={onGenreClick} className={!showGenres ? '' : styles['active']}>Genre</button>
                <button onClick={() => navigate('/newest')}>Newest</button>
                {/* <button onClick={() => navigate('/status/ongoing')}>Ongoin</button>
                <button onClick={() => navigate('/status/completed')}>Completed</button> */}
                <button onClick={() => navigate('/about')}>About</button>
                <button onClick={() => navigate('/contact')}>Contact</button>
                <button onClick={() => navigate('/questions')}>FAQ</button>
            </div>

            {showGenres && (
                <div className={styles['genre-sidenav']} onClick={onClose}>
                    <button onClick={() => navigate('/genre/all')}>All</button>
                    <button onClick={() => navigate('/genre/action')}>Action</button>
                    <button onClick={() => navigate('/genre/horror')}>Horror</button>
                    <button onClick={() => navigate('/genre/comedy')}>Comedy</button>
                    <button onClick={() => navigate('/genre/romance')}>Romance</button>
                    <button onClick={() => navigate('/genre/mystery')}>Mystery</button>
                    <button onClick={() => navigate('/genre/sports')}>Sports</button>
                </div>
            )}
        </div>
    )
}