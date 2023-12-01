import Footer from '../footer/Footer';
import NavBar from '../navbar/NavBar';
import styles from './About.module.css';

export default function About() {
    return (
        <>
            <NavBar />
            <div className={styles['about-conteiner']}>
                <h1>About Us</h1>
                <p>Welcome to <p className={styles['shop-name']}>MANGA HEAVEN</p>, where the vibrant world of manga comes to life! Nestled in the heart of the digital realm, we are more than just an online manga store; we are passionate curators of captivating stories, mesmerizing artwork, and boundless creativity.</p>
                <p>At <p className={styles['shop-name']}>MANGA HEAVEN</p>, we believe in the power of storytelling and the unique ability of manga to transport readers to fantastical worlds, filled with adventure, emotion, and imagination. Our virtual shelves are lined with a carefully curated collection of the finest manga from various genres, ensuring there's something for every reader, whether you're a seasoned manga enthusiast or a newcomer eager to explore this incredible art form.</p>
                <p>Why choose <p className={styles['shop-name']}>MANGA HEAVEN</p>? Here's what sets us apart:</p>
                <div className={styles['set-apart']}>
                    <p className={styles['different-text']}>User-Friendly Interface: </p>
                    <p>Our intuitive interface makes it easy to browse, buy, and sell manga. With just a few clicks, you can set up your shop or find your next favorite series.</p>
                    <p className={styles['different-text']}>Secure Transactions: </p>
                    <p>We prioritize the safety of our users. <p className={styles['shop-name']}>MANGA HEAVEN</p> ensures secure transactions, protecting both buyers and sellers throughout the entire process.</p>
                    <p className={styles['different-text']}>Community Engagement: </p>
                    <p> Connect with fellow manga enthusiasts, share recommendations, and engage in discussions about your favorite series. MangaMarket is more than just a marketplace; it's a hub for passionate manga lovers.</p>
                </div>
                <p>Whether you're embarking on a new manga journey or expanding your existing collection, <p className={styles['shop-name']}>MANGA HEAVEN</p> is your digital gateway to the enchanting world of manga. We invite you to explore, indulge, and lose yourself in the captivating stories that await you. Welcome to a universe of limitless imagination - welcome to <p className={styles['different-text']}>MANGA HEAVEN</p>.</p>
            </div>
            <Footer />
        </>
    )
}