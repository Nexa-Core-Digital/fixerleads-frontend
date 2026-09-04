"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { fetchApi } from "@/lib/api";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    username: "",
    phone_number: "",
    country: "",
    time_zone: "UTC",
    preferred_language: "en",
    job_title: "",
    industry: "",
    company_name: "",
    bio: "",
    website: "",
    linkedin_url: ""
  });

  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [agentData, setAgentData] = useState({
    agency_name: "",
    sender_name: "",
    service_type: "web_development",
    service_description: "",
    target_niche: "",
    target_location: "",
    google_client_id: "",
    google_client_secret: "",
    google_refresh_token: ""
  });

  const [showInstructions, setShowInstructions] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordError, setPasswordError] = useState("");
  const [globalMessage, setGlobalMessage] = useState({ type: "", text: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const SERVICE_OPTIONS = [
    { value: "web_development", label: "Web & App Development" },
    { value: "graphic_design", label: "Graphic Design & Branding (Logos, UI/UX)" },
    { value: "seo_marketing", label: "SEO & Search Engine Optimization" },
    { value: "social_media", label: "Social Media Marketing & Management" },
    { value: "copywriting", label: "Copywriting & Content Strategy" },
    { value: "video_production", label: "Video Editing & Motion Graphics" },
    { value: "paid_ads", label: "Paid Advertising & PPC (Google & Meta Ads)" },
    { value: "ai_automation", label: "AI Automation & Workflow Integration" },
    { value: "sales_consulting", label: "B2B Sales Consulting & Operations" },
    { value: "custom", label: "Custom Business Service" }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, agentRes] = await Promise.all([
          fetchApi('/api/users/me/'),
          fetchApi('/api/leads/agent-settings/')
        ]);

        if (userRes.ok) {
          const data = await userRes.json();
          setProfileData({
            full_name: data.basic_info?.full_name || "",
            email: data.email || "",
            username: data.username || "",
            phone_number: data.basic_info?.phone_number || "",
            country: data.basic_info?.country || "",
            time_zone: data.basic_info?.time_zone || "UTC",
            preferred_language: data.basic_info?.preferred_language || "en",
            job_title: data.profile?.job_title || "",
            industry: data.profile?.industry || "",
            company_name: data.profile?.company_name || "",
            bio: data.profile?.bio || "",
            website: data.profile?.website || "",
            linkedin_url: data.profile?.linkedin_url || ""
          });

          if (data.basic_info?.profile_picture) {
            setPreviewUrl(data.basic_info.profile_picture);
          }
        }

        if (agentRes.ok) {
          const agent = await agentRes.json();
          setAgentData((prev) => ({
            ...prev,
            agency_name: agent.agency_name || "",
            sender_name: agent.sender_name || "",
            service_type: agent.service_type || "web_development",
            service_description: agent.service_description || "",
            target_niche: agent.target_niche || "",
            target_location: agent.target_location || ""
          }));
        }
      } catch (error) {
        console.error("Failed to fetch initial settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const showMessage = (type: "success" | "error", text: string) => {
    setGlobalMessage({ type, text });
    setTimeout(() => setGlobalMessage({ type: "", text: "" }), 5000);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAgentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setAgentData({ ...agentData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      
      formData.append('phone_number', profileData.phone_number);
      formData.append('country', profileData.country);
      formData.append('time_zone', profileData.time_zone);
      formData.append('preferred_language', profileData.preferred_language);
      formData.append('job_title', profileData.job_title);
      formData.append('industry', profileData.industry);
      formData.append('company_name', profileData.company_name);
      formData.append('bio', profileData.bio);
      formData.append('website', profileData.website);
      formData.append('linkedin_url', profileData.linkedin_url);

      if (profilePictureFile) {
        formData.append('profile_picture', profilePictureFile);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/users/profile/update/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      
      showMessage("success", "Profile updated successfully!");
    } catch (error: any) {
      showMessage("error", error.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAgent(true);
    
    try {
      const payload = Object.fromEntries(
        Object.entries(agentData).filter(([_, v]) => v !== "")
      );

      const res = await fetchApi('/api/leads/agent-settings/', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save agent settings");
      
      showMessage("success", "Agent credentials & multidimensional service profile saved!");
      setAgentData((prev) => ({
        ...prev,
        google_client_id: "",
        google_client_secret: "",
        google_refresh_token: ""
      }));
    } catch (error: any) {
      showMessage("error", error.message);
    } finally {
      setIsSavingAgent(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (!passwordRegex.test(passwordData.newPassword)) {
      setPasswordError("New password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
      setPasswordError("New password cannot be the same as the old password.");
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetchApi('/api/users/change-password/', {
        method: 'POST',
        body: JSON.stringify({
          current_password: passwordData.oldPassword,
          new_password: passwordData.newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password.");

      showMessage("success", "Password updated successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      setPasswordError(error.message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-fixer-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-fixer-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fixer-bg pb-12">
      <Navbar />

      <div className="pt-20">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-extrabold text-fixer-darkBg">Account Settings</h1>
            <p className="text-sm font-medium text-fixer-muted mt-1">
              Manage your personal information, specialized service offerings, outreach agents, and security credentials.
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          
          {globalMessage.text && (
            <div className={`px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border ${
              globalMessage.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-fixer-accent' 
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {globalMessage.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              )}
              <span className="text-sm font-bold">{globalMessage.text}</span>
            </div>
          )}

          {/* Profile Settings Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
              <h2 className="text-lg font-bold text-fixer-darkBg">Personal Information</h2>
              <p className="text-sm text-fixer-muted mt-1">Update your photo and personal details here.</p>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center gap-6 mb-8">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />

                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-fixer-primary to-fixer-secondary p-0.5 shrink-0">
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-fixer-primary uppercase">
                        {profileData.full_name ? profileData.full_name.charAt(0) : "U"}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white border border-gray-200 text-fixer-text hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
                    >
                      Change Avatar
                    </button>
                  </div>
                  <p className="text-xs text-fixer-muted mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-500 flex items-center gap-2">
                    Full Name (Identity)
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </label>
                  <input type="text" value={profileData.full_name} disabled className="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 sm:text-sm cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-500 flex items-center gap-2">
                    Email Address
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </label>
                  <input type="email" value={profileData.email} disabled className="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 sm:text-sm cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-500 flex items-center gap-2">
                    Username
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </label>
                  <input type="text" value={profileData.username} disabled className="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 sm:text-sm cursor-not-allowed" />
                </div>

                <div className="sm:col-span-2 border-t border-gray-100 my-2"></div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Job Title</label>
                  <input type="text" name="job_title" value={profileData.job_title} onChange={handleProfileChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Company Name</label>
                  <input type="text" name="company_name" value={profileData.company_name} onChange={handleProfileChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Phone Number</label>
                  <input type="text" name="phone_number" value={profileData.phone_number} onChange={handleProfileChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Industry</label>
                  <input type="text" name="industry" value={profileData.industry} onChange={handleProfileChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Country</label>
                  <input type="text" name="country" value={profileData.country} onChange={handleProfileChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Time Zone</label>
                  <input type="text" name="time_zone" value={profileData.time_zone} onChange={handleProfileChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-fixer-text">Bio</label>
                  <textarea name="bio" rows={3} value={profileData.bio} onChange={handleProfileChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">LinkedIn URL</label>
                  <input type="url" name="linkedin_url" value={profileData.linkedin_url} onChange={handleProfileChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Website URL</label>
                  <input type="url" name="website" value={profileData.website} onChange={handleProfileChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSavingProfile} className="bg-fixer-primary hover:bg-fixer-primaryHover text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50">
                  {isSavingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* Agent Settings Form (Multidimensional Services & Outreach Config) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
              <h2 className="text-lg font-bold text-fixer-darkBg flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                Agent Lead Discovery & Service Engine
              </h2>
              <p className="text-sm text-fixer-muted mt-1">Configure your primary commercial service, agency identity, and Gmail API credentials.</p>
            </div>
            
            <form onSubmit={handleAgentSubmit} className="p-6 sm:p-8 space-y-6">
              
              {/* SECTION: Professional Service Matrix */}
              <div className="bg-gradient-to-r from-purple-50/70 to-blue-50/70 p-5 rounded-xl border border-purple-100/80 space-y-4">
                <h3 className="text-sm font-extrabold text-fixer-darkBg flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  Professional Service Definition
                </h3>
                <p className="text-xs text-fixer-muted leading-relaxed">
                  Select your core professional offering. Anthropic Claude will analyze prospect websites, identify flaws related to this service, and generate customized pitches and audit reports.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-fixer-text uppercase tracking-wider mb-1">Primary Service Offering</label>
                    <select
                      name="service_type"
                      value={agentData.service_type}
                      onChange={handleAgentChange}
                      className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm font-bold text-fixer-darkBg cursor-pointer"
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-fixer-text uppercase tracking-wider mb-1">Service Value Proposition (Optional)</label>
                    <input
                      type="text"
                      name="service_description"
                      value={agentData.service_description}
                      onChange={handleAgentChange}
                      placeholder="e.g. We design high-converting logos, brand kits, and UI redesigns."
                      className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm text-fixer-text placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Identity & Targets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                  <label className="block text-sm font-bold text-fixer-text">Agency / Business Name</label>
                  <input type="text" name="agency_name" value={agentData.agency_name} onChange={handleAgentChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" placeholder="e.g. Acme Studio" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Sender Full Name</label>
                  <input type="text" name="sender_name" value={agentData.sender_name} onChange={handleAgentChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" placeholder="e.g. Sarah Connor" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Default Target Niche</label>
                  <input type="text" name="target_niche" value={agentData.target_niche} onChange={handleAgentChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" placeholder="e.g. real estate agencies" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Default Target Location</label>
                  <input type="text" name="target_location" value={agentData.target_location} onChange={handleAgentChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" placeholder="e.g. Miami, FL" />
                </div>

                {/* Google Credentials */}
                <div className="sm:col-span-2 border-t border-gray-100 my-1 pt-4">
                  <h3 className="text-sm font-extrabold text-fixer-darkBg flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    Google OAuth2 Credentials (Encrypted)
                  </h3>
                  <p className="text-xs text-fixer-muted">Credentials remain encrypted in the database and are used for authenticated cold dispatching.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-fixer-text">Google Client ID</label>
                  <input type="text" name="google_client_id" value={agentData.google_client_id} onChange={handleAgentChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm font-mono transition-colors text-fixer-text" placeholder="e.g. 1234567890-xxx.apps.googleusercontent.com" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Google Client Secret</label>
                  <input type="password" name="google_client_secret" value={agentData.google_client_secret} onChange={handleAgentChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm font-mono transition-colors text-fixer-text" placeholder="GOCSPX-xxxxxxxxxxxx" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Google Refresh Token</label>
                  <input type="password" name="google_refresh_token" value={agentData.google_refresh_token} onChange={handleAgentChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm font-mono transition-colors text-fixer-text" placeholder="1//0gxxxxxxxxxxxxxxxx" />
                </div>
              </div>

              {/* Instructions Dropdown */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-bold text-fixer-darkBg">How to get your Google Cloud & OAuth2 Credentials?</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showInstructions ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showInstructions && (
                  <div className="mt-3 p-5 bg-white border border-blue-100 rounded-xl space-y-4 text-sm text-gray-700 leading-relaxed shadow-sm animate-in fade-in duration-200">
                    <div>
                      <h4 className="font-extrabold text-fixer-darkBg mb-1">Step 1: Create a Project & Enable Gmail API</h4>
                      <p className="text-xs text-gray-600">
                        Go to the{" "}
                        <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline">
                          Google Cloud Console
                        </a>
                        , create a new project, navigate to <strong>APIs & Services &gt; Library</strong>, search for <strong>Gmail API</strong>, and click <strong>Enable</strong>.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-fixer-darkBg mb-1">Step 2: Configure OAuth Consent Screen & Test Users</h4>
                      <p className="text-xs text-gray-600">
                        Navigate to <strong>APIs & Services &gt; OAuth consent screen</strong>. Choose <strong>External</strong>, provide your App Name and Email, and continue. Under <strong>Test users</strong>, click <strong>+ Add Users</strong> and enter your sending Gmail address.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-fixer-darkBg mb-1">Step 3: Create OAuth 2.0 Client ID</h4>
                      <p className="text-xs text-gray-600">
                        Go to <strong>APIs & Services &gt; Credentials</strong> &gt; click <strong>Create Credentials &gt; OAuth client ID</strong>.
                      </p>
                      <ul className="text-xs text-gray-600 list-disc list-inside mt-1 space-y-1">
                        <li><strong>Application type:</strong> Web application</li>
                        <li><strong>Authorized redirect URIs:</strong> Add <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">https://developers.google.com/oauthplayground</code></li>
                      </ul>
                      <p className="text-xs text-gray-600 mt-1">Copy your generated <strong>Client ID</strong> and <strong>Client Secret</strong>.</p>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-fixer-darkBg mb-1">Step 4: Generate Refresh Token via OAuth Playground</h4>
                      <p className="text-xs text-gray-600">
                        Open the{" "}
                        <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline">
                          Google OAuth 2.0 Playground
                        </a>
                        .
                      </p>
                      <ol className="text-xs text-gray-600 list-decimal list-inside mt-1 space-y-1">
                        <li>Click the <strong>Settings icon (gear)</strong> at the top right, check <strong>Use your own OAuth credentials</strong>, and paste your <em>OAuth Client ID</em> & <em>OAuth Client Secret</em>.</li>
                        <li>In Step 1, scroll to <strong>Gmail API v1</strong> and check <code className="bg-gray-100 px-1 py-0.5 rounded">https://mail.google.com/</code>.</li>
                        <li>Click <strong>Authorize APIs</strong> and sign into your Google account.</li>
                        <li>In Step 2, click <strong>Exchange authorization code for tokens</strong> and copy the <strong>Refresh token</strong>.</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-start">
                <button type="submit" disabled={isSavingAgent} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-purple-500/20 transition-all disabled:opacity-50">
                  {isSavingAgent ? "Saving..." : "Save Agent Configuration"}
                </button>
              </div>
            </form>
          </div>

          {/* Security & Password Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
              <h2 className="text-lg font-bold text-fixer-darkBg flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Security & Password
              </h2>
              <p className="text-sm text-fixer-muted mt-1">Ensure your account is using a long, random password to stay secure.</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="max-w-xl space-y-5">
                <div>
                  <label className="block text-sm font-bold text-fixer-text">Current Password</label>
                  <input type="password" name="oldPassword" required value={passwordData.oldPassword} onChange={handlePasswordChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" placeholder="••••••••" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">New Password</label>
                  <input type="password" name="newPassword" required value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" placeholder="••••••••" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text">Confirm New Password</label>
                  <input type="password" name="confirmPassword" required value={passwordData.confirmPassword} onChange={handlePasswordChange} className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-fixer-primary focus:border-fixer-primary sm:text-sm transition-colors text-fixer-text" placeholder="••••••••" />
                </div>
              </div>

              {passwordError && (
                <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200 flex items-start gap-3 max-w-xl">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="pt-4 flex justify-start">
                <button type="submit" disabled={isSavingPassword} className="bg-fixer-darkBg hover:bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all disabled:opacity-50">
                  {isSavingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
}