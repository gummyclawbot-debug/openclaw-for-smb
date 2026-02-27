const testimonials = [
  { name: "Dr. Sarah Chen", biz: "Bright Smile Dental", text: "We were missing 30% of calls. Now our AI books every single one. Revenue up 40% in two months." },
  { name: "Marco Ruiz", biz: "Ruiz Roofing Co.", text: "I used to spend 2 hours a day on emails. Now I check my phone and everything's handled." },
  { name: "Lisa Tran", biz: "Pho House Restaurant", text: "Reservations, catering inquiries, even supplier follow-ups. It does it all while I cook." },
  { name: "James O'Brien", biz: "O'Brien Real Estate", text: "My AI follows up with every lead within 5 minutes. My close rate doubled." },
  { name: "Tom Kowalski", biz: "TK Electric", text: "I'm a one-man operation. Now I have a full-time assistant for $500. Insane value." },
  { name: "Angela Davis", biz: "Davis Hair Studio", text: "Clients book themselves at midnight. I wake up to a full schedule." },
  { name: "Jennifer Walsh", biz: "Walsh Legal Services", text: "Client intake is fully automated now. Saves me 15 hours a week easily." },
  { name: "Greg Thompson", biz: "Thompson Towing", text: "24/7 dispatch. The AI takes the call, gets the location, and texts me. Revenue up 35%." },
  { name: "Maria Santos", biz: "Santos Cleaning Services", text: "Booking, rescheduling, and invoicing. I went from 10 clients to 40 without hiring anyone." },
  { name: "Oscar Nguyen", biz: "Nguyen Tax Services", text: "Document collection and deadline tracking during tax season. Zero missed deadlines this year." },
];

export function Testimonials() {
  const row1 = testimonials.slice(0, 5);
  const row2 = testimonials.slice(5, 10);

  return (
    <section className="section-padding overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Trusted by <span className="gold-text">500+</span> Small Businesses
      </h2>
      <p className="text-center mb-12" style={{ color: "#a78bfa" }}>
        Real results from real business owners.
      </p>

      {[row1, row2].map((row, ri) => (
        <div key={ri} className="mb-6 overflow-hidden">
          <div
            className="flex gap-4"
            style={{
              animation: `scroll ${ri === 0 ? 80 : 90}s linear infinite`,
              animationDirection: ri === 1 ? "reverse" : "normal",
              width: "max-content",
            }}
          >
            {[...row, ...row].map((t, i) => (
              <div
                key={i}
                className="glass p-5 flex-shrink-0"
                style={{ width: "320px" }}
              >
                <p className="text-sm mb-3" style={{ color: "#e9d5ff", lineHeight: 1.6 }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, #9333ea, #7e22ce)" }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs" style={{ color: "#a78bfa" }}>
                      {t.biz}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
