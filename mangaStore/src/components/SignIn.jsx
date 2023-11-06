import { useState } from 'react';
import styles from './SignIn-Up.module.css';

export default function SignIn({
    onClose
}) {
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <div className={styles['overlay']}>
            <div className={styles['backdrop']} onClick={onClose}></div>
            <div className={styles['modal']}>
                <form className={styles['form']} action="" method="">
                    <div className={styles['conteiner']}>
                        <h1 className="title">{showSignUp ? 'Sign Up' : 'Sign In'}</h1>
                    </div>
                    <button className={styles['close-btn']} onClick={onClose}><i className="fa fa-xmark"></i></button>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputEmail">Email</label>
                        <input type="text" id="inputEmail" name="email" className="form-control" placeholder="Email" required="" autofocus="" />
                    </div>
                    <div className={styles['conteiner']}>
                        <label htmlFor="inputPassword">Password</label>
                        <input type="password" id="inputPassword" name="password" className="form-control" placeholder="Password" required="" />
                    </div>
                    {showSignUp &&
                        <div className={styles['conteiner']}>
                            <label htmlFor="inputRepeatPassword">Repeat Password</label>
                            <input type="repeatPassword" id="inputRepeatPassword" name="repeatPassword" className="form-control" placeholder="Repeat password" required="" />
                        </div>
                    }
                    <button className={styles['submit-btn']} type="submit">Sign In</button>
                </form>
                {showSignUp 
                    ? <p className={styles['acount-text']}> Already have an account? Then just <button className={styles['forms-btn']} onClick={() => setShowSignUp(false)}>Sign In</button>!</p>
                    : <p className={styles['acount-text']}> Don't have an account? Then just <button className={styles['forms-btn']} onClick={() => setShowSignUp(true)}>Sign Up</button>!</p>
                    }

            </div>
        </div>
    )
}