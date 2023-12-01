import { useNavigate } from 'react-router-dom';
import styles from './SideNav.module.css';

export default function SideNav({ onClose }) {
    const navigate = useNavigate();

    return (
        <div className={styles['sidenav-overlay']}>
            <div className={styles['sidenav-backdrop']} onClick={onClose}></div>
            <div className={styles['sidenav']}>
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/catalog')}>Catalog</button>
                <button onClick={() => navigate('/create')}>Create</button>
                <button onClick={() => navigate('/about')}>About</button>
                <button onClick={() => navigate('/contact')}>Contact</button>
                <button onClick={() => navigate('/questions')}>FAQ</button>
            </div>
        </div>
    )
}