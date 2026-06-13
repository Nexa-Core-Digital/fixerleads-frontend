"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetchApi('/api/users/forgot-password/', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || data.detail || "Failed to send reset code.");

      localStorage.setItem('reset_email', email);
      router.push("/forgot-password/verify");
      
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fixer-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image src="/icon.png" alt="FixerLeads Logo" width={48} height={48} className="object-contain" style={{ width: 'auto', height: 'auto' }} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-fixer-darkBg">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-fixer-muted">
          Enter your email address and we'll send you a recovery code.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-fixer-text">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-fixer-primary hover:bg-fixer-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fixer-primary disabled:opacity-50 transition-all"
              >
                {isLoading ? "Sending Code..." : "Send Recovery Code"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-medium text-fixer-primary hover:text-fixer-primaryHover transition-colors">
              &larr; Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}