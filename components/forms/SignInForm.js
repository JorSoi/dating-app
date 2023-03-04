import styles from '@/styles/AuthForms.module.css';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { signIn } from 'next-auth/react'; 
import { useState, useEffect } from 'react';

function SignInForm() {

    const [signInSuccess, setSignInSuccess] = useState(null);

    async function handleCredentialSignIn (values) {
        const response = await signIn('credentials', {
            email: formik.values.email,
            password: formik.values.password,
            redirect: false,
        })
        if (!response.ok) {
            console.log(response)
            setSignInSuccess(false)
        } else {
            setSignInSuccess(true)
            window.location.replace("/");
        }
    }

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Incorrect Email").required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: handleCredentialSignIn,      
    })




    return (
        <div className={styles.formWrapper}>
            <form className={styles.authForm} onSubmit={formik.handleSubmit}>
                <h1>Please Sign In </h1>
                <input 
                    className={formik.errors.email && formik.touched.email ? styles.errorInputStyle : null} 
                    type='email' 
                    name='email' 
                    placeholder="Email*" 
                    value={formik.email} 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} 
                />
                <p className={formik.errors.email && formik.touched.email ? styles.showValidationError : styles.hideValidationError}>{formik.errors.email}</p>

                <input 
                    type='password' 
                    name='password' 
                    placeholder="Password*" 
                    value={formik.password} 
                    onChange={formik.handleChange}  
                />
                <p className={formik.errors.password && formik.touched.password ? styles.showValidationError : styles.hideValidationError}>{formik.errors.password}</p>
                <button type="submit">Sign In</button>
                {signInSuccess == false && <p className={styles.noUserFound}>Hmm... We couldn't find any user. 😢💔</p>}
            </form>
        </div>
        
    );
}

export default SignInForm;