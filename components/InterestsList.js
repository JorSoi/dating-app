import styles from "@/styles/InterestsList.module.css"
import InterestItem from "./InterestItem";
import { useEffect, useState } from "react"

function InterestsList({interests, session, profileMode}) {

    const [activeInterests, setActiveInterests] = useState([]);

    const fetchActiveInterests = async () => {
        try {
            const response = await fetch(`/api/users/interests/${session.user.id}`)
            if (response.ok) {
                const data = await response.json();
                setActiveInterests(data);
            }
        } catch (err) {
            console.log(err)
        }
    }
    const addActiveInterest = async (interestId) => {
        const body = JSON.stringify({
            interestId: interestId,
        })
        try {
            const response = await fetch(`/api/users/interests/${session.user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            })
            if (response.ok) {
                const data = await response.json();
                setActiveInterests(data);
            }
        } catch (err) {
            console.log(err)
        }
    }


    const deleteActiveInterest = async (interestId) => {
        const body = JSON.stringify({
            interestId: interestId,
        })
        try {
            const response = await fetch(`/api/users/interests/${session.user.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            })
            if (response.ok) {
                const data = await response.json();
                setActiveInterests(data);
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (profileMode) {
            fetchActiveInterests()
        }
    }, [activeInterests])

    return (
        <div className={styles.interestsList}>
        {profileMode ? <h4>Select Interests*</h4> : <h4>Interests</h4>}
            <div className={styles.interestsWrapper}>
            {
                interests?.map((interest) => {
                    return (
                        <InterestItem key={interest.id} interest={interest} session={session} profileMode={profileMode} activeInterests={activeInterests} deleteActiveInterest={deleteActiveInterest} addActiveInterest={addActiveInterest}/>
                    )
                })
            }
            </div>
        </div>
    );
}

export default InterestsList;