import { useEffect, useState } from 'react';
import styles from './HomePageSlider.module.css';

export default function HomePageSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const manga = [
        {
            name: 'Haikyuu!!',
            genre: 'Sports',
            status: 'Finished airing',
            synopsis: `Ever since having witnessed the "Little Giant" and his astonishing skills on the volleyball court, Shouyou Hinata has been bewitched by the dynamic nature of the sport. Even though his attempt to make his debut as a volleyball regular during a middle school tournament went up in flames, he longs to prove that his less-than-impressive height ceases to be a hindrance in the face of his sheer will and perseverance. When Hinata enrolls in Karasuno High School, the Little Giant's alma mater, he believes that he is one step closer to his goal of becoming a professional volleyball player. Although the school only retains a shadow of its former glory, Hinata's conviction isn't shaken until he learns that Tobio Kageyama—the prodigy who humiliated Hinata's middle school volleyball team in a crushing defeat—is now his teammate. To fulfill his desire of leaving a mark on the realm of volleyball—so often regarded as the domain of the tall and the strong—Hinata must smooth out his differences with Kageyama. Only when Hinata learns what it takes to be a part of a team will he be able to join the race to the top in earnest.`,
            image: "/images/haikyuu.jpg"
        },
        {
            name: 'Vagabond',
            genre: 'Action, Adventure, Award Winning',
            status: 'On Hiatus',
            synopsis: `In 16th-century Japan, Shinmen Takezou is a wild, rough young man, in both his appearance and his actions. His aggressive nature has won him the collective reproach and fear of his village, leading him and his best friend, Matahachi Honiden, to run away in search of something grander than provincial life. The pair enlist in the Toyotomi army, yearning for glory—but when the Toyotomi suffer a crushing defeat at the hands of the Tokugawa Clan at the Battle of Sekigahara, the friends barely make it out alive. After the two are separated, Shinmen returns home on a self-appointed mission to notify the Hon'iden family of Matahachi's survival. He instead finds himself a wanted criminal, framed for his friend's supposed murder based on his history of violence. Upon being captured, he is strung up on a tree and left to die. An itinerant monk, the distinguished Takuan Soho, takes pity on the "devil child," secretly freeing Shinmen and christening him with a new name to avoid pursuit by the authorities: Musashi Miyamoto. Vagabond is the fictitious retelling of the life of one of Japan's most renowned swordsmen, the "Sword Saint" Musashi Miyamoto—his rise from a swordsman with no desire other than to become "Invincible Under the Heavens" to an enlightened warrior who slowly learns of the importance of close friends, self-reflection, and life itself.`,
            image: "/images/vagabond.jpg"
        },
        {
            name: 'One Punch Man',
            genre: 'Action, Comedy',
            status: 'Publishing',
            synopsis: `After rigorously training for three years, the ordinary Saitama has gained immense strength which allows him to take out anyone and anything with just one punch. He decides to put his new skill to good use by becoming a hero. However, he quickly becomes bored with easily defeating monsters, and wants someone to give him a challenge to bring back the spark of being a hero. Upon bearing witness to Saitama's amazing power, Genos, a cyborg, is determined to become Saitama's apprentice. During this time, Saitama realizes he is neither getting the recognition that he deserves nor known by the people due to him not being a part of the Hero Association. Wanting to boost his reputation, Saitama decides to have Genos register with him, in exchange for taking him in as a pupil. Together, the two begin working their way up toward becoming true heroes, hoping to find strong enemies and earn respect in the process.`,
            image: "/images/onepunchman.jpg"
        }
    ]

    const nextImage = () => {
        if (currentIndex == manga.length - 1) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex(index => index + 1);
        }
    }

    const previousImage = () => {
        if (currentIndex == 0) {
            setCurrentIndex(manga.length - 1);
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
                    <img src={manga[currentIndex].image} alt={manga[currentIndex].name} />
                </div>
                <div className={styles['text-container']}>
                    <p className={styles['status']}>{manga[currentIndex].status}</p>
                    <h1 className={styles['image-title']}>{manga[currentIndex].name}</h1>
                    <p className={styles['synopsis']}>{manga[currentIndex].synopsis}</p>
                    <p className={styles['genre']}>{manga[currentIndex].genre}</p>
                </div>
            </div>
        </div>

    )
}