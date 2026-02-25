const testimonials = [
  { name: "Dr. Sarah Chen", biz: "Bright Smile Dental", text: "We were missing 30% of calls. Now our AI books every single one. Revenue up 40% in two months." },
  { name: "Marco Ruiz", biz: "Ruiz Roofing Co.", text: "I used to spend 2 hours a day on emails. Now I check my phone and everything's handled." },
  { name: "Lisa Tran", biz: "Pho House Restaurant", text: "Reservations, catering inquiries, even supplier follow-ups. It does it all while I cook." },
  { name: "James O'Brien", biz: "O'Brien Real Estate", text: "My AI follows up with every lead within 5 minutes. My close rate doubled." },
  { name: "Priya Patel", biz: "Patel Family Dentistry", text: "No-shows dropped 60% since the AI started sending reminders. Worth every penny." },
  { name: "Tom Kowalski", biz: "TK Electric", text: "I'm a one-man operation. Now I have a full-time assistant for $500. Insane value." },
  { name: "Angela Davis", biz: "Davis Hair Studio", text: "Clients book themselves at midnight. I wake up to a full schedule." },
  { name: "Mike Hernandez", biz: "Mike's Auto Body", text: "The AI sends estimates and follow-ups. I just focus on the work." },
  { name: "Jennifer Walsh", biz: "Walsh Legal Services", text: "Client intake is fully automated now. Saves me 15 hours a week easily." },
  { name: "Raj Gupta", biz: "QuickFix Plumbing", text: "Emergency calls at 2am? My AI handles them, books the job, and I see it in the morning." },
  { name: "Courtney Blake", biz: "Bloom Flower Shop", text: "Holiday orders used to overwhelm us. Now the AI tracks every order and sends confirmations." },
  { name: "Derek Kim", biz: "Kim's Martial Arts", text: "Class scheduling, belt testing reminders, even birthday messages to students. All automated." },
  { name: "Natalie Foster", biz: "Foster Photography", text: "Client follow-ups and contract reminders happen automatically. I just show up and shoot." },
  { name: "Carlos Mendez", biz: "Mendez Landscaping", text: "I was losing jobs because I couldn't return calls fast enough. Problem solved." },
  { name: "Amy Richardson", biz: "Bright Kids Daycare", text: "Parent communications, attendance tracking, and billing reminders all handled." },
  { name: "Dave Mitchell", biz: "Mitchell HVAC", text: "Seasonal maintenance reminders go out automatically. My repeat business is up 50%." },
  { name: "Susan Park", biz: "Park Veterinary Clinic", text: "Vaccine reminders, appointment scheduling, and prescription refills. Clients love it." },
  { name: "Brian Taylor", biz: "Taylor Construction", text: "Project updates to clients are automatic now. No more angry 'where's my update' calls." },
  { name: "Maria Santos", biz: "Santos Cleaning Services", text: "Booking, rescheduling, and invoicing. I went from 10 clients to 40 without hiring anyone." },
  { name: "Kevin Wright", biz: "Wright Financial Planning", text: "My AI pre-qualifies leads and books consultations. I only talk to serious prospects now." },
  { name: "Rachel Green", biz: "Green Thumb Garden Center", text: "Inventory alerts, supplier orders, and customer rewards tracking. All on autopilot." },
  { name: "Paul Jackson", biz: "Jackson Painting Co.", text: "The AI sends before/after photos to clients and asks for reviews. 5-star ratings everywhere." },
  { name: "Hannah Lee", biz: "Serenity Spa & Wellness", text: "From booking to post-visit follow-up, every client touchpoint is handled beautifully." },
  { name: "Tony Russo", biz: "Russo's Pizzeria", text: "Online orders, phone orders, even complaint handling. My staff can focus on making great food." },
  { name: "Diana Cruz", biz: "Cruz Insurance Agency", text: "Policy renewals and claims follow-ups happen without me lifting a finger." },
  { name: "Steve Anderson", biz: "Anderson Pest Control", text: "Scheduling quarterly treatments and sending reminders. Customer retention is at an all-time high." },
  { name: "Olivia Bennett", biz: "Bennett Bookkeeping", text: "Client document requests, deadline reminders, and status updates. I've taken on 20 new clients." },
  { name: "Chris Murphy", biz: "Murphy's Gym", text: "Member check-ins, class reminders, and billing. Runs smoother than when I had a front desk person." },
  { name: "Aisha Johnson", biz: "Johnson Tutoring", text: "Session scheduling, payment reminders, and progress reports to parents. All automated." },
  { name: "Greg Thompson", biz: "Thompson Towing", text: "24/7 dispatch. The AI takes the call, gets the location, and texts me. Revenue up 35%." },
  { name: "Laura Chen", biz: "Lotus Acupuncture", text: "New patient intake forms, appointment reminders, and insurance verification. Seamless." },
  { name: "Bobby Williams", biz: "Williams Pool Service", text: "Route scheduling, chemical logs, and customer invoicing. I added 25 pools this quarter." },
  { name: "Stephanie Brown", biz: "Brown Interior Design", text: "Project timelines, vendor coordination, and client presentations. My workflow is flawless now." },
  { name: "Nick Papadopoulos", biz: "Nick's Diner", text: "The AI handles all our Google reviews, reservation requests, and even menu questions." },
  { name: "Wendy Liu", biz: "Liu Physical Therapy", text: "Exercise reminders between sessions and insurance pre-auth follow-ups. Patients love the attention." },
  { name: "Frank DeLuca", biz: "DeLuca Plumbing & Heating", text: "My AI answers the phone exactly like I would. Customers don't even know it's not me." },
  { name: "Samantha Reed", biz: "Reed Event Planning", text: "Vendor coordination, timeline management, and client updates. I planned 3 weddings simultaneously." },
  { name: "Oscar Nguyen", biz: "Nguyen Tax Services", text: "Document collection and deadline tracking during tax season. Zero missed deadlines this year." },
  { name: "Beth Carpenter", biz: "Carpenter Chiropractic", text: "Treatment plan reminders and rebooking prompts. Patient retention jumped 45%." },
  { name: "Larry White", biz: "White Fence Company", text: "Estimate follow-ups and scheduling. My conversion rate went from 40% to 72%." },
  { name: "Megan Scott", biz: "Scott Dance Academy", text: "Recital coordination, class schedules, and costume ordering. Parents think I have a huge staff." },
  { name: "Ron Baker", biz: "Baker Locksmith", text: "Emergency calls routed and prioritized 24/7. I sleep better knowing nothing gets missed." },
  { name: "Tina Marshall", biz: "Marshall Real Estate Group", text: "Listing updates, showing schedules, and buyer follow-ups. My team of 3 performs like 10." },
  { name: "Albert Kim", biz: "Kim's Dry Cleaning", text: "Order ready notifications and loyalty tracking. Customer satisfaction through the roof." },
  { name: "Denise Cooper", biz: "Cooper Counseling", text: "Appointment scheduling and intake forms. My clients appreciate the professional experience." },
  { name: "Patrick O'Neal", biz: "O'Neal Moving Company", text: "Quote requests, scheduling, and day-of logistics. Best $500 I ever spent on my business." },
  { name: "Yuki Tanaka", biz: "Sakura Sushi", text: "Takeout orders, reservation management, and catering inquiries. All handled perfectly." },
  { name: "Randy Collins", biz: "Collins Tree Service", text: "Storm damage inquiries flood in. The AI triages, schedules, and follows up. Game changer." },
  { name: "Heather Morgan", biz: "Morgan Pet Grooming", text: "Breed-specific reminders, photo sharing with owners, and rebooking. Clients are obsessed." },
  { name: "Victor Reyes", biz: "Reyes Concrete & Masonry", text: "I bid on 3x more jobs now because my AI handles all the admin. Hired two more guys." },
];

export function Testimonials() {
  const row1 = testimonials.slice(0, 25);
  const row2 = testimonials.slice(25, 50);

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
