import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import Lenis from "lenis";

const PROJECT_TYPES = [
  { value: "product-launch", label: "Product Launch" },
  { value: "brand-awareness", label: "Brand Awareness" },
  { value: "influencer-campaign", label: "Influencer Campaign" },
  { value: "social-media", label: "Social Media Management" },
  { value: "content-creation", label: "Content Creation" },
  { value: "performance-marketing", label: "Performance Marketing" },
  { value: "other", label: "Other" },
];

const TIMELINES = [
  { value: "immediate", label: "Immediate (Within 2 weeks)" },
  { value: "1-month", label: "1 Month" },
  { value: "2-3-months", label: "2-3 Months" },
  { value: "3-6-months", label: "3-6 Months" },
  { value: "flexible", label: "Flexible" },
];

const NICHES = [
  { value: "fashion", label: "Fashion & Lifestyle" },
  { value: "beauty", label: "Beauty & Skincare" },
  { value: "fitness", label: "Fitness & Health" },
  { value: "food", label: "Food & Cooking" },
  { value: "travel", label: "Travel & Adventure" },
  { value: "tech", label: "Tech & Gadgets" },
  { value: "finance", label: "Finance & Business" },
  { value: "entertainment", label: "Entertainment" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "multiple", label: "Multiple Platforms" },
];

const FOLLOWERS = [
  { value: "1k-10k", label: "1K - 10K" },
  { value: "10k-50k", label: "10K - 50K" },
  { value: "50k-100k", label: "50K - 100K" },
  { value: "100k-500k", label: "100K - 500K" },
  { value: "500k-1m", label: "500K - 1M" },
  { value: "1m+", label: "1 Million+" },
];

const CONTENT_TYPES = [
  { value: "photos", label: "Photos" },
  { value: "videos", label: "Videos" },
  { value: "reels", label: "Reels/Shorts" },
  { value: "long-form", label: "Long-form Content" },
  { value: "mixed", label: "Mixed Content" },
];

