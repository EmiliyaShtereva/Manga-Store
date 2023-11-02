import styles from './NavBar.module.css'

export default function NavBar() {
    return (
        <nav className={styles['nav-bar']}>
            <button className={styles['left']}><i className="fa fa-bars"></i></button>
            <div className={styles['search-container']}>
                <form>
                    <button className={styles['left']} type="submit"><i class="fa fa-search"></i></button>
                    <input className={styles['left']} type="text" placeholder="Search.." name="search" />
                </form>
            </div>
            <div className={styles['site-logo']}>
                <a href="">
                    <img src="../../public/images/logo3.png" alt="logo" />
                </a>
            </div>
            <div className={styles['right']}><a href="">Register</a></div>
            <div className={styles['right']}><a href="">Login</a></div>
            {/* <div className={styles['right']}><a href="">Logout</a></div>
            <div className={styles['right']}><a href=""><i class="fa fa-heart"></i></a></div>
            <div className={styles['right']}><a href=""><i class="fa fa-cart-shopping"></i></a></div> */}
        </nav>
    )
}