"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return now >= payload.exp;
  } catch (e) {
    return true;
  }
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      let token = localStorage.getItem("access_token");
      
      const expired = isTokenExpired(token);

      if (expired && token) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        token = null;
      }
      
      const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/verify-otp"];
      const isPublicRoute = publicRoutes.includes(pathname);

      if (token && !expired) {
        if (isPublicRoute) {
          router.replace("/dashboard");
        } else {
          setIsChecking(false);
        }
      } else {
        if (!isPublicRoute) {
          router.replace("/login");
        } else {
          setIsChecking(false);
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}