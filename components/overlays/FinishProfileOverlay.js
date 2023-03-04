import styles from '@/styles/FinishProfileOverlay.module.css'
import Link from 'next/link';

function FinishProfileOverlay({profileCompleted}) {
    return (
        <div className={profileCompleted ? styles.displayNone : styles.finishProfileOverlay}>
            <div className={styles.contentWrapper}>
                <h1>Complete your profile before swiping</h1>
                <p>Make sure you have submitted all the required information on your profile settings before you start swiping.</p>
                <Link href='/profile'>Go to my Profile</Link>
            </div>
            
        </div>
    );
}

export default FinishProfileOverlay;