import Footer from '../footer/Footer';
import NavBar from '../navbar/NavBar';
import styles from './FAQ.module.css';

export default function FAQ() {
    return (
        <>
        <NavBar />
            <div className={styles['questions-conteiner']}>
                <h1>Frequently asked questions</h1>
                <p className={styles['question']}>1. Q: What genres of manga do you offer in your online store?</p>
                <p>A: We pride ourselves on offering a diverse range of manga genres, including but not limited to shonen, shojo, seinen, josei, fantasy, romance, action, adventure, and more. Our goal is to cater to the varied tastes of our readers.</p>
                <p className={styles['question']}>2. Q: How do I purchase manga from your store?</p>
                <p>A: Purchasing manga from our store is easy! Simply browse our collection, select the titles you want, and add them to your cart. Once you're ready, proceed to checkout, where you can securely complete your purchase using our streamlined payment process.</p>
                <p className={styles['question']}>3. Q: Are your manga available in physical or digital format?</p>
                <p>A: We specialize in digital manga, providing readers with the convenience of accessing their favorite titles from any device. Our commitment to digital delivery ensures instant access and a clutter-free reading experience.</p>
                <p className={styles['question']}>4. Q: Do you offer any discounts or promotions?</p>
                <p>A: Absolutely! We frequently run special promotions and discounts on selected titles. Keep an eye on our website and subscribe to our newsletter to stay informed about exclusive offers, bundle deals, and limited-time discounts.</p>
                <p className={styles['question']}>5. Q: How can I stay updated on the latest manga releases?</p>
                <p>A: Stay in the loop by following our social media channels and checking our website regularly. We update our catalog with the latest manga releases, ensuring that you're always informed about the hottest titles hitting the shelves.</p>
                <p className={styles['question']}>6. Q: Can I pre-order upcoming manga releases from your store?</p>
                <p>A: Yes, you can! We offer pre-orders for highly anticipated manga releases. Secure your copy in advance, and we'll ensure that it's delivered to you on the release date, so you can be among the first to enjoy the latest adventures.</p>
                <p className={styles['question']}>7. Q: Is my personal information secure when making a purchase?</p>
                <p>A: Absolutely. We take the security and privacy of our customers seriously. Our website employs industry-standard encryption protocols to ensure that your personal information is safe and secure during the purchasing process.</p>
                <p className={styles['question']}>8. Q: Do you have a customer support service if I encounter any issues?</p>
                <p>A: Yes, we have a dedicated customer support team ready to assist you. If you encounter any issues or have questions, feel free to reach out to our support team through the contact form on our website, and we'll promptly address your concerns.</p>
                <p className={styles['question']}>9. Q: Can I access my purchased manga on multiple devices?</p>
                <p>A: Yes, you can! Once you've purchased manga from our store, you can access your digital library from multiple devices. Our platform is designed to provide a seamless reading experience, allowing you to enjoy your manga collection wherever you go.</p>
                <p className={styles['question']}>10. Q: Do you offer gift cards for your online manga store?</p>
                <p>A: Yes, we do! Gift cards are a perfect way to share the joy of manga with friends and loved ones. You can purchase digital gift cards in various denominations directly from our website.</p>
            </div>
            <Footer />
        </>
    )
}