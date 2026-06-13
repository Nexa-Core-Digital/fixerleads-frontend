import type { Metadata } from "next";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./globals.css";

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
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}