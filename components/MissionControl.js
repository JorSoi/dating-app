import styles from '@/styles/MissionControl.module.css'

function MissionControl({handleDislike, handleLike, userId, session}) {
    
    const profileId = session.user.id
    
    const handleDislikeClick = () => {
        handleDislike();
    }

    const handleLikeClick = () => {
        handleLike(profileId, userId);
    }

    return (
        <div className={styles.missionControl}>
            <button className={styles.dislikeButton} onClick={handleDislikeClick}>-</button>
            <div className={styles.matchWrapper}>
                <div className={styles.matchScale}>
                    75%
                </div>
                <p>Match</p>
            </div>
            <button className={styles.likeButton} onClick={handleLikeClick}>+</button>
        </div>
    );
}

export default MissionControl;