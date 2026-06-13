"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    country: "",
    time_zone: "Asia/Dhaka",
    preferred_language: "en",
    job_title: "",
    industry: "",
    phone_number: "",
    company_name: "",
    bio: "",
    website: "",
    linkedin_url: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetchApi('/api/users/complete-profile/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Onboarding failed");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fixer-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Image src="/icon.png" alt="FixerLeads Logo" width={48} height={48} className="object-contain mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-fixer-darkBg">Complete your profile</h2>
          <p className="mt-2 text-sm text-fixer-muted">
            This information is mandatory to activate your account and personalize your AI models.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-gray-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-fixer-text">Full Name *</label>
                <input required type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-fixer-primary outline-none sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-fixer-text">Country *</label>
                <input required type="text" name="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-fixer-primary outline-none sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-fixer-text">Phone Number *</label>
                <input required type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-fixer-primary outline-none sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-fixer-text">Time Zone *</label>
                <input required type="text" name="time_zone" value={formData.time_zone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-fixer-primary outline-none sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-fixer-text">Preferred Language *</label>
                <select name="preferred_language" value={formData.preferred_language} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-fixer-primary outline-none sm:text-sm">
                  <option value="en">English (en)</option>
                  <option value="bn">Bengali (bn)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-fixer-text">Job Title *</label>
                <input required type="text" name="job_title" value={formData.job_title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-fixer-primary outline-none sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-fixer-text">Industry *</label>
                <input required type="text" name="industry" value={formData.industry} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-fixer-primary outline-none sm:text-sm" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-fixer-text">Company Name *</label>
                <input required type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-fixer-primary outline-none sm:text-sm" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-fixer-text">Bio *</label>
                <textarea required name="bio" rows={3} value={formData.bio} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-fixer-primary outline-none sm:text-sm"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-fixer-text">Website URL</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-fixer-primary outline-none sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-fixer-text">LinkedIn URL</label>
                <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-fixer-primary outline-none sm:text-sm" />
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">{error}</div>}

            <div className="pt-4">
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-fixer-primary hover:bg-fixer-primaryHover disabled:opacity-50 transition-all">
                {isLoading ? "Activating Account..." : "Complete Setup & Go to Dashboard"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}