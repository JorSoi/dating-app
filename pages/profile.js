import styles from "@/styles/ProfilePage.module.css"
import NavBar from "@/components/Nav";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextAuth]";
import pool from "@/lib/db";
import InterestsList from "@/components/InterestsList";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";


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

    const handleImageChange = async ({target}) => {
        let img = target.files[0]
        try {
            const body = new FormData();
            if (!img) return;
            body.append('myImage', img)
            console.log(body)
            const response = await fetch(`/api/upload`, {
                method: 'POST',

                body: body,
            })
        } catch (err) {
            console.log(err)
        }
    }

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        const body = {
            name: `${formik.values.firstName} ${formik.values.lastName}`,
            description: formik.values.description,
        }

        console.log(body)
        try {
            const response = await fetch(`/api/users/${session.user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),

            })
        } catch (err) {
            console.log(err)
        }
    }

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            description: "",
        },
        onSubmit: handleSaveChanges,        
    })

    return (
        <div className={styles.profilePage}>
            <NavBar />
            <main className={styles.profileWrapper}>
                <div className={styles.leftContainer}>
                    <div className={styles.adorerCard}>
                        <h2>Your adorers</h2>
                        <div className={styles.adorerWrapper}>
                            {
                                adorers?.map((adorer, idx) => {
                                   return (
                                    adorers.length == 3 && <Image className={`${styles.adorerImage} ${styles[`image${idx+1}`]}`} src={adorer.image.slice(0, 5) === 'https' ? adorer.image : `/userImages/${adorer.image}`} height={100} width={100} alt=''/>
                                   ) 
                                })
                            }  
                            {
                                adorers.length < 3 ? showAdorerPlaceholder() : null 
                            }          
                        </div>
                        {adorers.length < 3 ? <p>Your adorers will be displayed here soon!</p> : <p>Start swiping to match with them!</p> }
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
                        <form className={styles.profileForm} onSubmit={formik.onSubmit}>
                            <div className={styles.nameInputWrapper}>
                                <input name='firstName' type='text' value={formik.firstName} placeholder='First Name *' onChange={formik.handleChange} />
                                <input name='lastName' type='text' value={formik.lastName} placeholder='Last Name *' onChange={formik.handleChange} />
                            </div>
                            <InterestsList interests={interests} profileMode={true} session={session}/>
                            <textarea name='description' type='' placeholder='Introduce yourself *' value={formik.description} onChange={formik.handleChange} />
                            <button className={styles.formSubmit} onClick={handleSaveChanges} type='submit'>Save Changes</button>
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
    let adorers = await pool.query("SELECT  users.id, users.name, users.image FROM user_likes JOIN users ON user_likes.user_1_id = users.id WHERE user_likes.user_2_id = $1 ORDER BY like_date DESC LIMIT 3", [session.user.id])
    adorers = adorers.rows;
    
    if (!session) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }

    return {
      props: {
        session: session,
        interests: interests,
        adorers: adorers,
      }
    }
}

function showAdorerPlaceholder () {
    return (
        <>
            <Image className={`${styles.adorerImage} ${styles.image1}`} src={`/adorer_unlock_screen.png`} height={100} width={100} alt=''/>
            <Image className={`${styles.adorerImage} ${styles.image2}`} src={`/adorer_unlock_screen.png`} height={100} width={100} alt=''/>
            <Image className={`${styles.adorerImage} ${styles.image3}`} src={`/adorer_unlock_screen.png`} height={100} width={100} alt=''/>
        </>
    )
}