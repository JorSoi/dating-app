import styles from '@/styles/UserCard.module.css'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import InterestsList from './InterestsList';
import MissionControl from './MissionControl';
import MatchOverlay from './overlays/MatchOverlay';
import haversine from "haversine-distance"

export default function UserCard({user, handleDislike, handleLike, hasMatched, handleKeepSwiping, session, myProfile}) {

    const [userInterests, setUserInterests] = useState([]);
    const [userProximity, setUserProximity] = useState(null);
    
    const getUserProximity = async () => {
        try {
            const response = await fetch('/api/users/location');
            if (response.ok) {
                const data = await response.json()
                let user_1 = {
                    latitude: data.latitude, 
                    longitude: data.longitude,
                   }
                   let user_2 = {
                    latitude: user.latitude, 
                    longitude: user.longitude,
                   }
                let proximity = Math.floor(haversine(user_1, user_2)/1000)
                setUserProximity(proximity) 
                
            }
            
        } catch (err) {

        }
       

    }

    

    const fetchUserInterests = async (id) => {
        try {
            const response = await fetch(`/api/users/interests/${id}`);
            if (response.ok) {
              const data = await response.json();
              setUserInterests(data)
            }
        } catch (err) {
          console.log(err)
        }
    }

    useEffect(() => {
        fetchUserInterests(user.id);
        getUserProximity();
    }, [user])


    return (
        <div className={styles.userCard}>
            <div className={styles.profileImageWrapper}>
                {
                    user.image? <Image className={styles.profileImage} src={user.image.slice(0, 5) === 'https' ? user.image : `/userImages/${user.image}`} width={900} height={900} alt='' /> :
                    <Image className={styles.profileImage} src={'/image-placeholder.png'} width={900} height={900} alt='' />
                }
                
            </div>
            <div className={styles.profileContentWrapper}>
                <div className={styles.titleWrapper}>
                    <h1>{user?.name}, {user?.age}</h1>
                    {user.user_verified && <Image src={'/verified.svg'} height={23} width={23} alt='' /> }
                </div>
                <div className={styles.locationWrapper}>
                    <Image src={'/location.svg'} height={20} width={20} alt='' />
                    {userProximity > 1 ? <p>{user?.city} • {userProximity} km</p> : <p>{user?.city} • Nearby</p>}
                </div>
                <hr />
                <InterestsList interests={userInterests} profileMode={false}/>
                <div className={styles.bioWrapper}>
                    <h4>Introduction</h4>
                    <p>{user?.bio}</p>
                </div>
            </div>
            <MissionControl handleDislike={handleDislike} handleLike={handleLike} userId={user.id} session={session} userInterests={userInterests}/>
            <MatchOverlay userName={user.name} userImage={user.image} hasMatched={hasMatched} handleKeepSwiping={handleKeepSwiping} session={session} myProfile={myProfile}/>
        </div>
    );
}
