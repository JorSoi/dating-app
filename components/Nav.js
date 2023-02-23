import styles from '@/styles/NavBar.module.css';
import Link from 'next/link';

export default function NavBar () {
    return (
        <nav className={styles.navBar}>
            <Link href='/'>DatingApp</Link>
            <div className={styles.rightContainer}>
                <Link href='/chats'>My Chats</Link> 
                <Link href='/profile'>My Profile</Link>
            </div>
        </nav>
    )
}