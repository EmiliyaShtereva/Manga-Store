import { useContext } from "react";
import styles from './Search.module.css';
import MangaListItem from "../../list-item/MangaListItem";
import NavBar from "../../navbar/NavBar";
import Footer from "../../footer/Footer";
import Spinner from "../../spinner/Spinner";
import AuthContext from "../../../context/authContext";

export default function Search() {
    const { searchInfo, isLoading } = useContext(AuthContext);

    return (
        <>
            <NavBar />
            <div className={styles['search-list']}>
                {isLoading && <Spinner />}
                <div className={styles['manga-container']}>
                    {searchInfo.map(s => (
                        <MangaListItem key={s._id} {...s} />
                    ))}

                    {searchInfo.length === 0 && <h1>There are no manga with this name</h1>}
                </div>
            </div>
            <Footer />
        </>
    )
}