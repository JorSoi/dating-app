import styles from "@/styles/InterestItem.module.css"

function InterestItem({interest}) {
    return (
        <p className={styles.interestItem}>{interest.interest_emoji} {interest.interest_name}</p>
    );
}

export default InterestItem;