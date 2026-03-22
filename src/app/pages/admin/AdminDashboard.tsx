import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Admin {
  id: string;
  email: string;
  createdAt: string;
}

interface Submission {
  id: string;
  userType: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  projectType: string;
  timeline: string;
  niche: string;
  platforms: string;
  followers: string;
  contentType: string;
  createdAt: string;
}

interface ContactInfo {
  id: string;
  category: string;
  value: string;
  label: string;
}

export function AdminDashboard() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [activeTab, setActiveTab] = useState<"admins"| "submissions" | "contact">("submissions");
  const [submissionFilter, setSubmissionFilter] = useState<"all" | "brand" | "influencer">("all");
  
  // Admin form state
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [changePasswordValue, setChangePasswordValue] = useState("");
  
  // Manual Submission state
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualSub, setManualSub] = useState({
    userType: "brand",
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    projectType: "",
    timeline: "",
    niche: "",
    platforms: "",
    followers: ""
  });
  
  // Contact info form state
  const [newCategory, setNewCategory] = useState("email");
  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");
  
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("collexa_admin_token");
    if (!token) {
      navigate("/collexa-hq-portal");
      return;
    }

    fetchAdmins(token);
    fetchSubmissions(token);
    fetchContactInfo();
  }, [navigate]);

  const fetchAdmins = async (token: string) => {
    try {
      const response = await fetch("/api/admin/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      } else {
        localStorage.removeItem("collexa_admin_token");
        navigate("/collexa-hq-portal");
      }
    } catch (err) {
      console.error("Failed to fetch admins", err);
    }
  };

  const fetchSubmissions = async (token: string) => {
    try {
      const response = await fetch("/api/submissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    }
  };

  const fetchContactInfo = async () => {
    try {
      const response = await fetch("/api/contact-info");
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (err) {
      console.error("Failed to fetch contact info", err);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    const token = localStorage.getItem("collexa_admin_token");

    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Superadmin successfully created", type: "success" });
        setNewEmail("");
        setNewPassword("");
        fetchAdmins(token!);
      } else {
        setMessage({ text: data.error || "Creation failed", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error", type: "error" });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdminId || !changePasswordValue) return;
    
    const token = localStorage.getItem("collexa_admin_token");
    try {
      const response = await fetch("/api/admin/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ adminId: editingAdminId, newPassword: changePasswordValue })
      });
      if (response.ok) {
        setMessage({ text: "Password changed successfully", type: "success" });
        setEditingAdminId(null);
        setChangePasswordValue("");
      } else {
        const data = await response.json();
        setMessage({ text: data.error || "Change failed", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error", type: "error" });
    }
  };

  const handleManualSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualSub)
      });
      if (response.ok) {
        setMessage({ text: "Manual submission recorded", type: "success" });
        setShowManualForm(false);
        setManualSub({
          userType: "brand", name: "", company: "", email: "", phone: "", message: "",
          projectType: "", timeline: "", niche: "", platforms: "", followers: ""
        });
        const token = localStorage.getItem("collexa_admin_token");
        fetchSubmissions(token!);
      }
    } catch (err) {
      setMessage({ text: "Failed to create submission", type: "error" });
    }
  };

  const handleCreateContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    const token = localStorage.getItem("collexa_admin_token");

    try {
      const response = await fetch("/api/contact-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category: newCategory, value: newValue, label: newLabel }),
      });

      if (response.ok) {
        setMessage({ text: "Contact detail added", type: "success" });
        setNewValue("");
        setNewLabel("");
        fetchContactInfo();
      } else {
        const data = await response.json();
        setMessage({ text: data.error || "Failed to add detail", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error", type: "error" });
    }
  };

  const handleDeleteContactInfo = async (id: string) => {
    const token = localStorage.getItem("collexa_admin_token");
    if (!window.confirm("Are you sure you want to remove this detail?")) return;

    try {
      const response = await fetch(`/api/contact-info/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchContactInfo();
      }
    } catch (err) {
      console.error("Failed to delete contact info", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("collexa_admin_token");
    navigate("/collexa-hq-portal");
  };

  const filteredSubmissions = submissions.filter(s => {
    if (submissionFilter === "all") return true;
    return s.userType === submissionFilter;
  });

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 pb-8 border-b border-neutral-800">
          <div>
            <h1 className="text-2xl tracking-tighter font-light mb-1">HQ DASHBOARD</h1>
            <p className="text-neutral-500 text-sm">System Administration</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm tracking-widest uppercase text-neutral-400 hover:text-white transition-colors border border-neutral-800 px-6 py-2 rounded-sm"
          >
            Logout
          </button>
        </header>

        <div className="flex gap-8 border-b border-neutral-800 mb-12 uppercase tracking-widest text-sm text-neutral-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button 
            className={`pb-4 transition-colors relative ${activeTab === 'submissions' ? 'text-white' : 'hover:text-neutral-300'}`}
            onClick={() => { setActiveTab('submissions'); setMessage({ text: "", type: "" }); }}
          >
            Submissions ({submissions.length})
            {activeTab === 'submissions' && <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-white"></div>}
          </button>
          <button 
            className={`pb-4 transition-colors relative ${activeTab === 'contact' ? 'text-white' : 'hover:text-neutral-300'}`}
            onClick={() => { setActiveTab('contact'); setMessage({ text: "", type: "" }); }}
          >
            Contact Details
            {activeTab === 'contact' && <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-white"></div>}
          </button>
          <button 
            className={`pb-4 transition-colors relative ${activeTab === 'admins' ? 'text-white' : 'hover:text-neutral-300'}`}
            onClick={() => { setActiveTab('admins'); setMessage({ text: "", type: "" }); }}
          >
            Admin Access
            {activeTab === 'admins' && <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-white"></div>}
          </button>
        </div>

        {activeTab === 'admins' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-xl font-light mb-8">Spawn New Admin</h2>
              <form onSubmit={handleCreateAdmin} className="space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-sm">
                {message.text && (activeTab === 'admins') && (
                  <div className={`p-4 rounded-sm text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {message.text}
                  </div>
                )}
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">Admin Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@collexa.social"
                    className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all placeholder:text-neutral-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">Secure Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all placeholder:text-neutral-700"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black text-sm tracking-widest uppercase hover:bg-neutral-200 transition-colors mt-4 rounded-sm"
                >
                  Create Administrator
                </button>
              </form>
            </div>

            <div className="lg:col-span-7">
              <h2 className="text-xl font-light mb-8">Active Administrators</h2>
              <div className="space-y-4">
                {admins.map((admin: Admin) => (
                  <div key={admin.id} className="p-6 border border-neutral-800 rounded-sm bg-neutral-900/50">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-lg mb-1">{admin.email}</div>
                        <div className="text-xs text-neutral-500 font-mono">{admin.id}</div>
                      </div>
                      <button
                        onClick={() => { setEditingAdminId(editingAdminId === admin.id ? null : admin.id); setMessage({text: "", type:""}); }}
                        className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                      >
                        {editingAdminId === admin.id ? 'Cancel' : 'Change Password'}
                      </button>
                    </div>

                    {editingAdminId === admin.id && (
                      <form onSubmit={handleChangePassword} className="mt-4 pt-4 border-t border-neutral-800 space-y-4">
                        <input
                          type="password"
                          value={changePasswordValue}
                          onChange={(e) => setChangePasswordValue(e.target.value)}
                          placeholder="New secure password"
                          className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-2 text-white text-sm focus:outline-none focus:border-neutral-500"
                          required
                        />
                        <button type="submit" className="text-xs uppercase tracking-widest bg-white text-black px-4 py-2 rounded-sm hover:bg-neutral-200">
                          Update Password
                        </button>
                      </form>
                    )}

                    <div className="text-xs text-neutral-600 uppercase tracking-widest">
                      Since <span className="text-neutral-400">{new Date(admin.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {admins.length === 0 && (
                  <div className="p-8 border border-neutral-800 rounded-sm text-center text-neutral-500">
                    Loading active administrators...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-xl font-light mb-8">Add Contact Detail</h2>
              <form onSubmit={handleCreateContactInfo} className="space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-sm">
                {message.text && (activeTab === 'contact') && (
                  <div className={`p-4 rounded-sm text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {message.text}
                  </div>
                )}
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="location">Location</option>
                    <option value="follow">Follow Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">Value (Email, Phone, Address, URL)</label>
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="e.g., hello@collexa.social"
                    className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all placeholder:text-neutral-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">Label (e.g., "Business", "Instagram")</label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Optional label"
                    className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all placeholder:text-neutral-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black text-sm tracking-widest uppercase hover:bg-neutral-200 transition-colors mt-4 rounded-sm"
                >
                  Add Detail
                </button>
              </form>
            </div>

            <div className="lg:col-span-7">
              <h2 className="text-xl font-light mb-8">Existing Details</h2>
              <div className="space-y-4">
                {['email', 'phone', 'location', 'follow'].map((cat: string) => (
                  <div key={cat} className="space-y-3">
                    <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-600 font-medium ml-1">{cat}s</h3>
                    {contactInfo.filter((item: ContactInfo) => item.category === cat).map((item: ContactInfo) => (
                      <div key={item.id} className="flex justify-between items-center p-4 border border-neutral-800 rounded-sm bg-neutral-900/50 group">
                        <div>
                          <div className="text-sm font-light text-white">{item.value}</div>
                          {item.label && <div className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">{item.label}</div>}
                        </div>
                        <button
                          onClick={() => handleDeleteContactInfo(item.id)}
                          className="text-neutral-600 hover:text-red-500 transition-colors text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {contactInfo.filter((item: ContactInfo) => item.category === cat).length === 0 && (
                      <div className="p-4 border border-dashed border-neutral-800 rounded-sm text-center text-neutral-700 text-xs italic">
                        No {cat} details added
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-xl font-light">Application Submissions</h2>
              <div className="flex gap-4">
                <div className="flex bg-neutral-900 border border-neutral-800 p-1 rounded-sm">
                  {['all', 'brand', 'influencer'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSubmissionFilter(f as any)}
                      className={`px-4 py-1.5 text-xs uppercase tracking-widest rounded-sm transition-colors ${submissionFilter === f ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowManualForm(!showManualForm)}
                  className="px-6 py-2 bg-neutral-800 text-white text-xs uppercase tracking-widest rounded-sm hover:bg-neutral-700 transition-colors"
                >
                  {showManualForm ? 'Cancel Entry' : 'Manual Entry'}
                </button>
              </div>
            </div>

            {showManualForm && (
              <div className="mb-12 bg-neutral-900 border border-neutral-800 p-8 rounded-sm">
                <h3 className="text-lg font-light mb-6">Create Manual Submission</h3>
                <form onSubmit={handleManualSubmission} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">User Type</label>
                    <select
                      value={manualSub.userType}
                      onChange={(e) => setManualSub({...manualSub, userType: e.target.value})}
                      className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm"
                    >
                      <option value="brand">Brand</option>
                      <option value="influencer">Influencer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Name</label>
                    <input
                      type="text"
                      value={manualSub.name}
                      onChange={(e) => setManualSub({...manualSub, name: e.target.value})}
                      className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Company / Social Handle</label>
                    <input
                      type="text"
                      value={manualSub.company}
                      onChange={(e) => setManualSub({...manualSub, company: e.target.value})}
                      className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Email</label>
                    <input
                      type="email"
                      value={manualSub.email}
                      onChange={(e) => setManualSub({...manualSub, email: e.target.value})}
                      className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Phone</label>
                    <input
                      type="text"
                      value={manualSub.phone}
                      onChange={(e) => setManualSub({...manualSub, phone: e.target.value})}
                      className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm"
                      required
                    />
                  </div>
                  
                  {manualSub.userType === 'brand' ? (
                    <>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Project Type</label>
                        <input
                          type="text"
                          value={manualSub.projectType}
                          onChange={(e) => setManualSub({...manualSub, projectType: e.target.value})}
                          className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Timeline</label>
                        <input
                          type="text"
                          value={manualSub.timeline}
                          onChange={(e) => setManualSub({...manualSub, timeline: e.target.value})}
                          className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Niche</label>
                        <input
                          type="text"
                          value={manualSub.niche}
                          onChange={(e) => setManualSub({...manualSub, niche: e.target.value})}
                          className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Platforms</label>
                        <input
                          type="text"
                          value={manualSub.platforms}
                          onChange={(e) => setManualSub({...manualSub, platforms: e.target.value})}
                          className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Message / Notes</label>
                    <textarea
                      value={manualSub.message}
                      onChange={(e) => setManualSub({...manualSub, message: e.target.value})}
                      className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm h-32"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full py-4 bg-white text-black text-sm uppercase tracking-widest hover:bg-neutral-200">
                      Record Submission
                    </button>
                  </div>
                </form>
              </div>
            )}

            {filteredSubmissions.length === 0 ? (
              <div className="p-16 border border-neutral-800 rounded-sm text-center text-neutral-500 bg-neutral-900/50">
                <div className="text-2xl mb-2 font-light text-white">No submissions matching filter</div>
                <p>Try changing the filter or add a manual entry above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSubmissions.map((sub: Submission) => (
                  <div key={sub.id} className="border border-neutral-800 bg-neutral-900/50 p-6 rounded-sm flex flex-col">
                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-neutral-800">
                      <div>
                        <span className={`inline-block px-2 py-1 text-xs uppercase tracking-widest rounded-sm mb-3 ${sub.userType === 'brand' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                          {sub.userType}
                        </span>
                        <h3 className="text-xl font-light">{sub.name}</h3>
                        <p className="text-neutral-500">{sub.company}</p>
                      </div>
                      <div className="text-right text-xs text-neutral-600">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex-grow space-y-4 text-sm text-neutral-400 mb-6">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Email</span>
                        <a href={`mailto:${sub.email}`} className="text-white hover:underline">{sub.email}</a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Phone</span>
                        <span className="text-white">{sub.phone}</span>
                      </div>

                      {sub.userType === "brand" ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Project Type</span>
                            <span className="text-white">{sub.projectType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Timeline</span>
                            <span className="text-white">{sub.timeline}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Niche</span>
                            <span className="text-white">{sub.niche}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Platform</span>
                            <span className="text-white">{sub.platforms}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Followers</span>
                            <span className="text-white">{sub.followers}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {sub.message && (
                      <div className="mt-auto p-4 bg-black rounded-sm border border-neutral-800">
                        <p className="text-sm text-neutral-300 italic line-clamp-3 hover:line-clamp-none transition-all">"{sub.message}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
