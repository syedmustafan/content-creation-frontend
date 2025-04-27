import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../lib/api';

interface LoginProps {
  user: { username: string } | null;
  setUser: (user: { username: string } | null) => void;
}

const Login: NextPage<LoginProps> = ({ user, setUser }) => {
  const router = useRouter();
  const { redirect } = router.query;

  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<{
    userId: number;
    email: string;
  } | null>(null);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      router.push(typeof redirect === 'string' ? redirect : '/dashboard');
    }
  }, [user, router, redirect]);

  // Validation schema
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  // Initial form values
  const initialValues = {
    username: '',
    password: '',
  };

  // Handle form submission
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setError(null);
      setNeedsVerification(false);

      const response = await api.login(values.username, values.password);

      // Save token and set user
      localStorage.setItem('auth_token', response.token);
      setUser({
        username: response.username,
      });

      // Redirect
      router.push(typeof redirect === 'string' ? redirect : '/dashboard');
    } catch (error: any) {
      if (error.response?.data?.needs_verification) {
        // User exists but needs email verification
        setNeedsVerification(true);
        setVerificationData({
          userId: error.response.data.user_id,
          email: error.response.data.email,
        });
      } else {
        setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle continue to verification
  const handleContinueToVerification = () => {
    if (verificationData) {
      router.push({
        pathname: '/verify-email',
        query: {
          userId: verificationData.userId,
          email: verificationData.email,
        },
      });
    }
  };

  if (user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="max-w-md mx-auto">
      <Head>
        <title>Login - ContentCreator AI</title>
      </Head>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Welcome Back</h1>
        <p className="mt-2 text-text-secondary">Log in to your ContentCreator AI account</p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {needsVerification ? (
        <div className="card text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/20 text-warning mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-text-primary mb-2">Email Not Verified</h2>

          <p className="text-text-secondary mb-6">
            Your email address <strong>{verificationData?.email}</strong> has not been verified yet.
            <br />
            Please verify your email to continue.
          </p>

          <button onClick={handleContinueToVerification} className="btn-primary w-full">
            Continue to Verification
          </button>
        </div>
      ) : (
        <div className="card">
          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-text-secondary mb-1"
                  >
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
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-text-secondary mb-1"
                    >
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs text-accent">
                      Forgot password?
                    </Link>
                  </div>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="input"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage name="password" component="p" className="mt-1 text-sm text-error" />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Logging in...
                      </>
                    ) : (
                      'Log In'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link href="/register" className="text-accent">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;