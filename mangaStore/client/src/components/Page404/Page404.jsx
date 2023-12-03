import Footer from "../footer/Footer";
import NavBar from "../navbar/NavBar";
import styles from "./Page404.module.css";

export default function Page404() {
    return (
        <>
            <NavBar />
            <div className={styles['page-not-found']}>
                <p>404 PAGE NOT FOUND</p>
            </div>
            <Footer />
        </>
    )
}