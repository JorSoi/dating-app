import styles from "@/styles/AuthOverlay.module.css";
import Link from "next/link";
import SignUpForm from "../forms/SignUpForm";
import Image from "next/image";
import SignInForm from "../forms/SignInForm";
import { useState } from "react";
import {signIn} from "next-auth/react"

function AuthOverlay() {
    const [displaySignIn, setDisplaySignIn] = useState(false);

    const handleClick = (param) => {
        if (param === 'signUp') {
            setDisplaySignIn(false);
        } else {
            setDisplaySignIn(true);
        }
        
    }

    const handleGoogleSignIn = () => {
        signIn('google', {
            callbackUrl: 'http://localhost:3000/'
        })
    }

    return (
        <div className={styles.authOverlay}>
            <div className={styles.authContainer}>
                {displaySignIn ? <SignInForm /> : <SignUpForm />}
                <hr />
                <button className={styles.googleButton} onClick={handleGoogleSignIn} type='button'>
                        <Image src='https://authjs.dev/img/providers/google.svg' width={20} height={20} alt=''/>
                            Sign In with Google
                        </button>
                        {displaySignIn ? 
                         <p>Don't have an account yet? <span onClick={() => {handleClick('signUp')}}>Sign Up</span></p> 
                        :<p>Already have an account? <span onClick={handleClick}>Sign In</span></p>}
            </div>
        </div>
    );
}

export default AuthOverlay;