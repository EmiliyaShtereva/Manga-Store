import Footer from '../footer/Footer';
import NavBar from '../navbar/NavBar';
import styles from './FAQ.module.css';

export default function FAQ() {
    return (
        <>
        <NavBar />
            <div className={styles['questions-conteiner']}>
                <h1>Frequently asked questions</h1>
                <h1>For Buyers:</h1>
                <p className={styles['question']}>1. Q: How do I purchase manga on MANGA HEAVEN?</p>
                <p>A: To buy manga, simply browse our extensive catalog, select the manga you want, and proceed to checkout. Follow the prompts to complete your purchase securely.</p>
                <p className={styles['question']}>2. Q: Is my personal information secure when making a purchase?</p>
                <p>A: Yes, MANGA HEAVEN takes the security of your personal information seriously. We use advanced encryption technologies to ensure that your data is protected during transactions.</p>
                <p className={styles['question']}>3. Q: Are there any additional fees beyond the manga price?</p>
                <p>A: MANGA HEAVEN strives to keep transactions transparent. The only additional fees you may encounter are standard payment processing fees. Check our terms for more details.</p>
                <p className={styles['question']}>4. Q:  How can I track my order?</p>
                <p>A: Once your order is confirmed, you'll receive a confirmation email with a tracking link. You can use this link to monitor the status and location of your package.</p>
                <p className={styles['question']}>5. Q: What if I receive a damaged manga?</p>
                <p>A: If your manga arrives damaged, contact our customer support team with photos of the damage. We'll work with you to resolve the issue promptly.</p>
                <h1>For Sellers:</h1>
                <p className={styles['question']}>1. Q: How can I sell my manga on MANGA HEAVEN?</p>
                <p>A: To sell manga, create a seller account, list your manga with accurate details, and set your price. Your manga will be visible to our community, and interested buyers can make purchases.</p>
                <p className={styles['question']}>2. Q: Are there any fees for selling manga on MANGA HEAVEN?</p>
                <p>A: Yes, there is a small transaction fee for each successful sale. This fee helps maintain and improve the MANGA HEAVEN platform. Refer to our seller guidelines for more information.</p>
                <p className={styles['question']}>3. Q: Can I sell both new and used manga on MANGA HEAVEN?</p>
                <p>A: Absolutely! MANGA HEAVEN welcomes both new and gently used manga. Ensure to provide accurate details about the condition of your manga in your listings.</p>
                <p className={styles['question']}>4. Q:  What happens if a buyer is dissatisfied with their purchase?</p>
                <p>A: If a buyer is unsatisfied, they may initiate a return or contact our support team. As a seller, it's important to accurately represent your manga's condition to avoid potential issues.</p>
                <h1>General:</h1>
                <p className={styles['question']}>1. Q: How do I contact MANGA HEAVEN customer support?</p>
                <p>A: For any inquiries, contact our customer support team through the "Contact Us" page on the MANGA HEAVEN website.</p>
                <p className={styles['question']}>2. Q: Is MANGA HEAVEN available internationally?</p>
                <p>A: Yes, MANGA HEAVEN is accessible to users worldwide. We ship to various countries, and sellers can list their manga from different regions.</p>
            </div>
            <Footer />
        </>
    )
}