"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function ForgotPasswordResetPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#\-_^+])[A-Za-z\d@$!%*?&#\-_^+]{8,}$/;

  useEffect(() => {
    const email = localStorage.getItem('reset_email');
    const otp = localStorage.getItem('reset_otp');
    if (!email || !otp) {
      router.push('/forgot-password');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passwordRegex.test(password)) {
      setError("Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const email = localStorage.getItem('reset_email');
    const otp = localStorage.getItem('reset_otp');

    setIsLoading(true);
    try {
      const res = await fetchApi('/api/users/forgot-password-reset/', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          otp, 
          new_password: password 
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (data.error && data.error.toLowerCase().includes("invalid or expired otp")) {
          localStorage.removeItem('reset_otp');
          router.push('/forgot-password/verify');
          return;
        }
        throw new Error(data.error || "Failed to reset password.");
      }

      localStorage.removeItem('reset_email');
      localStorage.removeItem('reset_otp');
      setSuccess(true);
      
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-fixer-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-12 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-emerald-50 text-fixer-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-fixer-darkBg mb-2">Password Reset!</h2>
          <p className="text-fixer-muted text-sm mb-6">Your password has been changed successfully. Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fixer-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image src="/icon.png" alt="FixerLeads Logo" width={48} height={48} className="object-contain" style={{ width: 'auto', height: 'auto' }} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-fixer-darkBg">Create new password</h2>
        <p className="mt-2 text-center text-sm text-fixer-muted">
          Your new password must be different from previous used passwords.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-fixer-text">New Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-fixer-text">Confirm New Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-fixer-primary hover:bg-fixer-primaryHover disabled:opacity-50 transition-all"
              >
                {isLoading ? "Saving..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}