import styles from '@/styles/MatchOverlay.module.css'
import Image from 'next/image';
import { useState, useEffect } from 'react';

function MatchOverlay({userName, hasMatched, userImage, handleKeepSwiping, session}) {

const [profileImage, setProfileImage] = useState(null);

    const handleSwipeClick = () => {
        handleKeepSwiping();
    }

    const getProfileImage = async () => {
        try {
            const response = await fetch(`/api/users/profileImages/${session.user.id}`)
            if (response.ok) {
                const data = await response.json();
                setProfileImage(data.image);
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getProfileImage();
    }, [])

    return (
        <div className={hasMatched ? styles.matchOverlay : styles.displayNone}>
            <div className={styles.contentWrapper}>
                <h1>It's a match!</h1>
                <p>Can you feel the butterflies? You and {userName} have matched each other!</p>
                <div className={styles.imageWrapper}>
                    <div className={styles.imageContainer}>
                        <Image className ={styles.leftImg} src={userImage.slice(0, 5) === 'https' ? userImage : `/userImages/${userImage}`} width={200} height={400} alt="" />
                        {profileImage &&
                            <Image className ={styles.rightImg} src={profileImage.slice(0, 5) === 'https' ? profileImage : `/userImages/${profileImage}`} width={200} height={400} alt="" />
                        }
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