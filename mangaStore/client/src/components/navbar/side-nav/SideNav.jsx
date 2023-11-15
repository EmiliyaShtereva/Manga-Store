import { useNavigate } from 'react-router-dom';
import styles from './SideNav.module.css';

export default function SideNav({ onClose}) {
    const navigate = useNavigate();

    return (
        <div className={styles['sidenav-overlay']}>
            <div className={styles['sidenav-backdrop']} onClick={onClose}></div>
            <div className={styles['sidenav']}>
                <button onClick={() => navigate('/home')}>Home</button>
                <button>Genre</button>
                <button onClick={() => navigate('/newest')}>Newest</button>
                <button onClick={() => navigate('/ongoing')}>Ongoin</button>
                <button onClick={() => navigate('/completed')}>Completed</button>
                <button onClick={() => navigate('/about')}>About</button>
                <button onClick={() => navigate('/about')}>Contact</button>
                <button onClick={() => navigate('/questions')}>FAQ</button>
            </div>
        </div>
    )
}