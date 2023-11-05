import styles from './SideNav.module.css';

export default function SideNav({
    onClose
}) {
    return (
        <div className={styles['overlay']}>
            <div className={styles['backdrop']} onClick={onClose}></div>
            <div className={styles['sidenav']}>
                <button>Home</button>
                <button>Genre</button>
                <button>Newest</button>
                <button>Ongoin</button>
                <button>Finished</button>
                <button>About</button>
                <button>Contact</button>
                <button>FAQ</button>
            </div>
        </div>
    )
}