import styles from '@/styles/FinishProfileOverlay.module.css'
import Link from 'next/link';

function FinishProfileOverlay({profileCompleted}) {
    return (
        <div className={profileCompleted ? styles.displayNone : styles.finishProfileOverlay}>
            <div className={styles.contentWrapper}>
                <p>Please complete your profile before you start swiping.</p>
                <Link href='/profile'>Go to my Profile</Link>
            </div>
            
        </div>
    );
}

export default FinishProfileOverlay;