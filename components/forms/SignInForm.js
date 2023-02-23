import styles from '@/styles/AuthForms.module.css'

function SignInForm() {
    return (
        <div className={styles.formWrapper}>
            <form className={styles.authForm}>
            <h1>Please Sign In </h1>
            <input type='email' name='email' placeholder="Email*" />
            <input type='password' name='password' placeholder="Password*" />
            <button type="submit">Sign In</button>
        </form>
        </div>
        
    );
}

export default SignInForm;