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
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/catalog')}>Catalog</button>
                <button onClick={() => navigate('/newest')}>Newest</button>
                <button onClick={() => navigate('/create')}>Create</button>
                <button onClick={() => navigate('/about')}>About</button>
                <button onClick={() => navigate('/contact')}>Contact</button>
                <button onClick={() => navigate('/questions')}>FAQ</button>
            </div>
        </div>
    )
}