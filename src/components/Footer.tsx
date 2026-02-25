export function Footer() {
  return (
    <footer className="text-center py-10 text-sm" style={{ color: "#6b21a8", borderTop: "1px solid rgba(139,92,246,0.1)" }}>
      <p>© {new Date().getFullYear()} OpenClaw for Small Business. All rights reserved.</p>
      <p className="mt-1">Built with 🤖 by OpenClaw</p>
    </footer>
  );
}
