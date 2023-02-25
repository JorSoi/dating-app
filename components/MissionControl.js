import styles from '@/styles/MissionControl.module.css'
import { useEffect, useState } from 'react';

function MissionControl({handleDislike, handleLike, userId, session, userInterests}) {

    const [profileInterests, setProfileInterests] = useState([]);
    const [matchProbability, setMatchProbability] = useState(0)

    
    const profileId = session.user.id
     
    const handleDislikeClick = () => {
        handleDislike(); 
    }
 
    const handleLikeClick = () => {
        handleLike(profileId, userId);
    }

    const fetchProfileInterests = async () => {
        try {
            const response = await fetch(`/api/users/interests/${session.user.id}`)
            if (response.ok) {
                const data = await response.json();
                setProfileInterests(data);
                calcMatchProb();
            }
        } catch (err) {
            console.log(err)
        }
    }

    const calcMatchProb = async () => {
        let numerator = 0;
        let denominator = (userInterests.length +  profileInterests.length)/2;
        console.log(denominator);
        userInterests.forEach((interest) => {
            for(let i = 0; i < profileInterests.length; i++) {
                if(interest.id == profileInterests[i].id) {
                    numerator += 1; 
                }
                
            }
        })
        let matchProbability = Math.round((numerator/denominator)*100);
        setMatchProbability(matchProbability)
        console.log(matchProbability)
    } 

    useEffect(() => {
        fetchProfileInterests();
    }, [userInterests])  

    return (
        <div className={styles.missionControl}> 
            <button className={styles.dislikeButton} onClick={handleDislikeClick}>🤔</button>
            <div className={styles.matchWrapper}>
                <div className={styles.matchContainer}>
                    <h5>{matchProbability}% Match</h5>
                    <p>Probability</p>
                </div>
                
            </div>
            <button className={styles.likeButton} onClick={handleLikeClick}>😍</button>
        </div>
    );
}

export default MissionControl;