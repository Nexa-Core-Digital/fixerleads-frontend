"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetchApi('/api/users/login/', {
        method: 'POST',
        body: JSON.stringify({ 
          username: identifier,
          password: password 
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Invalid credentials.");

      localStorage.setItem('access_token', data.refresh ? data.access : data.tokens?.access);
      localStorage.setItem('refresh_token', data.refresh || data.tokens?.refresh);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    try {
      const res = await fetchApi('/api/users/google/', {
        method: 'POST',
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google login failed.");

      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);

      if (data.requires_onboarding) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
    }
  };

  return (
    <div className="min-h-screen bg-fixer-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image 
            src="/icon.png" 
            alt="FixerLeads Logo" 
            width={48} 
            height={48} 
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }} 
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-fixer-darkBg">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-fixer-muted">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-fixer-primary hover:text-fixer-primaryHover transition-colors">
            Start your free trial
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-fixer-text">
                Email address or Username
              </label>
              <div className="mt-1">
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors"
                  placeholder="name@company.com or username"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-fixer-text">
                  Password
                </label>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-fixer-primary hover:text-fixer-primaryHover transition-colors">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-fixer-primary hover:bg-fixer-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fixer-primary disabled:opacity-50 transition-all"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-fixer-muted">Or continue with</span>
              </div>
            </div>

            {/* Google Button Wrapper */}
            <div className="mt-6 flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login Failed")}
                shape="rectangular"
                theme="outline"
                size="large"
                width={320}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}