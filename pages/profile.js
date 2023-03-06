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
import { isEqual } from "lodash";



export default function profilePage({interests, adorers, session, profileData}) {

    const [location, setLocation] = useState(null);
    const [profileImage, setProfileImage] = useState(profileData.image);
    const [profileImageInput, setProfileImageInput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(profileData.user_verified);
    const [initialInputValues, setInitialInputValues] = useState({});
    const [imageInputDetected, setImageInputDetected] = useState(false);
    const [disabled, setDisabled] = useState(true)



    const getInitialProfileData = () => {
        const {name, bio, age, gender} = profileData;
        const nameSplit = name.split(' ')
        setInitialInputValues({
            firstName: nameSplit[0],
            lastName: nameSplit[1],
            bio,
            age,
            gender,
        })
    }

    const handleVerification = async () => {
        try {
            if(isVerified) {
                return;
            }
            const response = await fetch(`/api/users/verify/${session.user.id}`)
            if (response.status == 200) {
                setIsVerified(true)
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
        fileReader.readAsDataURL(img);
        fileReader.onload = () => {
            if (target.files && target.files[0]) {
                setProfileImage(fileReader.result);
                setImageInputDetected(true)
            } 
        }
        
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
            console.log(form)
        } catch (err) {
            console.log(err)
        }
    }

    const handleSaveChanges = async (e) => {

        e.preventDefault();
        
        if (profileImageInput) {
            handleImageSubmit();
        }
        
        const body = {
            name: `${formik.values.firstName} ${formik.values.lastName}`,
            bio: formik.values.bio,
            age: formik.values.age,
            gender: formik.values.gender,
        }

        setInitialInputValues({
            firstName: formik.values.firstName,
            lastName: formik.values.lastName,
            bio: formik.values.bio,
            age: formik.values.age,
            gender: formik.values.gender, 
        })

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
        enableReinitialize: true,  
        initialValues: initialInputValues,
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            bio: Yup.string().required('Required'),
            age: Yup.string().required('Required'),
            gender: Yup.string().required('Required'),
        }),
        onSubmit: handleSaveChanges,     
        validateOnMount: true,        
    })

    useEffect(() => {
        getLocation();
        getInitialProfileData();
    }, [])

    useEffect(() => {

        if(imageInputDetected && Object.keys(formik.errors).length == 0) {
            setDisabled(false)
        }
        if(!isEqual(formik.initialValues, formik.values) && Object.keys(formik.errors).length == 0) {
            setDisabled(false)
        }
        console.log("something has changed")
    }, [formik.errors, formik.values, imageInputDetected])


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
                                    adorers.length == 3 && <Image key={idx} className={`${styles.adorerImage} ${styles[`image${idx+1}`]}`} src={adorer.image && adorer.image.slice(0, 5) === 'https' ? adorer.image : `/userImages/${adorer.image}`} height={900} width={900} alt=''/>
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
                            <div className={styles.ageWrapper}>
                                <input 
                                    name="age" 
                                    className={formik.errors.age ? `${styles.errorInputStyle} ${styles.ageInput}` : styles.ageInput} 
                                    type='number' 
                                    placeholder="-" 
                                    min='18' 
                                    max='99' 
                                    value={formik.values.age} 
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} 
                                />
                                <p>Age*</p>
                            </div>

                            <div className={styles.genderWrapper}>
                                <select 
                                    name="gender" 
                                    placeholder="-" 
                                    value={formik.values.gender} 
                                    onChange={formik.handleChange} 
                                    className={formik.errors.gender ? `${styles.errorInputStyle}` : null} 
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="" selected disabled hidden>Choose</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <p>Your Gender*</p>
                            </div>

                            <div className={styles.verifiedWrapper}>
                                <div className={isVerified ? `${styles.verifiedButton} ${styles.verified}` : styles.verifiedButton} onClick={handleVerification}>
                                    {isVerified ? <Image src={'/verified.svg'} height={24} width={24} alt='' /> : <Image src={'/unverified.svg'} height={24} width={24} alt='' />}
                                </div>
                                {isVerified ? <p>Verified</p> : <p>Verify</p>} 
                            </div>
                            
                        </div>

                    </div>

                    <div className={styles.locationCard}>
                        <h2>Location * <span onClick={handleLocationClick}><Image src={'/refresh.svg'} height={20} width={20} alt=''/></span></h2>
     
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
                       {profileImage && <Image src={imageInputDetected ? profileImage : `/userImages/${profileImage}`} height={250} width={200} alt=''/>}
                       {!profileImage && <Image src={'/image-placeholder.png'} height={250} width={200} alt='' />}
                       <label htmlFor="imageUpload" className={styles.imageUpload}>Change Profile Image</label>
                        <input id='imageUpload' type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleImageChange}/>
                    </div>
                    <div className={styles.profileFormWrapper}>
                        <form className={styles.profileForm} onSubmit={formik.onSubmit}>
                            <div className={styles.nameInputWrapper}>
                                <input 
                                    name='firstName' 
                                    className={formik.errors.firstName ? `${styles.errorInputStyle}` : null}
                                    type='text' 
                                    value={formik.values.firstName} 
                                    placeholder='First Name *' 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                />
                                <input 
                                    name='lastName'  
                                    className={formik.errors.lastName ? `${styles.errorInputStyle}` : null}
                                    type='text' 
                                    value={formik.values.lastName} 
                                    placeholder='Last Name *' 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <InterestsList interests={interests} profileMode={true} session={session}/>
                            <textarea 
                                name='bio' 
                                className={formik.errors.bio ? `${styles.errorInputStyle}` : null}
                                type='' 
                                placeholder='Introduce yourself *' 
                                value={formik.values.bio} 
                                onChange={formik.handleChange}
                               
                            />
                            
                            <button disabled={disabled} className={styles.formSubmit} onClick={handleSaveChanges} type='submit' >Save Changes</button>
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
    let profileData = await pool.query("SELECT id, name, age, user_verified, gender, image, bio FROM users WHERE id = $1", [session.user.id]);
    profileData = profileData.rows[0];
    
    return {
      props: {
        session: session,
        interests: interests,
        adorers: adorers,
        profileData: profileData,
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