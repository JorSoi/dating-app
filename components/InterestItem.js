import styles from "@/styles/InterestItem.module.css"

function InterestItem({interest, profileMode, activeInterests, deleteActiveInterest, addActiveInterest}) {

    let active = activeInterests.some((activeInterest) => {
        return activeInterest.id === interest.id;
    })

    let conditionalStyling
    if (profileMode && active == false) {
        conditionalStyling = `${styles.interestItem} ${styles.profileMode}`;
    } else if (profileMode && active) {
        conditionalStyling = `${styles.interestItem} ${styles.active}`;
    } else {
        conditionalStyling = `${styles.interestItem}`
    }

    const handleClick = () => {
        if(profileMode) {
            if (active) {
                deleteActiveInterest(interest.id)
            } else {
                addActiveInterest(interest.id)
            }
        }
    }

    return (
            <p className={conditionalStyling} onClick={handleClick}>{interest.interest_emoji}<span>{interest.interest_name}</span></p>
    );
}

export default InterestItem;