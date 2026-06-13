"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('registration_email');
    if (!savedEmail) {
      router.push('/register');
    } else {
      setEmail(savedEmail);
    }
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;

    setIsLoading(true);
    try {
      const res = await fetchApi('/api/users/verify-otp/', {
        method: 'POST',
        body: JSON.stringify({ email, otp: code })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      // Save tokens securely in local storage
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      localStorage.removeItem('registration_email'); // Clean up

      if (data.requires_onboarding) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fixer-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image src="/icon.png" alt="FixerLeads Logo" width={48} height={48} className="object-contain" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-fixer-darkBg">Check your email</h2>
        <p className="mt-2 text-center text-sm text-fixer-muted max-w-sm mx-auto">
          We've sent a 6-digit verification code to <span className="font-bold text-fixer-text">{email}</span>.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-fixer-primary outline-none transition-all text-fixer-text"
                />
              ))}
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 text-center">{error}</div>}

            <button type="submit" disabled={otp.join("").length !== 6 || isLoading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-fixer-primary hover:bg-fixer-primaryHover disabled:opacity-50 transition-all">
              {isLoading ? "Verifying..." : "Verify Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}