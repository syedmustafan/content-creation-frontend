import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';

interface VerifyEmailProps {
  user: { username: string } | null;
  setUser: (user: { username: string } | null) => void;
}

const VerifyEmail: NextPage<VerifyEmailProps> = ({ user, setUser }) => {
  const router = useRouter();
  const { userId, email } = router.query;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [timer, setTimer] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Set up countdown timer for resend button
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Focus on first input field on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Handle backspace when input is empty (focus on previous)
    if (value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      return;
    }

    // If digit entered, focus on next input (if available)
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace (focus previous input when empty)
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle left arrow (focus previous input)
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle right arrow (focus next input)
    else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    // Only process if it looks like a 6-digit OTP
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);

      // Focus on the last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    if (otp.some(digit => digit === '')) {
      setError('Please enter all digits of the verification code');
      return;
    }

    if (!userId) {
      setError('User ID is missing. Please try to register again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.verifyEmail(
        Number(userId),
        otp.join('')
      );

      // Save token and set user
      localStorage.setItem('auth_token', response.token);
      setUser({
        username: response.username
      });

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error: any) {
      if (error.response?.data?.expired) {
        setError('Verification code has expired. Please request a new one.');
      } else {
        setError(error.response?.data?.error || 'Verification failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!userId && !email) {
      setError('Cannot resend verification code. Missing user information.');
      return;
    }

    setResendLoading(true);
    setError(null);

    try {
      await api.resendVerification(
        userId ? Number(userId) : undefined,
        typeof email === 'string' ? email : undefined
      );

      setResendSuccess(true);
      setTimer(60); // Set countdown timer for 60 seconds

      // Clear success message after 3 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 3000);

    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to resend verification code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (user) {
    return null; // Don't render anything while redirecting
  }

  // @ts-ignore
    // @ts-ignore
    return (
    <div className="max-w-md mx-auto">
      <Head>
        <title>Verify Email - ContentCreator AI</title>
      </Head>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Verify Your Email</h1>
        <p className="mt-2 text-text-secondary">
          We've sent a verification code to{' '}
          <span className="font-medium text-text-primary">{email}</span>
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {resendSuccess && (
        <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-md mb-6">
          Verification code resent successfully!
        </div>
      )}

      <div className="card">
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Enter the 6-digit verification code
          </label>

          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                // @ts-ignore
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="input text-center font-mono text-xl w-12 h-12"
              />
            ))}
          </div>

          <p className="mt-2 text-xs text-text-secondary">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.some(digit => digit === '')}
          className="btn-primary w-full flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-text-secondary text-sm">
            Didn't receive the code?{' '}
            {timer > 0 ? (
              <span className="text-text-secondary">
                Resend in {timer}s
              </span>
            ) : (
              <button
                onClick={handleResendCode}
                disabled={resendLoading || timer > 0}
                className="text-accent hover:underline disabled:text-text-secondary disabled:no-underline"
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-text-secondary text-sm">
            Back to{' '}
            <Link href="/login" className="text-accent">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;