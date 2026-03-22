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
  
  // Admin form state
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
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
                {message.text && (
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
                  <div key={admin.id} className="flex justify-between items-center p-6 border border-neutral-800 rounded-sm bg-neutral-900/50">
                    <div>
                      <div className="text-lg mb-1">{admin.email}</div>
                      <div className="text-xs text-neutral-500 font-mono">{admin.id}</div>
                    </div>
                    <div className="text-xs text-neutral-600 uppercase tracking-widest text-right">
                      Since<br/>
                      <span className="text-neutral-400">{new Date(admin.createdAt).toLocaleDateString()}</span>
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
            <h2 className="text-xl font-light mb-8">Recent Application Submissions</h2>
            {submissions.length === 0 ? (
              <div className="p-16 border border-neutral-800 rounded-sm text-center text-neutral-500 bg-neutral-900/50">
                <div className="text-2xl mb-2 font-light text-white">No submissions yet</div>
                <p>When brands or influencers fill out the Get In Touch form, their info will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {submissions.map((sub: Submission) => (
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
