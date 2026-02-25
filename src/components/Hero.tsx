export function Hero() {
  return (
    <section className="section-padding text-center max-w-5xl mx-auto" style={{ paddingTop: "6rem", paddingBottom: "4rem" }}>
      <div className="inline-block mb-6 px-4 py-1.5 rounded-full text-sm font-medium" style={{ background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.25)", color: "#facc15" }}>
        🤖 Done-For-You AI Setup — No Tech Skills Needed
      </div>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 glow-text">
        Your 24/7 AI Employee —{" "}
        <span className="gold-text">Installed in One Day</span>
      </h1>
      <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10" style={{ color: "#d8b4fe", lineHeight: 1.7 }}>
        Never miss a call, email, or appointment again. No subscriptions. No
        cloud spying. Just your own private AI that works while you sleep.
      </p>
      <a href="#booking" className="btn-cta text-lg md:text-xl">
        Get Your AI Employee — $500 Setup
      </a>
      <p className="mt-4 text-sm" style={{ color: "#a78bfa" }}>
        One-time payment · No monthly fees required · 100% private
      </p>
    </section>
  );
}
