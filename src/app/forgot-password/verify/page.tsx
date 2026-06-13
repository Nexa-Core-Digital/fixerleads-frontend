"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordVerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('reset_email');
    if (!savedEmail) {
      router.push('/forgot-password');
    } else {
      setEmail(savedEmail);
    }
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;

    localStorage.setItem('reset_otp', code);
    router.push("/forgot-password/reset");
  };

  return (
    <div className="min-h-screen bg-fixer-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image src="/icon.png" alt="FixerLeads Logo" width={48} height={48} className="object-contain" style={{ width: 'auto', height: 'auto' }} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-fixer-darkBg">Enter reset code</h2>
        <p className="mt-2 text-center text-sm text-fixer-muted max-w-sm mx-auto">
          We sent a 6-digit recovery code to <span className="font-bold text-fixer-text">{email}</span>.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 mb-8">
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

            <button 
              type="submit" 
              disabled={otp.join("").length !== 6} 
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-fixer-primary hover:bg-fixer-primaryHover disabled:opacity-50 transition-all"
            >
              Verify Code
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-medium text-fixer-muted hover:text-fixer-primary transition-colors">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}