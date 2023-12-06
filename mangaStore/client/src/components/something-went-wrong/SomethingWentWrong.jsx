import Footer from "../footer/Footer";
import NavBar from "../navbar/NavBar";
import styles from "./SomethingWentWrong.module.css";

export default function SomethingWentWrong() {
    return (
        <>
            <NavBar />
            <div className={styles['page-not-found']}>
                <p>SOMETHING WENT WRONG, PLEASE TRY AGAIN LATER</p>
            </div>
            <Footer />
        </>
    )
}