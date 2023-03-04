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
import { signOut } from "next-auth/react";



export default function profilePage({interests, adorers, session}) {

    const [location, setLocation] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageInput, setProfileImageInput] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProfileImage();
        getLocation();
    }, [])

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

    const getLocation = async () => {
        try {
            const response = await fetch(`/api/users/location`)
            if (response.status === 200) {
                const data = await response.json();
                setLocation({
                    city: data.city,
                    country: data.country,
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function locationSuccess (location) {
        
        const ltt = location.coords.latitude;
        const lgt = location.coords.longitude;

        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${ltt}&longitude=${lgt}&localityLanguage=en`)
        if (response.ok) {
            const data = await response.json();
            const body = {
                latitude: ltt,
                longitude: lgt,
                city: data.city,
                country: data.countryName
            }
            setLocation(body)
            setLoading(false)
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
        setLoading(true)
    }

    const handleImageChange = async ({target}) => {
        let img = target.files[0]

        setProfileImageInput(img);
        const fileReader = new FileReader();
        fileReader.onload = function(e) {
            if (target.files && target.files[0]) {
                setProfileImage(e.target.result);
            } 
        }
        fileReader.readAsDataURL(img);
    }

    const handleImageSubmit = async () => {
        const form = new FormData();
        form.append('image', profileImageInput)
        form.append('userId', session.user.id)
        try {
            const response = await fetch(`/api/upload`, {
                method: 'POST',
                body: form,
            })
        } catch (err) {
            console.log(err)
        }
    }

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        handleImageSubmit();

        const body = {
            name: `${formik.values.firstName} ${formik.values.lastName}`,
            description: formik.values.description,
        }
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

    const handleSignOut = () => {
        signOut();
    }


    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            description: "",
        },
        onSubmit: handleSaveChanges,      
        enableReinitialize: true,
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
                                    adorers.length == 3 && <Image key={idx} className={`${styles.adorerImage} ${styles[`image${idx+1}`]}`} src={adorer.image.slice(0, 5) === 'https' ? adorer.image : `/userImages/${adorer.image}`} height={100} width={100} alt=''/>
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
                        <div className={styles.settingsWrapper}>

                        </div>
                    </div>

                    <div className={styles.locationCard}>
                        <h2>Location * <span onClick={handleLocationClick}><Image src={'/refresh.svg'} height={20} width={20} /></span></h2>
     
                        {
                        location && !loading ? 
                        <div className={styles.locationDisplay}>
                            <Image src={'/location.svg'} height={20} width={20} alt='' /> <p>{location.city}, {location.country}</p>
                        </div>
                        : null
                        }
                        { !location && !loading ? <button className={styles.locationError} onClick={handleLocationClick}>Activate location</button> : null
                        }
                       
                        {loading &&  <div className={styles.locationDisplay}>
                                        <Image src={'/location.svg'} height={20} width={20} alt='' /> <span className={styles.cityLoadingPlaceholder}></span>, <span className={styles.countryLoadingPlaceholder}></span>
                                    </div>}
                    </div>

                    <div className={styles.signOutCard}>
                        <div className={styles.signOutWrapper} onClick={handleSignOut}>
                            <p><span><Image src={'/sign-out.svg'} height={20} width={20} alt='' /></span>Sign Out</p>
                        </div>
                    </div>
                </div>


                <div className={styles.rightContainer}>
                    <div className={styles.profileImageWrapper}>
                       {profileImage && <Image src={profileImage.slice(0, 5) === 'https' ? profileImage : `/userImages/${profileImage}`} height={250} width={200} alt='' priority/>}
                       {!profileImage && <Image src={'/image-placeholder.png'} height={250} width={200} alt='' />}
                       <label htmlFor="imageUpload" className={styles.imageUpload}>Change Profile Image</label>
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
                            <button  className={styles.formSubmit} onClick={handleSaveChanges} type='submit'>Save Changes</button>
                        </form>
                    </div>
                   
                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps (ctx) {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    if (!session) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }

    let interests = await pool.query("SELECT id, interest_emoji, interest_name FROM interests")
    interests = interests.rows;
    let adorers = await pool.query("SELECT  users.id, users.name, users.image FROM user_likes JOIN users ON user_likes.user_1_id = users.id WHERE user_likes.user_2_id = $1 ORDER BY like_date DESC LIMIT 3", [session.user.id])
    adorers = adorers.rows;
    let userLocation = await pool.query("SELECT location_city from users WHERE id = $1", [session.user.id])
    userLocation = userLocation.rows;
    
    return {
      props: {
        session: session,
        interests: interests,
        adorers: adorers,
        userLocation: userLocation,
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