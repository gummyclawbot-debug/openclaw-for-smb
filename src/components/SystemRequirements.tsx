const requirements = [
  {
    icon: "💻",
    title: "Operating System",
    items: [
      "Windows 10 or later (64-bit)",
      "macOS 12 Monterey or later",
      "Ubuntu 22.04+ / Debian 12+ (or equivalent)",
    ],
  },
  {
    icon: "⚡",
    title: "Hardware",
    items: [
      "4 GB RAM minimum (8 GB recommended)",
      "2 GB free disk space",
      "Any modern processor (Intel i3+ / Apple M1+ / AMD Ryzen 3+)",
    ],
  },
  {
    icon: "🌐",
    title: "Browser",
    items: [
      "Chrome 100+, Firefox 100+, Safari 16+, or Edge 100+",
      "JavaScript must be enabled",
      "Dashboard works on mobile browsers too",
    ],
  },
  {
    icon: "📡",
    title: "Internet Connection",
    items: [
      "Stable broadband (5 Mbps+ recommended)",
      "Required for phone/SMS integration and real-time sync",
      "AI runs locally — internet is only for communication channels",
    ],
  },
  {
    icon: "🔧",
    title: "Prerequisites",
    items: [
      "No additional software needed — we install everything during setup",
      "Admin/root access to the computer during initial install",
      "A dedicated business phone number (we can help you get one)",
    ],
  },
];

export function SystemRequirements() {
  return (
    <section className="section-padding max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        System Requirements
      </h2>
      <p className="text-center mb-12" style={{ color: "#a78bfa" }}>
        Everything your AI employee needs to run smoothly.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {requirements.map((req, i) => (
          <div
            key={i}
            className={`glass p-6 ${i === requirements.length - 1 && requirements.length % 2 !== 0 ? "md:col-span-2 md:max-w-md md:mx-auto" : ""}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{req.icon}</span>
              <h3 className="text-lg font-semibold" style={{ color: "#e9d5ff" }}>
                {req.title}
              </h3>
            </div>
            <ul className="space-y-2">
              {req.items.map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "#c4b5fd", lineHeight: 1.6 }}
                >
                  <span style={{ color: "#a855f7", flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
