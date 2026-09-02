"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      
      const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/verify-otp"];
      const isPublicRoute = publicRoutes.includes(pathname);

      if (token) {
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