"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentStatus = searchParams.get("payment");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!paymentStatus) {
      router.replace("/dashboard");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus, router]);

  const isSuccess = paymentStatus === "success";
  const isCancel = paymentStatus === "cancel";

  if (!paymentStatus) return null;

  return (
    <div className="min-h-screen bg-fixer-bg flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center animate-in zoom-in-95 duration-300 border border-gray-100">
        
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : isCancel ? (
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          {isSuccess ? "Payment Successful!" : isCancel ? "Checkout Canceled" : "Payment Error"}
        </h1>
        
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          {isSuccess 
            ? "Your subscription is now active. Your automated operations are ready to scale." 
            : isCancel 
            ? "No charges were made. You can upgrade your plan at any time."
            : "We could not process your transaction. Please try again."}
        </p>
        
        <div className="inline-flex items-center justify-center gap-3 text-sm font-bold text-gray-600 bg-gray-100 px-6 py-3 rounded-full w-full md:w-auto">
          <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Redirecting to dashboard in {countdown}s...
        </div>

      </div>
    </div>
  );
}