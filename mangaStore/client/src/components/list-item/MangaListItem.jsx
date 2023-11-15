import styles from './MangaListItem.module.css';

export default function MangaListItem({name, author, price, imageUrl}) {
    return (
        <div className={styles['card']}>
            <div className={styles['image-container']}>
                <img src={imageUrl} alt={name} />
            </div>
            <p className={styles['name']}>{name}</p>
            <p className={styles['author']}>{author}</p>
            <p className={styles['price']}>{price}</p>
        </div>
    )
}