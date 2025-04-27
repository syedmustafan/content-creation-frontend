import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '../lib/api';

interface LoginProps {
  setUser: (user: { username: string }) => void;
  user: { username: string } | null;
}

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login: NextPage<LoginProps> = ({ setUser, user }) => {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      const data = await api.login(values.username, values.password);
      localStorage.setItem('auth_token', data.token);
      setUser({ username: values.username });
      router.push('/dashboard');
    } catch (error: any) {
      setLoginError(error.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <Head>
        <title>Login - ContentCreator AI</title>
      </Head>

      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Log in to ContentCreator AI</h1>
          <p className="mt-2 text-text-secondary">
            Welcome back! Please enter your credentials.
          </p>
        </div>

        {loginError && (
          <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-md mb-6">
            {loginError}
          </div>
        )}

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
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
                  placeholder="Enter your username"
                />
                <ErrorMessage name="username" component="p" className="mt-1 text-sm text-error" />
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
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="p" className="mt-1 text-sm text-error" />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                >
                  {isSubmitting ? 'Logging in...' : 'Log in'}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center text-sm">
          <p className="text-text-secondary">
            Don't have an account?{' '}
            <Link href="/register" className="text-accent hover:text-accent/80">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