const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  error,
  name,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder: string;
  error?: string;
  name: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center bg-transparent border-b pb-3 md:pb-4 text-xl md:text-2xl text-left focus:outline-none transition-colors ${
          error ? "border-red-500 text-red-500" : "border-neutral-300 hover:border-black"
        }`}
      >
        <span className={!value && !error ? "text-neutral-500" : ""}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1L6 6L11 1"
            stroke={error ? "#ef4444" : "#000000"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className={`absolute z-50 w-full mt-2 bg-white border border-neutral-200 shadow-2xl max-h-[300px] overflow-y-auto transition-all duration-300 origin-top ${
          isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className="w-full text-left px-4 py-3 md:px-6 md:py-4 text-lg md:text-xl hover:bg-neutral-100 transition-colors border-b border-neutral-100 last:border-b-0"
            onClick={() => {
              onChange(name, opt.value);
              setIsOpen(false);
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export function GetInTouchPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [userType, setUserType] = useState<"brand" | "influencer" | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectType: "",
    timeline: "",
    message: "",
    // Influencer specific fields
    niche: "",
    platforms: "",
    followers: "",
    contentType: "",
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-title",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );

      const inputs = gsap.utils.toArray<HTMLElement>(".form-input");
      inputs.forEach((input, index) => {
        gsap.fromTo(
          input,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.5 + index * 0.05,
          }
        );
      });
    }, pageRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleUserTypeChange = (type: "brand" | "influencer") => {
    setUserType(type);
    if (errors.userType) {
      setErrors({ ...errors, userType: "" });
    }
  };

  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!userType) {
      newErrors.userType = "Please select whether you are a Brand or an Influencer.";
    }

    if (!formData.name.trim()) newErrors.name = "Your name is required.";
    if (!formData.company.trim()) newErrors.company = userType === "brand" ? "Company name is required." : "Brand/Channel name is required.";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";

    if (userType === "brand") {
      if (!formData.projectType) newErrors.projectType = "Please select a project type.";
      if (!formData.timeline) newErrors.timeline = "Please select a project timeline.";
      formData.niche = "";
      formData.platforms = "";
      formData.followers = "";
      formData.contentType = "";
    }

    if (userType === "influencer") {
      if (!formData.niche) newErrors.niche = "Please select your primary niche.";
      if (!formData.platforms) newErrors.platforms = "Please select your primary platform.";
      if (!formData.followers) newErrors.followers = "Please select your follower range.";
      if (!formData.contentType) newErrors.contentType = "Please select a content type.";
      formData.projectType = "";
      formData.timeline = "";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => {
        const firstError = document.querySelector('.error-text');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    setErrors({});
    setSubmitStatus("submitting");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userType }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage("Thank you! Your application has been successfully submitted. We will be in touch shortly.");
        // Reset form
        setFormData({
          name: "", company: "", email: "", phone: "", projectType: "", timeline: "", message: "",
          niche: "", platforms: "", followers: "", contentType: ""
        });
        setUserType("");
      } else {
        const data = await response.json();
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Something went wrong during submission.");
      }
    } catch (err) {
      setSubmitStatus("error");
      setSubmitMessage("Network error connecting to our servers.");
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 bg-white">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl tracking-tighter font-light">
            COLLEXA
          </Link>
          <Link
            to="/"
            className="text-sm tracking-wide hover:opacity-60 transition-opacity"
          >
            BACK TO HOME
          </Link>
        </div>
      </nav>

      {/* Form Content */}
      <div className="pt-32 pb-20 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="page-title mb-20">
            <h1 className="text-[clamp(2.5rem,8vw,8rem)] tracking-tighter font-light leading-[0.9] mb-6">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl">
              Tell us about your project and we'll get back to you within 24
              hours.
            </p>
          </div>

          {submitStatus === "success" ? (
            <div className="py-32 text-center bg-neutral-50 border border-neutral-100 rounded-sm">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className="text-4xl tracking-tighter font-light mb-4">Application Received</h2>
              <p className="text-xl text-neutral-500 mb-12 max-w-xl mx-auto">
                {submitMessage}
              </p>
              <button
                onClick={() => setSubmitStatus("idle")}
                className="group relative px-12 py-5 text-xl tracking-tight bg-black text-white hover:bg-neutral-800 transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-16">
              {/* User Type Selection */}
              <div className="form-input relative pb-6">
                <label className={`block text-sm mb-6 ${errors.userType ? "text-red-500" : "text-neutral-500"}`}>
                  I am a *
                </label>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange("brand")}
                    className={`px-6 py-4 md:px-12 md:py-6 border transition-all text-lg md:text-xl ${
                      userType === "brand"
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-neutral-300 hover:border-black"
                    } ${errors.userType && userType !== "brand" ? "border-red-500" : ""}`}
                  >
                    Brand
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange("influencer")}
                    className={`px-6 py-4 md:px-12 md:py-6 border transition-all text-lg md:text-xl ${
                      userType === "influencer"
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-neutral-300 hover:border-black"
                    } ${errors.userType && userType !== "influencer" ? "border-red-500" : ""}`}
                  >
                    Influencer
                  </button>
                </div>
                {errors.userType && <span className="error-text absolute bottom-0 left-0 text-red-500 text-sm tracking-wide">{errors.userType}</span>}
              </div>

              {userType && (
                <>
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="form-input relative pb-6">
                      <label className={`block text-sm mb-4 ${errors.name ? "text-red-500" : "text-neutral-500"}`}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full bg-transparent border-b pb-3 md:pb-4 text-xl md:text-2xl focus:outline-none transition-colors ${errors.name ? 'border-red-500 text-red-500' : 'border-neutral-300 focus:border-black'}`}
                        placeholder="Full name"
                      />
                      {errors.name && <span className="error-text absolute bottom-0 left-0 text-red-500 text-sm tracking-wide">{errors.name}</span>}
                    </div>

                    <div className="form-input relative pb-6">
                      <label className={`block text-sm mb-4 ${errors.company ? "text-red-500" : "text-neutral-500"}`}>
                        {userType === "brand" ? "Company *" : "Brand/Channel Name *"}
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full bg-transparent border-b pb-3 md:pb-4 text-xl md:text-2xl focus:outline-none transition-colors ${errors.company ? 'border-red-500 text-red-500' : 'border-neutral-300 focus:border-black'}`}
                        placeholder={
                          userType === "brand"
                            ? "Company name"
                            : "Your brand or channel name"
                        }
                      />
                      {errors.company && <span className="error-text absolute bottom-0 left-0 text-red-500 text-sm tracking-wide">{errors.company}</span>}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="form-input relative pb-6">
                      <label className={`block text-sm mb-4 ${errors.email ? "text-red-500" : "text-neutral-500"}`}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-transparent border-b pb-3 md:pb-4 text-xl md:text-2xl focus:outline-none transition-colors ${errors.email ? 'border-red-500 text-red-500' : 'border-neutral-300 focus:border-black'}`}
                        placeholder="email@company.com"
                      />
                      {errors.email && <span className="error-text absolute bottom-0 left-0 text-red-500 text-sm tracking-wide">{errors.email}</span>}
                    </div>

                    <div className="form-input relative pb-6">
                      <label className={`block text-sm mb-4 ${errors.phone ? "text-red-500" : "text-neutral-500"}`}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full bg-transparent border-b pb-3 md:pb-4 text-xl md:text-2xl focus:outline-none transition-colors ${errors.phone ? 'border-red-500 text-red-500' : 'border-neutral-300 focus:border-black'}`}
                        placeholder="+91 XXXXX XXXXX"
                      />
                      {errors.phone && <span className="error-text absolute bottom-0 left-0 text-red-500 text-sm tracking-wide">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Brand Specific Fields */}
                  {userType === "brand" && (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <div className="form-input relative pb-6">
                          <label className={`block text-sm mb-4 ${errors.projectType ? "text-red-500" : "text-neutral-500"}`}>
                            Project Type *
                          </label>
                          <CustomSelect
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleSelectChange}
                            options={PROJECT_TYPES}
                            placeholder="Select project type"
                            error={errors.projectType}
                          />
                          {errors.projectType && <span className="error-text absolute bottom-0 left-0 text-red-500 text-sm tracking-wide">{errors.projectType}</span>}
                        </div>

                        <div className="form-input relative pb-6">
                          <label className={`block text-sm mb-4 ${errors.timeline ? "text-red-500" : "text-neutral-500"}`}>
                            Project Timeline *
                          </label>
                          <CustomSelect
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleSelectChange}
                            options={TIMELINES}
                            placeholder="When do you want to start?"
                            error={errors.timeline}
                          />
                          {errors.timeline && <span className="error-text absolute bottom-0 left-0 text-red-500 text-sm tracking-wide">{errors.timeline}</span>}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="form-input relative pb-6">
                        <label className="block text-sm text-neutral-500 mb-4">
                          Project Details
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          className="w-full bg-transparent border-b border-neutral-300 pb-3 md:pb-4 text-xl md:text-2xl focus:outline-none focus:border-black transition-colors resize-none"
                          placeholder="Tell us about your project, goals, and specific requirements..."
                        />
                      </div>
                    </>
                  )}

                  {/* Influencer Specific Fields */}
                  {userType === "influencer" && (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <div className="form-input relative pb-6">
                          <label className={`block text-sm mb-4 ${errors.niche ? "text-red-500" : "text-neutral-500"}`}>
                            Primary Niche *
                          </label>
                          <CustomSelect
                            name="niche"
                            value={formData.niche}
                            onChange={handleSelectChange}
                            options={NICHES}
                            placeholder="Select your niche"
                            error={errors.niche}
                          />
                          {errors.niche && <span className="error-text absolute bottom-0 left-0 text-red-500 text-sm tracking-wide">{errors.niche}</span>}
                        </div>

                        <div className="form-input relative pb-6">
                          <label className={`block text-sm mb-4 ${errors.platforms ? "text-red-500" : "text-neutral-500"}`}>
                            Primary Platform *
                          </label>
                          <CustomSelect
                            name="platforms"
                            value={formData.platforms}
                            onChange={handleSelectChange}
                            options={PLATFORMS}
                            placeholder="Select platform"
                            error={errors.platforms}
                          />
                          {errors.platforms && <span className="error-text absolute bottom-0 left-0 text-red-500 text-sm tracking-wide">{errors.platforms}</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <div className="form-input relative pb-6">
                          <label className={`block text-sm mb-4 ${errors.followers ? "text-red-500" : "text-neutral-500"}`}>
                            Total Followers *
                          </label>
                          <CustomSelect
                            name="followers"
                            value={formData.followers}
                            onChange={handleSelectChange}
                            options={FOLLOWERS}
                            placeholder="Select follower range"
                            error={errors.followers}
                          />
                          {errors.followers && <span className="error-text absolute bottom-0 left-0 text-red-500 text-sm tracking-wide">{errors.followers}</span>}
                        </div>

                        <div className="form-input relative pb-6">
                          <label className={`block text-sm mb-4 ${errors.contentType ? "text-red-500" : "text-neutral-500"}`}>
                            Content Type *
                          </label>
                          <CustomSelect
                            name="contentType"
                            value={formData.contentType}
                            onChange={handleSelectChange}
                            options={CONTENT_TYPES}
                            placeholder="Select content type"
                            error={errors.contentType}
                          />
                          {errors.contentType && <span className="error-text absolute bottom-0 left-0 text-red-500 text-sm tracking-wide">{errors.contentType}</span>}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="form-input relative pb-6">
                        <label className="block text-sm text-neutral-500 mb-4">
                          Tell Us About Yourself
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          className="w-full bg-transparent border-b border-neutral-300 pb-3 md:pb-4 text-xl md:text-2xl focus:outline-none focus:border-black transition-colors resize-none"
                          placeholder="Share your content style, audience demographics, past collaborations, and what type of brand partnerships you're interested in..."
                        />
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <div className="form-input pt-8">
                    <button
                      type="submit"
                      disabled={submitStatus === "submitting"}
                      className="group relative text-xl md:text-2xl tracking-tight hover:opacity-60 transition-opacity disabled:opacity-50"
                    >
                      <span className="relative z-10">
                        {submitStatus === "submitting" ? "Submitting..." : userType === "brand" ? "Submit Application" : "Join Our Network"}
                      </span>
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-500" />
                    </button>
                    {submitStatus === "error" && (
                      <div className="mt-6 p-4 bg-red-50 text-red-800 border-l-4 border-red-500 text-lg">
                        {submitMessage}
                      </div>
                    )}
                    {Object.keys(errors).length > 0 && (
                      <div className="mt-4 text-red-500 text-sm">
                        Please fix the errors above to continue.
                      </div>
                    )}
                  </div>
                </>
              )}
            </form>
          )}

          {/* Contact Info */}
          <div className="mt-32 pt-16 border-t border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-neutral-600">
              <div>
                <div className="text-sm text-neutral-500 mb-2">Email</div>
                <div className="flex flex-col gap-1">
                  <a
                    href="mailto:business@collexa.social"
                    className="hover:text-black transition-colors"
                  >
                    business@collexa.social
                  </a>
                  <a
                    href="mailto:contact@collexa.social"
                    className="hover:text-black transition-colors"
                  >
                    contact@collexa.social
                  </a>
                </div>
              </div>
              <div>
                <div className="text-sm text-neutral-500 mb-2">Phone</div>
                <div className="flex flex-col gap-1">
                  <a
                    href="tel:+918630616359"
                    className="hover:text-black transition-colors"
                  >
                    +91 86306 16359
                  </a>
                  <a
                    href="tel:+919792182280"
                    className="hover:text-black transition-colors"
                  >
                    +91 97921 82280
                  </a>
                  <a
                    href="tel:+917091823115"
                    className="hover:text-black transition-colors"
                  >
                    +91 70918 23115
                  </a>
                </div>
              </div>
              <div>
                <div className="text-sm text-neutral-500 mb-2">Location</div>
                <div>Greater Noida, Uttar Pradesh</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}