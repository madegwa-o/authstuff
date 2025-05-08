import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

interface FormData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);
    const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error when user starts typing again
        if (errors[name as keyof FormData]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const validateEmail = (): boolean => {
        const newErrors: Partial<FormData> = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateCredentials = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateEmail()) {
            setStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateCredentials() || !agreeTerms) return;

        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // For demonstration purposes only - in a real app you would:
            // 1. Call your registration API
            // 2. Handle account creation
            // 3. Redirect user or show success message

            console.log('Registration successful', formData);
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Registration failed', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContinueWithGoogle = () => {
        // Implement Google OAuth flow
        console.log('Continue with Google clicked');
    };

    const handleContinueWithApple = () => {
        // Implement Apple sign-in flow
        console.log('Continue with Apple clicked');
    };

    return (
        <div className={styles.container}>
            <div className={styles.registerContainer}>
                <div className={styles.registerArt}>
                    <div className={styles.artOverlay}>
                        <h1>Sign Up</h1>
                        <p>
                            Join our community to discuss your interests and participate in conversations.
                        </p>
                    </div>
                </div>
                <div className={styles.registerFormContainer}>
                    <div className={styles.formWrapper}>
                        <h2>{step === 1 ? 'Sign Up' : 'Create Your Account'}</h2>

                        {step === 1 && (
                            <>
                                <div className={styles.socialLogins}>
                                    <button
                                        className={styles.socialButton}
                                        onClick={handleContinueWithGoogle}
                                    >
                                        <img src="/icons/google.svg" alt="Google" />
                                        Continue with Google
                                    </button>
                                    <button
                                        className={styles.socialButton}
                                        onClick={handleContinueWithApple}
                                    >
                                        <img src="/icons/apple.svg" alt="Apple" />
                                        Continue with Apple
                                    </button>
                                </div>

                                <div className={styles.divider}>
                                    <span>OR</span>
                                </div>

                                <form onSubmit={handleContinue} className={styles.registerForm}>
                                    <div className={styles.formGroup}>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            className={errors.email ? styles.inputError : ''}
                                        />
                                        {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
                                    </div>

                                    <button
                                        type="submit"
                                        className={styles.continueButton}
                                    >
                                        Continue
                                    </button>
                                </form>
                            </>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmit} className={styles.registerForm}>
                                <div className={styles.emailDisplay}>
                                    <span>Email</span>
                                    <p>{formData.email}</p>
                                    <button
                                        type="button"
                                        className={styles.editButton}
                                        onClick={() => setStep(1)}
                                    >
                                        Edit
                                    </button>
                                </div>

                                <div className={styles.formGroup}>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Username"
                                        className={errors.username ? styles.inputError : ''}
                                    />
                                    {errors.username && <div className={styles.errorMessage}>{errors.username}</div>}
                                </div>

                                <div className={styles.formGroup}>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className={errors.password ? styles.inputError : ''}
                                    />
                                    {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
                                </div>

                                <div className={styles.formGroup}>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm Password"
                                        className={errors.confirmPassword ? styles.inputError : ''}
                                    />
                                    {errors.confirmPassword && <div className={styles.errorMessage}>{errors.confirmPassword}</div>}
                                </div>

                                <div className={styles.termsCheckbox}>
                                    <input
                                        type="checkbox"
                                        id="agreeTerms"
                                        checked={agreeTerms}
                                        onChange={() => setAgreeTerms(!agreeTerms)}
                                    />
                                    <label htmlFor="agreeTerms">
                                        I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className={styles.signupButton}
                                    disabled={isSubmitting || !agreeTerms}
                                >
                                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                                </button>
                            </form>
                        )}

                        <div className={styles.loginPrompt}>
                            Already have an account? <Link to="/login">Log In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;