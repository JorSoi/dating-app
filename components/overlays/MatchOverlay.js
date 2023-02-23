import styles from '@/styles/MatchOverlay.module.css'
import Image from 'next/image';

function MatchOverlay({userName, hasMatched, userImage, handleKeepSwiping, session}) {

    const handleSwipeClick = () => {
        handleKeepSwiping();
    }

    return (
        <div className={hasMatched ? styles.matchOverlay : styles.displayNone}>
            <div className={styles.contentWrapper}>
                <h1>It's a match!</h1>
                <p>Can you feel the butterflies? You and {userName} have matched each other!</p>
                <div className={styles.imageWrapper}>
                    <div className={styles.imageContainer}>
                        <Image className ={styles.leftImg} src={userImage.slice(0, 5) === 'https' ? userImage : `/userImages/${userImage}`} width={200} height={400} alt="" />
                        <Image className ={styles.rightImg} src={session.user.image} width={200} height={400} alt="" />
                    </div>
                    
                </div>
                <div className={styles.buttonWrapper}>
                    <button>Switch to Chat</button>
                    <button onClick={handleSwipeClick}>Keep Swiping</button>
                </div>
            </div>
        </div>
    );
}

export default MatchOverlay;