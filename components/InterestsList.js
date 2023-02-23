import styles from "@/styles/InterestsList.module.css"
import InterestItem from "./InterestItem";

function InterestsList({interests}) {
    return (
        <div className={styles.interestsList}>
        <h4>Interests</h4>
            <div className={styles.interestsWrapper}>
            {
                interests?.map((interest) => {
                    return (
                        <InterestItem key={interest.id} interest={interest} />
                    )
                })
            }
            </div>
        </div>
    );
}

export default InterestsList;