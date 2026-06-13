"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { GoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordRegex.test(formData.password)) {
      setError("Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetchApi('/api/users/register/', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || JSON.stringify(data));

      localStorage.setItem('registration_email', formData.email);
      router.push("/verify-otp");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetchApi('/api/users/google/', {
        method: 'POST',
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google login failed");

      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);

      if (data.requires_onboarding) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-fixer-darkBg">Create your account</h2>
        <p className="mt-2 text-center text-sm text-fixer-muted">
          Already have an account? <Link href="/login" className="font-medium text-fixer-primary hover:text-fixer-primaryHover transition-colors">Sign in</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-fixer-text">Email address *</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm" placeholder="you@company.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fixer-text">Username (Optional)</label>
              <input name="username" type="text" value={formData.username} onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm" placeholder="johndoe" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fixer-text">Password *</label>
              <input name="password" type="password" required value={formData.password} onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fixer-text">Confirm Password *</label>
              <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm" />
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">{error}</div>}

            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-fixer-primary hover:bg-fixer-primaryHover disabled:opacity-50 transition-all">
                {isLoading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-fixer-muted">Or continue with</span></div>
            </div>

            {/* Google Button */}
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