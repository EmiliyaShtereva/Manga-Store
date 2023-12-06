import styles from './Comments.module.css';
import * as commentService from '../../../services/commentService';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useForm from '../../../hooks/useForm';
import AuthContext from '../../../context/authContext';

export default function Comments() {
    const [comment, setComment] = useState([]);
    const { isAuthenticated, username } = useContext(AuthContext);
    const { mangaId } = useParams();

    useEffect(() => {
        commentService.getAll(mangaId)
            .then(result => setComment(result))
            .catch(err => {
                console.log(err);
                navigate('/something-went-wrong');
            })
    }, [mangaId]);

    const addCommentHandler = async () => {
        const newComment = await commentService.create({ mangaId, text: values.comment });
        newComment.owner = { username: username }
        setComment(state => [...state, { ...newComment }]);
        values.comment = '';
    }

    const { values, onChange, onSubmit } = useForm(addCommentHandler, {
        comment: '',
    })

    return (
        <>
            <div className={styles['create-comment']}>
                <label>Add new comment:</label>
                {isAuthenticated
                    ? (<form className={styles['form']} onSubmit={onSubmit}>
                        <textarea name="comment" value={values.comment} onChange={onChange} placeholder="Comment......"></textarea>
                        <button className={styles['btn-submit']} type="submit">Add Comment</button>
                    </form>)
                    : (<p className={styles['no-comment']}>You have to Sign in to comment.</p>)}
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