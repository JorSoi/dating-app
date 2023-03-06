import NavBar from "@/components/Nav"
import styles from "@/styles/Home.module.css"
import UserCard from "@/components/UserCard"
import pool from "@/lib/db"
import { useState, useEffect } from "react";
import FinishProfileOverlay from "@/components/overlays/FinishProfileOverlay";
import AuthOverlay from "@/components/overlays/AuthOverlay";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextAuth]";




export default function Home ({interests, userProfiles, session, myProfile}) {
  const [userList, setUserList] = useState(userProfiles);
  const [profileCompleted, setProfileCompleted] = useState(true);
  const [hasMatched, setHasMatched] = useState(false);
 
  const handleKeepSwiping = () => {
    setUserList((prev) => {
      return prev.slice(1)
    })
    setHasMatched(false);
  }

  const fetchMoreUsers = async () => {
    try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUserList((prev) => {
            return [...prev, ...data]
            }
          )
        }
    } catch (err) {
      console.log(err)
    }
  }
  
  const handleLike = async (user_1_id, user_2_id) => {
    try {
      let body = {
        user_1_id: user_1_id,
        user_2_id: user_2_id,
      }
      const response = await fetch(`/api/users/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
      if(response.status === 200 || response.status === 201) {
        const matchCheck = await fetch(`/api/users/likes`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        if(matchCheck.status === 200) {
          console.log('users have matched')
          setHasMatched(true);
        } else {
          console.log('users have not matched')
          setUserList((prev) => {
            return prev.slice(1)
          })
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleDislike = () => {
    setUserList((prev) => {
      return prev.slice(1)
    })
  }

  useEffect(() => { 
    if(userList.length == 1) {
      fetchMoreUsers();
      console.log('ran out of stored users. I sent a fetch request to get more.')
    }
  }, [userList])



  return (
    <div className={styles.HomePage}>
      <NavBar />
      <main className={styles.cardWrapper}>
        {session && <UserCard user={userList[0]} handleDislike={handleDislike} handleLike={handleLike} hasMatched={hasMatched} handleKeepSwiping={handleKeepSwiping} session={session} myProfile={myProfile}/>}
      </main>
      <FinishProfileOverlay profileCompleted={profileCompleted}/>
      {session? null : <AuthOverlay />}
    </div>
  )
}

export async function getServerSideProps (ctx) {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    let userProfiles;
    if(session !== null) {
      userProfiles= await pool.query("SELECT u.id, u.name, u.age, u.image, u.bio, u.user_verified, ul.latitude, ul.longitude, ul.city, ul.country FROM users u LEFT JOIN user_locations ul ON u.id = ul.user_id WHERE u.id != $1 LIMIT 20", [session.user.id]);
      userProfiles = userProfiles.rows;
    } else {
      userProfiles= await pool.query(" SELECT u.id, u.name, u.age, u.image, u.bio, u.user_verified, ul.latitude, ul.longitude, ul.city, ul.country FROM users u LEFT JOIN user_locations ul ON u.id = ul.user_id LIMIT 20;");
      userProfiles = userProfiles.rows;
    }
    
  
    return {
      props: {
        userProfiles: userProfiles,
        session: session,
      }
    }
}

