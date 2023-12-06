import { useNavigate } from 'react-router-dom';
import styles from './SideNav.module.css';
import { useContext } from 'react';
import AuthContext from '../../../context/authContext';

export default function SideNav({ onClose }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className={styles['sidenav-overlay']}>
            <div className={styles['sidenav-backdrop']} onClick={onClose}></div>
            <div className={styles['sidenav']}>
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/catalog')}>Catalog</button>
                {isAuthenticated && (<button onClick={() => navigate('/create')}>Create</button>)}
                <button onClick={() => navigate('/about')}>About</button>
                <button onClick={() => navigate('/contact')}>Contact</button>
                <button onClick={() => navigate('/questions')}>FAQ</button>
            </div>
        </div>
    )
}