import { useState } from "react";
import { useNavigate } from "react-router";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("collexa_admin_token", data.token);
        navigate("/collexa-hq-portal/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error connecting to API");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="mb-12 text-center">
          <h1 className="text-3xl tracking-tighter mb-2 font-light">COLLEXA HQ</h1>
          <p className="text-neutral-500 text-sm tracking-widest uppercase">Secure Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8 bg-neutral-900 border border-neutral-800 p-8 rounded-sm">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-sm text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@collexa.social"
              className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all placeholder:text-neutral-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-3">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black border border-neutral-800 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all placeholder:text-neutral-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-black text-sm tracking-widest uppercase hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Access Portal"}
          </button>
        </form>
      </div>
    </div>
  );
}
