import styles from './Main.module.css';

export default function Main() {
    return (
        <div className={styles['hero-conteiner']}>
            <div className={styles['image-conteiner']}>
                <img src="/images/logo3.png" alt="logo" />
            </div>
            <div className={styles['hero-text']}>
                <h1>Welcome to</h1>
                <h1>Manga Heaven</h1>
                <p>Your number one place for manga</p>
            </div>
        </div>
    )
}