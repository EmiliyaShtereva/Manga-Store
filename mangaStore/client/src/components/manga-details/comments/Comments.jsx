import styles from './Comments.module.css';
import * as commentService from '../../../services/commentService';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useForm from '../../../hooks/useForm';
import AuthContext from '../../../context/authContext';

export default function Comments() {
    const [comment, setComment] = useState([]);
    const { username } = useContext(AuthContext);
    const { mangaId } = useParams();

    useEffect(() => {
        // setIsLoading(true);

        commentService.getAll(mangaId)
            .then(result => setComment(result))
            .catch(err => console.log(err))
        // .finally(() => setIsLoading(false));
    }, [mangaId]);

    const addCommentHandler = async () => {
        const newComment = await commentService.create({ mangaId, text: values.comment });
        newComment.owner = { username: username }
        setComment(state => [...state, { ...newComment}]);
        values.comment = '';
    }

    const { values, onChange, onSubmit } = useForm(addCommentHandler, {
        comment: '',
    })

    return (
        <>
            <div className={styles['create-comment']}>
                <label>Add new comment:</label>
                <form className={styles['form']} onSubmit={onSubmit}>
                    <textarea name="comment" value={values.comment} onChange={onChange} placeholder="Comment......"></textarea>
                    <button className={styles['btn-submit']} type="submit">Add Comment</button>
                </form>
            </div>
            <div className={styles['details-comments']}>
                <label>Comments:</label>
                <ul>
                    {comment.map(({ _id, text, owner: { username } }) => (
                        <li key={_id} className={styles['comment']}>
                            <p className={styles['username']}>{username}: </p>
                            <p>{text}</p>
                        </li>
                    ))}
                </ul>

                {comment.length === 0 && (
                    <p className={styles['no-comment']}>No comments.</p>
                )}
            </div>
        </>
    )
}