import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../lib/api';

interface RegisterProps {
  user: { username: string } | null;
  setUser: (user: { username: string } | null) => void;
}

const Register: NextPage<RegisterProps> = ({ user, setUser }) => {
  const router = useRouter();
  const { plan } = router.query;

  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Validation schema
  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be less than 30 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  // Initial form values
  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  // Handle form submission
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setError(null);

      const response = await api.register(
        values.username,
        values.email,
        values.password
      );

      setUserId(response.user_id);
      setUserEmail(response.email);
      setRegistrationSuccess(true);

    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle navigation to verification page
  const handleContinue = () => {
    router.push({
      pathname: '/verify-email',
      query: { userId, email: userEmail }
    });
  };

  if (user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="max-w-md mx-auto">
      <Head>
        <title>Register - ContentCreator AI</title>
      </Head>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Create Your Account</h1>
        <p className="mt-2 text-text-secondary">
          Join thousands of content creators using AI to generate amazing content
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {registrationSuccess ? (
        <div className="card text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 text-success mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-text-primary mb-2">Registration Successful!</h2>

          <p className="text-text-secondary mb-6">
            We've sent a verification code to <strong>{userEmail}</strong>.<br />
            Please check your email to complete your registration.
          </p>

          <button
            onClick={handleContinue}
            className="btn-primary w-full"
          >
            Continue to Verification
          </button>

          <p className="mt-4 text-sm text-text-secondary">
            Didn't receive the email? Make sure to check your spam folder or{' '}
            <Link href={`/verify-email?userId=${userId}&email=${userEmail}`} className="text-accent">
              try another method
            </Link>.
          </p>
        </div>
      ) : (
        <div className="card">
          <Formik
            initialValues={initialValues}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">
                    Username
                  </label>
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    className="input"
                    placeholder="Enter your username"
                  />
                  <ErrorMessage name="username" component="p" className="mt-1 text-sm text-error" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="input"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="p" className="mt-1 text-sm text-error" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="input"
                    placeholder="Create a password"
                  />
                  <ErrorMessage name="password" component="p" className="mt-1 text-sm text-error" />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1">
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="input"
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-error" />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center text-sm">
            <p className="text-text-secondary">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-accent">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-accent">
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-accent">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;