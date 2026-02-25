"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f0a1a 0%, #1a0e2e 50%, #0f0a1a 100%)" }}>
      <div className="w-full max-w-md p-8 rounded-2xl border border-purple-500/20" style={{ background: "rgba(15, 10, 26, 0.8)", backdropFilter: "blur(20px)" }}>
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🐾</div>
          <h1 className="text-2xl font-bold text-purple-100">OpenClaw Admin</h1>
          <p className="text-purple-400 text-sm mt-1">Sign in to manage your CRM</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-100 placeholder-purple-500 focus:border-purple-400 focus:outline-none"
              placeholder="admin@openclaw.ai"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-100 placeholder-purple-500 focus:border-purple-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-black transition-all"
            style={{ background: "linear-gradient(135deg, #facc15, #eab308)" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
