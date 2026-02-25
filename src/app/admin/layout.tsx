"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/leads", label: "Leads", icon: "👥" },
  { href: "/admin/calendar", label: "Calendar", icon: "📅" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Don't protect the login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) { setAuthed(true); return; }
    fetch("/api/auth/me").then((r) => {
      if (r.ok) setAuthed(true);
      else { setAuthed(false); router.push("/admin/login"); }
    });
  }, [isLoginPage, router]);

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a1a" }}>
        <div className="text-purple-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#0f0a1a", color: "#f3e8ff" }}>
      {/* Sidebar */}
      <aside className="w-60 border-r border-purple-500/10 p-4 flex flex-col" style={{ background: "rgba(26, 14, 46, 0.5)" }}>
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="text-2xl">🐾</span>
          <span className="font-bold text-lg text-purple-100">OpenClaw CRM</span>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                pathname === item.href
                  ? "bg-purple-600/20 text-purple-100 font-medium"
                  : "text-purple-400 hover:text-purple-200 hover:bg-purple-600/10"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-purple-500/10 pt-4 mt-4">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-purple-400 hover:text-purple-200 hover:bg-purple-600/10">
            <span>🌐</span> View Landing Page
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-purple-400 hover:text-red-300 hover:bg-red-600/10 w-full text-left mt-1"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
