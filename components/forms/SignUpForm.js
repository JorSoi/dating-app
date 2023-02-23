import styles from '@/styles/AuthForms.module.css'

function SignUpForm() {
    return (
        <div className={styles.formWrapper}>
            <form className={styles.authForm}>
            <h1>Please Sign Up </h1>
            <input type='email' name='email' placeholder="Email*" />
            <input type='password' name='password' placeholder="Password*" />
            <input type='password' name='confirmPassword' placeholder="Confirm Password*" />
            <button type="submit">Sign Up</button>
        </form>
        </div>
        
    );
}

export default SignUpForm;