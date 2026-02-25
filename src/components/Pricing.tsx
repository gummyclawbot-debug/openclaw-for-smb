const plans = [
  {
    name: "One-Time Setup",
    price: "$500",
    period: "one-time",
    desc: "Full OpenClaw install + training on your tools",
    features: ["Complete AI assistant setup", "Configured for your business", "Trained on your tools & workflows", "Same-day installation", "1 hour of live training"],
    cta: true,
  },
  {
    name: "New Features / Fixes",
    price: "$99+",
    period: "per request",
    desc: "Add capabilities or fix anything, AI-vetted",
    features: ["New automations & integrations", "Bug fixes & adjustments", "AI reviews scope before you pay", "Usually done same-day", "No commitment required"],
    cta: false,
  },
  {
    name: "Monthly Maintenance",
    price: "Custom",
    period: "per month",
    desc: "Ongoing support based on your complexity",
    features: ["Proactive monitoring", "Automatic updates", "Priority support", "Monthly performance reports", "Pricing based on your needs"],
    cta: false,
  },
];

export function Pricing() {
  return (
    <section className="section-padding max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Simple, Honest Pricing
      </h2>
      <p className="text-center mb-12" style={{ color: "#a78bfa" }}>
        No subscriptions required. Pay once, own it forever.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, i) => (
          <div key={i} className={i === 0 ? "glass-gold p-8 relative" : "glass p-8"}>
            {i === 0 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ background: "linear-gradient(135deg, #facc15, #eab308)", color: "#1a0e2e" }}>
                MOST POPULAR
              </div>
            )}
            <h3 className="text-xl font-bold mb-1">{p.name}</h3>
            <div className="mb-2">
              <span className={`text-4xl font-extrabold ${i === 0 ? "gold-text" : ""}`}>{p.price}</span>
              <span className="text-sm ml-2" style={{ color: "#a78bfa" }}>{p.period}</span>
            </div>
            <p className="mb-6 text-sm" style={{ color: "#c4b5fd" }}>{p.desc}</p>
            <ul className="space-y-3 mb-8">
              {p.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <span style={{ color: "#a855f7" }}>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {p.cta ? (
              <a href="#booking" className="btn-cta block text-center w-full">Get Started</a>
            ) : (
              <a href="#booking" className="block text-center py-3 rounded-lg font-semibold" style={{ border: "1px solid rgba(139,92,246,0.3)", color: "#c084fc" }}>
                Learn More
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
