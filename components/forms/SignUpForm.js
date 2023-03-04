import styles from '@/styles/AuthForms.module.css'
import { useFormik } from 'formik';
import * as Yup from "yup";

function SignUpForm() {

    const signUpUser = () => {
        alert('form got submitted')
        console.log('form got submitted')
    }

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "hi",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            email: Yup.string().email("Incorrect Email").required('Required'),
            password: Yup.string().min(10, 'Must be at least 10 characters').required('Required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
        }),
        onSubmit: signUpUser,      
    })


    return (
        
        <div className={styles.formWrapper}>
            <form className={styles.authForm} onSubmit={formik.handleSubmit}>
            <h1>Please Sign Up </h1>
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
                className={formik.errors.password && formik.touched.password ? styles.errorInputStyle : null} 
                type='password' 
                name='password' 
                placeholder="Password*" 
                value={formik.password} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
            />
            <p className={formik.errors.password && formik.touched.password ? styles.showValidationError : styles.hideValidationError}>{formik.errors.password}</p>

            <input 
                className={formik.errors.confirmPassword && formik.touched.confirmPassword ? styles.errorInputStyle : null} 
                type='password' 
                name='confirmPassword' 
                placeholder="Confirm Password*" 
                value={formik.confirmPassword} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
            />
            <p className={formik.errors.confirmPassword && formik.touched.confirmPassword ? styles.showValidationError : styles.hideValidationError}>{formik.errors.confirmPassword}</p>
            <button type="submit">Sign Up</button>
        </form>
        </div>
        
    );
}

export default SignUpForm;