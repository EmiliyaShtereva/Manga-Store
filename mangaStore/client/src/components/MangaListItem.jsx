import styles from './MangaListItem.module.css';

export default function MangaListItem() {
    return (
        <div className={styles['card']}>
            <div className={styles['image-container']}>
                <img src="/images/vinlandSaga.jpg" alt="vinland" />
            </div>
            <p className={styles['name']}>Vinland Saga</p>
            <p className={styles['author']}>Vinland Saga</p>
            <p className={styles['price']}>$12</p>
        </div>
    )
}