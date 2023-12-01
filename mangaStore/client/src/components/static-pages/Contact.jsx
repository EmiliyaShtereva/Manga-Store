import Footer from '../footer/Footer';
import NavBar from '../navbar/NavBar';
import styles from './Contact.module.css';

export default function Contact() {
    return (
        <>
            <NavBar />
            <div className={styles['contact-conteiner']}>
                <h1>Contact Us</h1>
                <p>Welcome to <p className={styles['shop-name']}>MANGA HEAVEN</p>! We're here to assist you with any inquiries or concerns you may have. Feel free to reach out to us using the following contact information:</p>
                <div className={styles['set-apart']}>
                    <p className={styles['different-text']}>Customer Support Email:</p>
                    <p>support@mangaheaven.com</p>
                    <p className={styles['different-text']}>Customer Support Phone:</p>
                    <p>0899856485</p>
                </div>
            </div>
            <Footer />
        </>
    )
}