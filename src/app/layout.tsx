import type { Metadata } from "next";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "FixerLeads | AI-Powered Lead Generation",
  description: "Find, analyze, and contact your best leads automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthGuard>
            {children}
          </AuthGuard>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}