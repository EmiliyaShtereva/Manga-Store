import { useEffect, useState } from 'react';
import styles from './HomePageSlider.module.css';

export default function HomePageSlider({sliderManga}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const manga = [
        {
            image: "/images/haikyuu.jpg"
        },
        {
            image: "/images/onepunchman.jpg"
        },
        {
            image: "/images/vagabond.jpg"
        }
    ]

    const nextImage = () => {
        if (currentIndex == sliderManga.length - 1) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex(index => index + 1);
        }
    }

    const previousImage = () => {
        if (currentIndex == 0) {
            setCurrentIndex(sliderManga.length - 1);
        } else {
            setCurrentIndex(index => index - 1);
        }
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            nextImage();
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
        }
    }, [currentIndex]);

    return (
        <div className={styles['parent-container']}>
            <div className={styles['navigation-buttons']}>
                <button className={styles['previous']} onClick={previousImage}><i className="fa fa-arrow-left"></i></button>
                <button className={styles['next']} onClick={nextImage}><i className="fa fa-arrow-right"></i></button>
            </div>

            <div className={styles['slider-carousel']}>
                <div className={styles['image-container']}>
                    <img src={manga[currentIndex].image} alt={sliderManga[currentIndex]?.name} />
                </div>
                <div className={styles['text-container']}>
                    <p className={styles['status']}>{sliderManga[currentIndex]?.status}</p>
                    <h1 className={styles['image-title']}>{sliderManga[currentIndex]?.name} {sliderManga[currentIndex]?.volume}</h1>
                    <p className={styles['synopsis']}>{sliderManga[currentIndex]?.synopsis}</p>
                    <p className={styles['genre']}>{sliderManga[currentIndex]?.genre}</p>
                </div>
            </div>
        </div>

    )
}