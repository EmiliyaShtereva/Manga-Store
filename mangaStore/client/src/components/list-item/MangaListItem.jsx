import { useNavigate } from 'react-router-dom';
import styles from './MangaListItem.module.css';

export default function MangaListItem({_id, name, author, price, imageUrl}) {
    const navigate = useNavigate();
    return (
        <div className={styles['card']} onClick={() => navigate(`/details/${_id}`)}>
            <div className={styles['image-container']}>
                <img src={imageUrl} alt={name} />
            </div>
            <p className={styles['name']}>{name}</p>
            <p className={styles['author']}>{author}</p>
            <p className={styles['price']}>${price}</p>
        </div>
    )
}