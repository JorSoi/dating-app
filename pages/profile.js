import styles from "@/styles/ProfilePage.module.css"
import NavBar from "@/components/Nav";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextAuth]";
import pool from "@/lib/db";
import InterestsList from "@/components/InterestsList";
import { useEffect, useState } from "react";

export default function profilePage({interests, adorers, session}) {

    const [location, setLocation] = useState({});
    const [profileImage, setProfileImage] = useState();


    async function locationSuccess (location) {
        const lgt = location.coords.longitude;
        const ltt = location.coords.latitude;

        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${ltt}&longitude=${lgt}&localityLanguage=en`)
        if (response.ok) {
            const data = await response.json();
            const body = {
                city: data.city,
                country: data.countryName
            }
            setLocation(body)
            const locationResponse = await fetch('/api/users/location', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })
        }
    }

    function locationError (location) {
        console.error('Location not accessible')
    } 
    
    const handleLocationClick = () => {
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
    }

    const handleImageChange = ({target}) => {
        let img = target.files[0]
        let imgURL = URL.createObjectURL(img)
        setProfileImage(imgURL);
    }

    return (
        <div className={styles.profilePage}>
            <NavBar />
            <main className={styles.profileWrapper}>
                <div className={styles.leftContainer}>
                    <div className={styles.adorerCard}>
                        <h2>Your adorers</h2>
                        <div className={styles.adorerWrapper}>
                            <Image className={`${styles.adorerImage} ${styles.image1}`} src={`/userImages/${adorers[0].image}`} height={100} width={100} alt=''/>
                            <Image className={`${styles.adorerImage} ${ styles.image2}`} src={`/userImages/${adorers[1].image}`} height={100} width={100} alt=''/>
                            <Image className={`${styles.adorerImage} ${ styles.image3}`} src={`/userImages/${adorers[2].image}`} height={100} width={100} alt=''/>
                        </div>
                        <p>Start swiping to match with them</p>
                    </div>
                    <div className={styles.settingsCard}>
                        <h2>Other Settings</h2>
                    </div>
                    <div className={styles.locationCard}>
                        <h2>Location *</h2>
     
                        {location.city ? 
                        <div className={styles.locationDisplay}>
                            <Image src={'/location.svg'} height={20} width={20} alt='' /> <p>{location.city}, {location.country}</p>
                        </div>
                        :
                        <div className={styles.locationError}>
                            <button onClick={handleLocationClick}>Activate location</button>
                        </div> }
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.profileImageWrapper}>
                        <Image src={session.user.image} height={250} width={200} />
                        <label for="imageUpload" className={styles.imageUpload} onChange={handleImageChange}>Edit Profile Picture</label>
                        <input id='imageUpload' type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleImageChange}/>
                    </div>
                    <div className={styles.profileFormWrapper}>
                        <form className={styles.profileForm}>
                            <div className={styles.nameInputWrapper}>
                                <input name='firstName' type='text' placeholder='First Name *'/>
                                <input type='text' placeholder='Last Name *'/>
                            </div>
                            <InterestsList interests={interests}/>
                            <textarea type='' placeholder='Introduce yourself *'/>
                        </form>
                    </div>
                   
                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps (ctx) {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    let interests = await pool.query("SELECT id, interest_emoji, interest_name FROM interests")
    interests = interests.rows;
    let adorers = await pool.query("SELECT  users.id, users.name, users.image FROM user_likes JOIN users ON user_likes.user_2_id = users.id WHERE user_likes.user_1_id = 1 LIMIT 3")
    adorers = adorers.rows;

    return {
      props: {
        session: session,
        interests: interests,
        adorers: adorers,
      }
    }
}