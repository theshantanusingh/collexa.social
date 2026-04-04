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

interface Creator {
  id: string;
  name: string;
  handle: string;
  followers: string;
  niche: string;
  about: string;
  imageUrl: string;
  displayOrder: number;
}

const EMPTY_CREATOR: Omit<Creator, "id"> = {
  name: "",
  handle: "",
  followers: "",
  niche: "",
  about: "",
  imageUrl: "",
  displayOrder: 0,
};

const inputCls =
  "w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all placeholder:text-neutral-700";
const labelCls = "block text-xs uppercase tracking-widest text-neutral-500 mb-3";

export function AdminDashboard() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [activeTab, setActiveTab] = useState<"admins" | "submissions" | "contact" | "creators">("submissions");
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
    followers: "",
  });

  // Contact info form state
  const [newCategory, setNewCategory] = useState("email");
  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");

  // Creator form state
  const [creatorForm, setCreatorForm] = useState<Omit<Creator, "id">>(EMPTY_CREATOR);
  const [editingCreatorId, setEditingCreatorId] = useState<string | null>(null);
  const [creatorFormVisible, setCreatorFormVisible] = useState(false);

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
    fetchCreators();
  }, [navigate]);

  const getToken = () => localStorage.getItem("collexa_admin_token") ?? "";

  const fetchAdmins = async (token: string) => {
    try {
      const res = await fetch("/api/admin/list", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setAdmins(await res.json());
      else { localStorage.removeItem("collexa_admin_token"); navigate("/collexa-hq-portal"); }
    } catch (err) { console.error("Failed to fetch admins", err); }
  };

  const fetchSubmissions = async (token: string) => {
    try {
      const res = await fetch("/api/submissions", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setSubmissions(await res.json());
    } catch (err) { console.error("Failed to fetch submissions", err); }
  };

  const fetchContactInfo = async () => {
    try {
      const res = await fetch("/api/contact-info");
      if (res.ok) setContactInfo(await res.json());
    } catch (err) { console.error("Failed to fetch contact info", err); }
  };

  const fetchCreators = async () => {
    try {
      const res = await fetch("/api/creators");
      if (res.ok) setCreators(await res.json());
    } catch (err) { console.error("Failed to fetch creators", err); }
  };

  const showMsg = (text: string, type: "success" | "error") => setMessage({ text, type });

  // ── Admin handlers ──────────────────────────────────────────────────────────

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      const data = await res.json();
      if (res.ok) { showMsg("Administrator created successfully", "success"); setNewEmail(""); setNewPassword(""); fetchAdmins(getToken()); }
      else showMsg(data.error || "Creation failed", "error");
    } catch { showMsg("Network error", "error"); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdminId || !changePasswordValue) return;
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ adminId: editingAdminId, newPassword: changePasswordValue }),
      });
      if (res.ok) { showMsg("Password updated", "success"); setEditingAdminId(null); setChangePasswordValue(""); }
      else { const d = await res.json(); showMsg(d.error || "Update failed", "error"); }
    } catch { showMsg("Network error", "error"); }
  };

  const handleManualSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualSub),
      });
      if (res.ok) {
        showMsg("Manual submission recorded", "success");
        setShowManualForm(false);
        setManualSub({ userType: "brand", name: "", company: "", email: "", phone: "", message: "", projectType: "", timeline: "", niche: "", platforms: "", followers: "" });
        fetchSubmissions(getToken());
      }
    } catch { showMsg("Failed to create submission", "error"); }
  };

  // ── Contact info handlers ───────────────────────────────────────────────────

  const handleCreateContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/contact-info", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ category: newCategory, value: newValue, label: newLabel }),
      });
      if (res.ok) { showMsg("Contact detail added", "success"); setNewValue(""); setNewLabel(""); fetchContactInfo(); }
      else { const d = await res.json(); showMsg(d.error || "Failed", "error"); }
    } catch { showMsg("Network error", "error"); }
  };

  const handleDeleteContactInfo = async (id: string) => {
    if (!window.confirm("Remove this contact detail?")) return;
    try {
      await fetch(`/api/contact-info/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
      fetchContactInfo();
    } catch (err) { console.error(err); }
  };

  // ── Creator handlers ────────────────────────────────────────────────────────

  const openAddCreator = () => {
    setEditingCreatorId(null);
    setCreatorForm({ ...EMPTY_CREATOR, displayOrder: creators.length });
    setCreatorFormVisible(true);
    setMessage({ text: "", type: "" });
  };

  const openEditCreator = (c: Creator) => {
    setEditingCreatorId(c.id);
    setCreatorForm({ name: c.name, handle: c.handle, followers: c.followers, niche: c.niche, about: c.about, imageUrl: c.imageUrl, displayOrder: c.displayOrder });
    setCreatorFormVisible(true);
    setMessage({ text: "", type: "" });
  };

  const cancelCreatorForm = () => {
    setCreatorFormVisible(false);
    setEditingCreatorId(null);
    setCreatorForm(EMPTY_CREATOR);
  };

  const handleSaveCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorForm.name.trim() || !creatorForm.handle.trim()) {
      showMsg("Name and handle are required", "error");
      return;
    }
    try {
      const url = editingCreatorId ? `/api/creators/${editingCreatorId}` : "/api/creators";
      const method = editingCreatorId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(creatorForm),
      });
      if (res.ok) {
        showMsg(editingCreatorId ? "Creator updated" : "Creator added", "success");
        cancelCreatorForm();
        fetchCreators();
      } else {
        const d = await res.json();
        showMsg(d.error || "Save failed", "error");
      }
    } catch { showMsg("Network error", "error"); }
  };

  const handleDeleteCreator = async (id: string) => {
    if (!window.confirm("Remove this creator from the homepage?")) return;
    try {
      const res = await fetch(`/api/creators/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.ok) { fetchCreators(); showMsg("Creator removed", "success"); }
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => { localStorage.removeItem("collexa_admin_token"); navigate("/collexa-hq-portal"); };

  const filteredSubmissions = submissions.filter((s) => submissionFilter === "all" || s.userType === submissionFilter);

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "submissions", label: `Submissions (${submissions.length})` },
    { key: "contact", label: "Contact Details" },
    { key: "creators", label: `Top Creators (${creators.length})` },
    { key: "admins", label: "Admin Access" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 pb-8 border-b border-neutral-800">
          <div>
            <h1 className="text-2xl tracking-tighter font-light mb-1">HQ DASHBOARD</h1>
            <p className="text-neutral-500 text-sm">System Administration</p>
          </div>
          <button onClick={handleLogout} className="text-sm tracking-widest uppercase text-neutral-400 hover:text-white transition-colors border border-neutral-800 px-6 py-2 rounded-sm">
            Logout
          </button>
        </header>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-neutral-800 mb-12 uppercase tracking-widest text-sm text-neutral-500 overflow-x-auto whitespace-nowrap">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              className={`pb-4 transition-colors relative ${activeTab === key ? "text-white" : "hover:text-neutral-300"}`}
              onClick={() => { setActiveTab(key); setMessage({ text: "", type: "" }); cancelCreatorForm(); }}
            >
              {label}
              {activeTab === key && <div className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-white" />}
            </button>
          ))}
        </div>

        {/* Global message banner */}
        {message.text && (
          <div className={`mb-8 p-4 rounded-sm text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {message.text}
          </div>
        )}

        {/* ── ADMINS TAB ── */}
        {activeTab === "admins" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-xl font-light mb-8">Spawn New Admin</h2>
              <form onSubmit={handleCreateAdmin} className="space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-sm">
                <div>
                  <label className={labelCls}>Admin Email</label>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="name@collexa.social" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Secure Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className={inputCls} required />
                </div>
                <button type="submit" className="w-full py-4 bg-white text-black text-sm tracking-widest uppercase hover:bg-neutral-200 transition-colors mt-4 rounded-sm">
                  Create Administrator
                </button>
              </form>
            </div>

            <div className="lg:col-span-7">
              <h2 className="text-xl font-light mb-8">Active Administrators</h2>
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div key={admin.id} className="p-6 border border-neutral-800 rounded-sm bg-neutral-900/50">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-lg mb-1">{admin.email}</div>
                        <div className="text-xs text-neutral-500 font-mono">{admin.id}</div>
                      </div>
                      <button
                        onClick={() => { setEditingAdminId(editingAdminId === admin.id ? null : admin.id); setMessage({ text: "", type: "" }); }}
                        className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                      >
                        {editingAdminId === admin.id ? "Cancel" : "Change Password"}
                      </button>
                    </div>
                    {editingAdminId === admin.id && (
                      <form onSubmit={handleChangePassword} className="mt-4 pt-4 border-t border-neutral-800 space-y-4">
                        <input type="password" value={changePasswordValue} onChange={(e) => setChangePasswordValue(e.target.value)} placeholder="New secure password" className={inputCls} required />
                        <button type="submit" className="text-xs uppercase tracking-widest bg-white text-black px-4 py-2 rounded-sm hover:bg-neutral-200">Update Password</button>
                      </form>
                    )}
                    <div className="text-xs text-neutral-600 uppercase tracking-widest mt-2">
                      Since <span className="text-neutral-400">{new Date(admin.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {admins.length === 0 && (
                  <div className="p-8 border border-neutral-800 rounded-sm text-center text-neutral-500">Loading active administrators...</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CONTACT TAB ── */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-xl font-light mb-8">Add Contact Detail</h2>
              <form onSubmit={handleCreateContactInfo} className="space-y-6 bg-neutral-900 border border-neutral-800 p-8 rounded-sm">
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className={inputCls}>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="location">Location</option>
                    <option value="follow">Follow Link</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Value (Email, Phone, Address, URL)</label>
                  <input type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="e.g., hello@collexa.social" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Label (e.g., "Business", "Instagram")</label>
                  <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Optional label" className={inputCls} />
                </div>
                <button type="submit" className="w-full py-4 bg-white text-black text-sm tracking-widest uppercase hover:bg-neutral-200 transition-colors mt-4 rounded-sm">Add Detail</button>
              </form>
            </div>

            <div className="lg:col-span-7">
              <h2 className="text-xl font-light mb-8">Existing Details</h2>
              <div className="space-y-4">
                {["email", "phone", "location", "follow"].map((cat) => (
                  <div key={cat} className="space-y-3">
                    <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-600 font-medium ml-1">{cat}s</h3>
                    {contactInfo.filter((item) => item.category === cat).map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 border border-neutral-800 rounded-sm bg-neutral-900/50 group">
                        <div>
                          <div className="text-sm font-light text-white">{item.value}</div>
                          {item.label && <div className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">{item.label}</div>}
                        </div>
                        <button onClick={() => handleDeleteContactInfo(item.id)} className="text-neutral-600 hover:text-red-500 transition-colors text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100">
                          Remove
                        </button>
                      </div>
                    ))}
                    {contactInfo.filter((item) => item.category === cat).length === 0 && (
                      <div className="p-4 border border-dashed border-neutral-800 rounded-sm text-center text-neutral-700 text-xs italic">No {cat} details added</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CREATORS TAB ── */}
        {activeTab === "creators" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-light">Top Creators</h2>
              {!creatorFormVisible && (
                <button onClick={openAddCreator} className="px-6 py-2 bg-white text-black text-xs uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition-colors">
                  + Add Creator
                </button>
              )}
            </div>

            {/* Add / Edit Form */}
            {creatorFormVisible && (
              <div className="mb-12 bg-neutral-900 border border-neutral-800 p-8 rounded-sm">
                <h3 className="text-lg font-light mb-6">{editingCreatorId ? "Edit Creator" : "Add Creator"}</h3>
                <form onSubmit={handleSaveCreator} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Full Name *</label>
                    <input
                      type="text"
                      value={creatorForm.name}
                      onChange={(e) => setCreatorForm({ ...creatorForm, name: e.target.value })}
                      placeholder="Creator's full name"
                      className={inputCls}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Instagram Handle *</label>
                    <input
                      type="text"
                      value={creatorForm.handle}
                      onChange={(e) => setCreatorForm({ ...creatorForm, handle: e.target.value })}
                      placeholder="@username"
                      className={inputCls}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Followers (e.g., 500K, 1.2M)</label>
                    <input
                      type="text"
                      value={creatorForm.followers}
                      onChange={(e) => setCreatorForm({ ...creatorForm, followers: e.target.value })}
                      placeholder="e.g., 250K"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Niche / Category</label>
                    <input
                      type="text"
                      value={creatorForm.niche}
                      onChange={(e) => setCreatorForm({ ...creatorForm, niche: e.target.value })}
                      placeholder="e.g., Fashion & Lifestyle"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Photo URL</label>
                    <input
                      type="url"
                      value={creatorForm.imageUrl}
                      onChange={(e) => setCreatorForm({ ...creatorForm, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Display Order (0 = first)</label>
                    <input
                      type="number"
                      value={creatorForm.displayOrder}
                      onChange={(e) => setCreatorForm({ ...creatorForm, displayOrder: parseInt(e.target.value) || 0 })}
                      className={inputCls}
                      min={0}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelCls}>About</label>
                    <textarea
                      value={creatorForm.about}
                      onChange={(e) => setCreatorForm({ ...creatorForm, about: e.target.value })}
                      placeholder="Short bio about the creator..."
                      className={`${inputCls} h-28 resize-none`}
                    />
                  </div>

                  {/* Preview photo if URL provided */}
                  {creatorForm.imageUrl && (
                    <div className="md:col-span-2 flex items-center gap-4">
                      <img
                        src={creatorForm.imageUrl}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover border border-neutral-700"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <span className="text-xs text-neutral-500">Photo preview</span>
                    </div>
                  )}

                  <div className="md:col-span-2 flex gap-4">
                    <button type="submit" className="flex-1 py-4 bg-white text-black text-sm uppercase tracking-widest hover:bg-neutral-200 rounded-sm transition-colors">
                      {editingCreatorId ? "Save Changes" : "Add Creator"}
                    </button>
                    <button type="button" onClick={cancelCreatorForm} className="px-8 py-4 border border-neutral-700 text-sm uppercase tracking-widest hover:border-neutral-500 rounded-sm transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Creators list */}
            {creators.length === 0 ? (
              <div className="p-16 border border-neutral-800 rounded-sm text-center text-neutral-500 bg-neutral-900/50">
                <div className="text-2xl mb-2 font-light text-white">No creators yet</div>
                <p>Click "Add Creator" to add your first creator to the homepage.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {creators.map((creator) => (
                  <div key={creator.id} className="border border-neutral-800 bg-neutral-900/50 rounded-sm p-6 flex items-center gap-6 group">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
                      {creator.imageUrl ? (
                        <img src={creator.imageUrl} alt={creator.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-white font-light text-lg">{creator.name}</span>
                        <span className="text-neutral-500 text-sm">{creator.handle.startsWith("@") ? creator.handle : `@${creator.handle}`}</span>
                        {creator.niche && <span className="text-xs uppercase tracking-widest text-neutral-600">{creator.niche}</span>}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-neutral-400 text-sm">{creator.followers} followers</span>
                        <span className="text-neutral-700 text-xs">Order: {creator.displayOrder}</span>
                      </div>
                      {creator.about && <p className="text-neutral-600 text-sm mt-1 truncate">{creator.about}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditCreator(creator)}
                        className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors border border-neutral-700 px-4 py-2 rounded-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCreator(creator.id)}
                        className="text-xs uppercase tracking-widest text-neutral-600 hover:text-red-500 transition-colors border border-neutral-800 hover:border-red-500/30 px-4 py-2 rounded-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SUBMISSIONS TAB ── */}
        {activeTab === "submissions" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-xl font-light">Application Submissions</h2>
              <div className="flex gap-4">
                <div className="flex bg-neutral-900 border border-neutral-800 p-1 rounded-sm">
                  {["all", "brand", "influencer"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSubmissionFilter(f as "all" | "brand" | "influencer")}
                      className={`px-4 py-1.5 text-xs uppercase tracking-widest rounded-sm transition-colors ${submissionFilter === f ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowManualForm(!showManualForm)}
                  className="px-6 py-2 bg-neutral-800 text-white text-xs uppercase tracking-widest rounded-sm hover:bg-neutral-700 transition-colors"
                >
                  {showManualForm ? "Cancel Entry" : "Manual Entry"}
                </button>
              </div>
            </div>

            {showManualForm && (
              <div className="mb-12 bg-neutral-900 border border-neutral-800 p-8 rounded-sm">
                <h3 className="text-lg font-light mb-6">Create Manual Submission</h3>
                <form onSubmit={handleManualSubmission} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className={labelCls}>User Type</label>
                    <select value={manualSub.userType} onChange={(e) => setManualSub({ ...manualSub, userType: e.target.value })} className={inputCls}>
                      <option value="brand">Brand</option>
                      <option value="influencer">Influencer</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Name</label>
                    <input type="text" value={manualSub.name} onChange={(e) => setManualSub({ ...manualSub, name: e.target.value })} className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Company / Social Handle</label>
                    <input type="text" value={manualSub.company} onChange={(e) => setManualSub({ ...manualSub, company: e.target.value })} className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" value={manualSub.email} onChange={(e) => setManualSub({ ...manualSub, email: e.target.value })} className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input type="text" value={manualSub.phone} onChange={(e) => setManualSub({ ...manualSub, phone: e.target.value })} className={inputCls} required />
                  </div>
                  {manualSub.userType === "brand" ? (
                    <>
                      <div>
                        <label className={labelCls}>Project Type</label>
                        <input type="text" value={manualSub.projectType} onChange={(e) => setManualSub({ ...manualSub, projectType: e.target.value })} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Timeline</label>
                        <input type="text" value={manualSub.timeline} onChange={(e) => setManualSub({ ...manualSub, timeline: e.target.value })} className={inputCls} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className={labelCls}>Niche</label>
                        <input type="text" value={manualSub.niche} onChange={(e) => setManualSub({ ...manualSub, niche: e.target.value })} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Platforms</label>
                        <input type="text" value={manualSub.platforms} onChange={(e) => setManualSub({ ...manualSub, platforms: e.target.value })} className={inputCls} />
                      </div>
                    </>
                  )}
                  <div className="md:col-span-2">
                    <label className={labelCls}>Message / Notes</label>
                    <textarea value={manualSub.message} onChange={(e) => setManualSub({ ...manualSub, message: e.target.value })} className={`${inputCls} h-32 resize-none`} />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full py-4 bg-white text-black text-sm uppercase tracking-widest hover:bg-neutral-200 rounded-sm">Record Submission</button>
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
                {filteredSubmissions.map((sub) => (
                  <div key={sub.id} className="border border-neutral-800 bg-neutral-900/50 p-6 rounded-sm flex flex-col">
                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-neutral-800">
                      <div>
                        <span className={`inline-block px-2 py-1 text-xs uppercase tracking-widest rounded-sm mb-3 ${sub.userType === "brand" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"}`}>
                          {sub.userType}
                        </span>
                        <h3 className="text-xl font-light">{sub.name}</h3>
                        <p className="text-neutral-500">{sub.company}</p>
                      </div>
                      <div className="text-right text-xs text-neutral-600">{new Date(sub.createdAt).toLocaleDateString()}</div>
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
                          <div className="flex justify-between"><span className="text-neutral-600">Project Type</span><span className="text-white">{sub.projectType}</span></div>
                          <div className="flex justify-between"><span className="text-neutral-600">Timeline</span><span className="text-white">{sub.timeline}</span></div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between"><span className="text-neutral-600">Niche</span><span className="text-white">{sub.niche}</span></div>
                          <div className="flex justify-between"><span className="text-neutral-600">Platform</span><span className="text-white">{sub.platforms}</span></div>
                          <div className="flex justify-between"><span className="text-neutral-600">Followers</span><span className="text-white">{sub.followers}</span></div>
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
