import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../lib/api';

interface RegisterProps {
  setUser: (user: { username: string }) => void;
  user: { username: string } | null;
}

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

const Register: NextPage<RegisterProps> = ({ setUser, user }) => {
  const router = useRouter();
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (values: { username: string; email: string; password: string }) => {
    try {
      const data = await api.register(values.username, values.email, values.password);
      localStorage.setItem('auth_token', data.token);
      setUser({ username: values.username });
      router.push('/dashboard');
    } catch (error: any) {
      setRegisterError(error.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <Head>
        <title>Register - ContentCreator AI</title>
      </Head>

      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
          <p className="mt-2 text-text-secondary">
            Start creating AI-powered content today
          </p>
        </div>

        {registerError && (
          <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-md mb-6">
            {registerError}
          </div>
        )}

        <Formik
          initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">
                  Username
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="input"
                  placeholder="Choose a username"
                />
                <ErrorMessage name="username" component="p" className="mt-1 text-sm text-error" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
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
                  id="password"
                  name="password"
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
                  id="confirmPassword"
                  name="confirmPassword"
                  className="input"
                  placeholder="Confirm your password"
                />
                <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-error" />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                >
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center text-sm">
          <p className="text-text-secondary">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:text-accent/80">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
