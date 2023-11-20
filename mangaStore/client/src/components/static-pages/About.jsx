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
                <p className={styles['different-text']}>Diverse Collection:</p>
                <p>Immerse yourself in a vast array of manga genres, from action-packed shonen and heartwarming shojo to mind-bending seinen and thought-provoking josei. Our collection spans the entire manga spectrum, catering to all tastes and preferences.</p>
                <p className={styles['different-text']}>Latest Releases: </p>
                <p>Stay ahead of the curve with our commitment to bringing you the latest manga releases hot off the presses. Explore new series, catch up on ongoing favorites, and be the first to discover hidden gems that will soon become must-reads.</p>
                <p className={styles['different-text']}>Exclusive Offers: </p>
                <p>Unlock special deals and exclusive promotions tailored for our community of manga lovers. From discounted bundles to limited-edition releases, <p className={styles['shop-name']}>MANGA HEAVEN</p> is dedicated to providing exceptional value to our customers.</p>
                <p className={styles['different-text']}>Secure and Seamless Experience:</p> 
                <p>Shop with confidence knowing that your transactions are secure and your digital library is easily accessible. Our platform is designed to provide a seamless and enjoyable manga-reading experience, free from hassles.</p>
                </div>
                <p>Whether you're embarking on a new manga journey or expanding your existing collection, <p className={styles['shop-name']}>MANGA HEAVEN</p> is your digital gateway to the enchanting world of manga. We invite you to explore, indulge, and lose yourself in the captivating stories that await you. Welcome to a universe of limitless imagination - welcome to <p className={styles['different-text']}>MANGA HEAVEN</p>.</p>
            </div>
            <Footer />
        </>
    )
}