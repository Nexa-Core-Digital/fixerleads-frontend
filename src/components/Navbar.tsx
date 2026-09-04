"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Math.floor(Date.now() / 1000) >= payload.exp;
  } catch (e) {
    return true;
  }
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const expired = isTokenExpired(token);
    const currentlyLoggedIn = !!token && !expired;
    
    setIsLoggedIn(currentlyLoggedIn);

    if (currentlyLoggedIn) {
      const checkAdminStatus = async () => {
        try {
          const res = await fetchApi('/api/users/me/');
          if (res.ok) {
            const data = await res.json();
            if (data.is_staff || data.is_superuser) {
              setIsAdmin(true);
            }
          }
        } catch (error) {
          console.error("Failed to fetch user status", error);
        }
      };
      
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await fetchApi('/api/users/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh })
        });
      }
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
      setIsAdmin(false);
      router.push('/login');
    }
  };

  const publicLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'How it Works', href: '/#how-it-works' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Watch Demo', href: '/#demo' },
  ];

  const dashboardLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Lead Finder', href: '/dashboard/leads' },
    { name: 'Campaigns', href: '/dashboard/campaigns' },
    { name: 'Reports', href: '/dashboard/reports' },
    { name: 'Contacts', href: '/dashboard/contacts' },
    { name: 'Billing', href: '/dashboard/billing' },
    { name: 'Settings', href: '/dashboard/settings' },
    { name: 'API', href: '/dashboard/api' },
  ];

  if (isAdmin) {
    dashboardLinks.push({ name: 'Admin Panel', href: '/dashboard/admin' });
  }

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href={isLoggedIn ? "/dashboard" : "/"} className="text-2xl font-extrabold tracking-tight text-blue-600 flex items-center gap-2">
              <Image src="/icon.png" alt="FixerLeads Logo" width={36} height={36} className="object-contain" />
              <span className="text-gray-900">Fixer</span>Leads
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8 items-center">
            {isLoggedIn ? (
              dashboardLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} href={link.href} 
                    className={`text-sm transition-colors ${
                      isActive ? 'font-bold text-blue-600' : 'font-semibold text-gray-500 hover:text-blue-600'
                    } ${link.name === 'Admin Panel' ? 'text-purple-600 hover:text-purple-800' : ''}`}
                  >
                    {link.name}
                  </Link>
                );
              })
            ) : (
              publicLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                  {link.name}
                </Link>
              ))
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-5">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors">Logout</button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">Login</Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-900 hover:text-blue-600 focus:outline-none">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-xl absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {isLoggedIn ? (
              dashboardLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className={`block px-3 py-3 rounded-md text-base transition-colors ${
                      isActive ? 'font-bold text-blue-600 bg-blue-50' : 'font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50'
                    } ${link.name === 'Admin Panel' ? 'text-purple-600 bg-purple-50 hover:bg-purple-100' : ''}`}
                  >
                    {link.name}
                  </Link>
                );
              })
            ) : (
              publicLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                  {link.name}
                </Link>
              ))
            )}
            
            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3 px-3">
              {isLoggedIn ? (
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full text-center px-4 py-3 rounded-lg text-base font-medium text-red-600 bg-red-50 hover:bg-red-100">Logout</button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-900 hover:bg-gray-50">Login</Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}