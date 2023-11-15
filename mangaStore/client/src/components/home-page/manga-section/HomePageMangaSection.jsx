import MangaListItem from '../../list-item/MangaListItem';
import styles from './HomePageMangaSection.module.css';
import * as mangaService from '../../../services/mangaService';
import { useEffect, useState } from 'react';

export default function HomePageMangaSection() {

    return (
        <>
            <div className={styles['manga-container']}>
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
                <MangaListItem />
            </div>
        </>
    )
}