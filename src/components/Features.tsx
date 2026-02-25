const features = [
  { icon: "📞", title: "Answers Phones & Emails", desc: "Your AI picks up calls, reads emails, and responds intelligently — even at 3am." },
  { icon: "📅", title: "Books Appointments Automatically", desc: "Clients book themselves. No back-and-forth. Syncs with your calendar instantly." },
  { icon: "🔔", title: "Sends Reminders & Follow-Ups", desc: "Automated texts and emails so no-shows drop and clients feel taken care of." },
  { icon: "📊", title: "Runs Reports & Updates Spreadsheets", desc: "Daily summaries, revenue tracking, inventory counts — all on autopilot." },
  { icon: "⏰", title: "Works 24/7/365 — No Days Off", desc: "No sick days, no vacations, no overtime. Your AI never sleeps." },
  { icon: "🔒", title: "100% Private — Runs On Your Computer", desc: "Nothing goes to the cloud. Your data stays in your office, period." },
];

export function Features() {
  return (
    <section className="section-padding max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Everything It Does For You
      </h2>
      <p className="text-center mb-12" style={{ color: "#a78bfa" }}>
        Six powerful capabilities. One flat setup fee.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="glass feature-card p-6">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p style={{ color: "#c4b5fd", lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
