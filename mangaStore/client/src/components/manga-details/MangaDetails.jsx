import { useContext, useEffect, useState } from 'react'
import styles from './MangaDetails.module.css'
import { useNavigate, useParams } from 'react-router-dom';
import * as mangaService from '../../services/mangaService';
import Footer from '../footer/Footer';
import NavBar from '../navbar/NavBar';
import Spinner from '../spinner/Spinner';
import AuthContext from '../../context/authContext';

export default function MangaDetails() {
    const navigate = useNavigate();
    const { isAuthenticated, userId } = useContext(AuthContext);
    const [manga, setManga] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { mangaId } = useParams();

    useEffect(() => {
        setIsLoading(true);

        mangaService.getOne(mangaId)
            .then(setManga)
            .catch(err => console.log(err))
            .finally(() => setIsLoading(false))
    }, []);

    const purchaseClickHandler = () => {
        if (isAuthenticated) {
            navigate(`/purchase/${mangaId}`)
        } else {
            navigate('/sign-in')
        }
    }

    return (
        <>
            <NavBar />
            <div className={styles['manga-details']}>
                <div className={styles['header']}>
                    {isLoading && <Spinner />}
                    <div className={styles['image-container']}>
                        <img src={manga.imageUrl} alt={manga.name} />
                    </div>
                    <div className={styles['manga-info']}>
                        <h1>{manga.name} Vol.{manga.volume}</h1>
                        <p className={styles['author']}>{manga.author}</p>
                        <div className={styles['info-container']}>
                            <p className={styles['info']}>Genre: </p> <p>{manga.genre?.charAt(0).toUpperCase() + manga.genre?.slice(1)}</p>
                        </div>
                        <div className={styles['info-container']}>
                            <p className={styles['info']}>Status: </p> <p>{manga.status?.charAt(0).toUpperCase() + manga.status?.slice(1)}</p>
                        </div>
                        <div className={styles['info-container']}>
                            <p className={styles['info']}>Pages: </p> <p>{manga.pages}</p>
                        </div>
                        <div className={styles['info-container']}>
                            <p className={styles['info']}>Language: </p> <p>{manga.language}</p>
                        </div>
                        <p className={styles['price']}>${manga.price}</p>
                        <div className={styles['buttons']}>
                            {manga._ownerId == userId
                                ? (
                                <>
                                    <button className={styles['edit']}>Edit</button>
                                    <button className={styles['delete']}>Delete</button>
                                </>
                                )
                                : (<button className={styles['purchase']} onClick={purchaseClickHandler}>Purchase</button>)
                            }
                        </div>
                    </div>
                    <div className={styles['synopsis']}>
                        <h1>Synopsis</h1>
                        <p>{manga.synopsis}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}