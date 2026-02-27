#!/usr/bin/env python3
"""
Demo Site Generator for OpenClaw for SMB
Generates stunning, industry-specific single-page HTML demo sites for leads.
Input: JSON via stdin with lead data
Output: JSON with { html_path, screenshot_path, status }
"""

import json
import sys
import os
import uuid
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).parent
SITES_DIR = BASE_DIR / "sites"
SCREENSHOTS_DIR = BASE_DIR / "screenshots"
SITES_DIR.mkdir(exist_ok=True)
SCREENSHOTS_DIR.mkdir(exist_ok=True)

# ── Industry Themes ──────────────────────────────────────────────────────────

THEMES = {
    "dental": {
        "name": "Healthcare / Dental",
        "gradient": "from-cyan-500 via-blue-500 to-indigo-600",
        "accent": "#06b6d4",
        "accent2": "#3b82f6",
        "bg": "#0a1628",
        "card_bg": "rgba(6, 182, 212, 0.08)",
        "border": "rgba(6, 182, 212, 0.2)",
        "hero_emoji": "🦷",
        "hero_tagline": "AI-Powered Practice Management",
        "features": [
            ("📅", "Smart Scheduling", "AI auto-fills cancellations, optimizes chair time, and sends personalized reminders — zero no-shows."),
            ("🤖", "AI Front Desk", "24/7 virtual receptionist handles calls, books appointments, and answers insurance questions instantly."),
            ("📋", "Patient Intake Automation", "Digital forms pre-filled with AI, insurance verification in seconds, not hours."),
            ("📊", "Revenue Intelligence", "Real-time dashboard shows production per chair, identifies gaps, and suggests upsell opportunities."),
        ],
        "mockup_title": "Today's Schedule — AI Optimized",
        "mockup_items": ["9:00 AM — Crown Prep (Dr. Smith) ✅ Confirmed", "10:30 AM — Root Canal (Dr. Lee) ⚠️ Rescheduled by AI", "1:00 PM — New Patient Exam 🤖 Auto-booked from website", "2:30 PM — Cleaning (Hygiene) 📱 Reminder sent"],
        "testimonial": "We went from 12 no-shows a week to nearly zero. The AI receptionist pays for itself in a single day.",
        "testimonial_author": "Dr. Sarah M., Family Dentistry",
    },
    "roofing": {
        "name": "Construction / Roofing",
        "gradient": "from-amber-600 via-orange-600 to-red-700",
        "accent": "#d97706",
        "accent2": "#ea580c",
        "bg": "#1a0f0a",
        "card_bg": "rgba(217, 119, 6, 0.08)",
        "border": "rgba(217, 119, 6, 0.2)",
        "hero_emoji": "🏗️",
        "hero_tagline": "AI That Works as Hard as You Do",
        "features": [
            ("📸", "AI Damage Detection", "Upload drone photos — AI identifies damage, measures affected area, and generates repair estimates in minutes."),
            ("📝", "Instant Estimates", "AI creates professional, accurate estimates on-site. No more going back to the office to quote."),
            ("📞", "Lead Follow-Up Bot", "Never miss a lead. AI calls back within 60 seconds, qualifies the job, and books the inspection."),
            ("📊", "Job Tracking Dashboard", "Real-time crew locations, material tracking, and weather-adjusted scheduling."),
        ],
        "mockup_title": "Active Jobs — AI Dashboard",
        "mockup_items": ["🏠 142 Oak St — Tear-off in progress (Crew A)", "🏠 89 Maple Dr — Inspection scheduled ⛈️ Weather alert", "🏠 301 Pine Ave — Estimate sent ($14,200) 🤖 Auto-follow-up", "🏠 77 Cedar Ln — Materials delivered ✅"],
        "testimonial": "The AI estimator cut our quote time from 2 hours to 10 minutes. We close 3x more jobs now.",
        "testimonial_author": "Mike R., Premium Roofing Co.",
    },
    "legal": {
        "name": "Legal",
        "gradient": "from-blue-900 via-indigo-800 to-purple-900",
        "accent": "#c9a84c",
        "accent2": "#6366f1",
        "bg": "#0a0d1a",
        "card_bg": "rgba(201, 168, 76, 0.06)",
        "border": "rgba(201, 168, 76, 0.2)",
        "hero_emoji": "⚖️",
        "hero_tagline": "AI Legal Operations Suite",
        "features": [
            ("📄", "Document Automation", "Generate contracts, NDAs, and filings in seconds with AI-powered templates that learn your style."),
            ("🔍", "AI Case Research", "Search decades of case law instantly. AI highlights relevant precedents and summarizes findings."),
            ("⏱️", "Smart Time Tracking", "AI auto-logs billable hours from emails, calls, and document edits. Never miss a minute."),
            ("🤝", "Client Intake Bot", "24/7 AI intake specialist screens potential clients, captures case details, and schedules consultations."),
        ],
        "mockup_title": "Case Pipeline — AI Insights",
        "mockup_items": ["📁 Johnson v. Smith — Discovery phase, 3 docs AI-reviewed", "📁 Estate of Williams — Draft ready for review ✅", "📁 Martinez Consultation — AI screened, high-value case 🔥", "📁 Chen Contract — Auto-generated, pending signature 📝"],
        "testimonial": "Our paralegals save 20 hours a week on document review alone. The ROI was immediate.",
        "testimonial_author": "Jennifer L., Partner at L&P Associates",
    },
    "hvac": {
        "name": "HVAC",
        "gradient": "from-sky-600 via-blue-600 to-slate-700",
        "accent": "#0284c7",
        "accent2": "#64748b",
        "bg": "#0c1520",
        "card_bg": "rgba(2, 132, 199, 0.08)",
        "border": "rgba(2, 132, 199, 0.2)",
        "hero_emoji": "❄️",
        "hero_tagline": "Smart HVAC Operations, Powered by AI",
        "features": [
            ("🌡️", "Predictive Maintenance", "AI analyzes system data to predict failures before they happen. Reduce emergency calls by 60%."),
            ("📞", "AI Dispatch", "Intelligent job routing based on technician location, skill level, and part availability."),
            ("💰", "Dynamic Pricing", "AI-optimized estimates based on job complexity, seasonality, and local market rates."),
            ("📊", "Fleet & Inventory AI", "Track every van, every part. AI auto-reorders supplies before you run out."),
        ],
        "mockup_title": "Dispatch Board — AI Optimized",
        "mockup_items": ["🔧 Tech A — 142 Oak St (AC Install) ETA 10:30", "🔧 Tech B — 89 Maple Dr (Furnace Repair) ⚠️ Parts needed", "🔧 Tech C — 301 Pine Ave (Maintenance) ✅ Complete", "📦 Auto-order: 3x filters, 2x capacitors → Arriving tomorrow"],
        "testimonial": "AI dispatch alone saved us $4,000/month in fuel and overtime. Game changer for our 12-truck fleet.",
        "testimonial_author": "Dave K., Comfort Air Solutions",
    },
    "restaurant": {
        "name": "Restaurant",
        "gradient": "from-red-600 via-orange-500 to-amber-500",
        "accent": "#dc2626",
        "accent2": "#f59e0b",
        "bg": "#1a0f0a",
        "card_bg": "rgba(220, 38, 38, 0.06)",
        "border": "rgba(220, 38, 38, 0.2)",
        "hero_emoji": "🍽️",
        "hero_tagline": "AI-Powered Restaurant Intelligence",
        "features": [
            ("📱", "AI Ordering System", "Guests order via QR code with AI upsell suggestions. Average ticket increases 22%."),
            ("📅", "Smart Reservations", "AI manages waitlists, optimizes table turns, and predicts no-shows before they happen."),
            ("📦", "Inventory Forecasting", "AI predicts demand by day, weather, and events. Cut food waste by 35%."),
            ("⭐", "Review Response Bot", "AI monitors and responds to Google/Yelp reviews in your brand voice within minutes."),
        ],
        "mockup_title": "Tonight's Service — AI Insights",
        "mockup_items": ["🍽️ 85% capacity predicted (Friday + clear weather)", "📱 12 online orders queued — avg ticket $47 (+$8 AI upsell)", "⚠️ Low stock alert: salmon (AI adjusted tomorrow's order)", "⭐ New 5-star review — AI response drafted ✅"],
        "testimonial": "The AI ordering system paid for itself in the first week. Our average ticket went from $38 to $47.",
        "testimonial_author": "Maria G., Bella Cucina Restaurant",
    },
    "generic": {
        "name": "Business",
        "gradient": "from-purple-600 via-violet-600 to-fuchsia-600",
        "accent": "#a855f7",
        "accent2": "#facc15",
        "bg": "#0f0a1a",
        "card_bg": "rgba(168, 85, 247, 0.06)",
        "border": "rgba(168, 85, 247, 0.2)",
        "hero_emoji": "🚀",
        "hero_tagline": "AI Automation for Modern Business",
        "features": [
            ("🤖", "AI Assistant", "24/7 virtual employee handles calls, emails, scheduling, and customer questions — never takes a day off."),
            ("📊", "Smart Analytics", "Real-time business intelligence dashboard. AI spots trends, anomalies, and opportunities automatically."),
            ("⚡", "Workflow Automation", "Connect your tools with AI-powered workflows. Eliminate repetitive tasks and human error."),
            ("💬", "Customer Engagement", "AI-powered chat, SMS, and email campaigns that feel personal — because AI learns each customer."),
        ],
        "mockup_title": "Business Dashboard — AI Insights",
        "mockup_items": ["📈 Revenue up 18% this month (AI-attributed)", "🤖 AI handled 142 customer interactions today", "⏱️ 23 hours saved this week on manual tasks", "🔔 3 new leads auto-qualified and scheduled"],
        "testimonial": "We replaced 3 different software subscriptions with one AI system. It actually works better and costs less.",
        "testimonial_author": "Alex T., Small Business Owner",
    },
}

INDUSTRY_MAP = {
    "dental": "dental", "dentist": "dental", "healthcare": "dental", "medical": "dental", "clinic": "dental", "orthodont": "dental",
    "roofing": "roofing", "construction": "roofing", "contractor": "roofing", "building": "roofing", "remodel": "roofing",
    "legal": "legal", "law": "legal", "attorney": "legal", "lawyer": "legal",
    "hvac": "hvac", "heating": "hvac", "cooling": "hvac", "plumbing": "hvac",
    "restaurant": "restaurant", "food": "restaurant", "cafe": "restaurant", "bar": "restaurant", "catering": "restaurant", "pizza": "restaurant",
}


def detect_theme(industry) -> str:
    if not industry:
        return "generic"
    lower = industry.lower()
    for keyword, theme_key in INDUSTRY_MAP.items():
        if keyword in lower:
            return theme_key
    return "generic"


def build_time_waster_section(time_waster, theme) -> str:
    if not time_waster:
        return ""
    return f"""
    <section class="py-16 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <div class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6"
             style="background: {theme['card_bg']}; border: 1px solid {theme['border']}; color: {theme['accent']};">
          Your #1 Time Waster — Solved
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          &ldquo;{time_waster}&rdquo;
        </h2>
        <p class="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          You told us this is what eats your time. Our AI eliminates it — automatically, 24/7, starting day one.
        </p>
        <div class="grid md:grid-cols-3 gap-6 text-left">
          <div class="p-5 rounded-xl" style="background: {theme['card_bg']}; border: 1px solid {theme['border']};">
            <div class="text-2xl mb-2">⏰</div>
            <h3 class="text-white font-semibold mb-1">Before AI</h3>
            <p class="text-gray-400 text-sm">Hours lost weekly to manual work. Errors. Missed opportunities. Burnout.</p>
          </div>
          <div class="p-5 rounded-xl" style="background: {theme['card_bg']}; border: 1px solid {theme['border']};">
            <div class="text-2xl mb-2">🤖</div>
            <h3 class="text-white font-semibold mb-1">AI Takes Over</h3>
            <p class="text-gray-400 text-sm">Intelligent automation handles it instantly. Learns and improves every day.</p>
          </div>
          <div class="p-5 rounded-xl" style="background: {theme['card_bg']}; border: 1px solid {theme['border']};">
            <div class="text-2xl mb-2">🚀</div>
            <h3 class="text-white font-semibold mb-1">After AI</h3>
            <p class="text-gray-400 text-sm">You focus on growing your business. AI handles the rest, perfectly, every time.</p>
          </div>
        </div>
      </div>
    </section>
    """


def generate_html(lead: dict) -> str:
    business_name = lead.get("business_name", "Your Business")
    industry = lead.get("industry")
    time_waster = lead.get("time_waster")

    theme_key = detect_theme(industry)
    theme = THEMES[theme_key]

    features_html = ""
    for emoji, title, desc in theme["features"]:
        features_html += f"""
        <div class="group p-6 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-default"
             style="background: {theme['card_bg']}; border: 1px solid {theme['border']};">
          <div class="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{emoji}</div>
          <h3 class="text-lg font-bold text-white mb-2">{title}</h3>
          <p class="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
        """

    mockup_items_html = ""
    for item in theme["mockup_items"]:
        mockup_items_html += f"""
          <div class="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-white/5" style="border-bottom: 1px solid {theme['border']};">
            <span class="text-sm text-gray-300">{item}</span>
          </div>
        """

    time_waster_html = build_time_waster_section(time_waster, theme)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{business_name} — AI Demo by OpenClaw</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {{ font-family: 'Inter', sans-serif; }}
    body {{ background: {theme['bg']}; }}

    @keyframes float {{
      0%, 100% {{ transform: translateY(0px); }}
      50% {{ transform: translateY(-20px); }}
    }}
    @keyframes pulse-glow {{
      0%, 100% {{ opacity: 0.4; }}
      50% {{ opacity: 0.8; }}
    }}
    @keyframes gradient-shift {{
      0% {{ background-position: 0% 50%; }}
      50% {{ background-position: 100% 50%; }}
      100% {{ background-position: 0% 50%; }}
    }}
    @keyframes typing {{
      from {{ width: 0; }}
      to {{ width: 100%; }}
    }}
    @keyframes blink {{
      50% {{ border-color: transparent; }}
    }}
    @keyframes slide-up {{
      from {{ opacity: 0; transform: translateY(30px); }}
      to {{ opacity: 1; transform: translateY(0); }}
    }}
    @keyframes fade-in {{
      from {{ opacity: 0; }}
      to {{ opacity: 1; }}
    }}

    .float {{ animation: float 6s ease-in-out infinite; }}
    .float-delay {{ animation: float 6s ease-in-out infinite; animation-delay: 2s; }}
    .float-delay-2 {{ animation: float 6s ease-in-out infinite; animation-delay: 4s; }}
    .pulse-glow {{ animation: pulse-glow 3s ease-in-out infinite; }}
    .gradient-text {{
      background: linear-gradient(135deg, {theme['accent']}, {theme['accent2']});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }}
    .gradient-shift {{
      background-size: 200% 200%;
      animation: gradient-shift 4s ease infinite;
    }}
    .slide-up {{ animation: slide-up 0.8s ease-out forwards; }}
    .slide-up-1 {{ animation: slide-up 0.8s ease-out 0.1s forwards; opacity: 0; }}
    .slide-up-2 {{ animation: slide-up 0.8s ease-out 0.2s forwards; opacity: 0; }}
    .slide-up-3 {{ animation: slide-up 0.8s ease-out 0.3s forwards; opacity: 0; }}
    .slide-up-4 {{ animation: slide-up 0.8s ease-out 0.4s forwards; opacity: 0; }}

    .hero-orb {{
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.15;
    }}
    .mockup-window {{
      background: rgba(0,0,0,0.4);
      border: 1px solid {theme['border']};
      border-radius: 12px;
      overflow: hidden;
    }}
    .mockup-titlebar {{
      background: rgba(0,0,0,0.6);
      padding: 8px 12px;
      display: flex;
      gap: 6px;
      align-items: center;
    }}
    .mockup-dot {{
      width: 10px; height: 10px; border-radius: 50%;
    }}
  </style>
</head>
<body class="text-gray-100 overflow-x-hidden">

  <!-- ── Hero ────────────────────────────────────────── -->
  <section class="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
    <div class="hero-orb w-96 h-96 -top-20 -left-20 float" style="background: {theme['accent']};"></div>
    <div class="hero-orb w-80 h-80 top-1/3 right-0 float-delay" style="background: {theme['accent2']};"></div>
    <div class="hero-orb w-64 h-64 bottom-0 left-1/3 float-delay-2" style="background: {theme['accent']};"></div>

    <div class="relative z-10 text-center max-w-4xl">
      <div class="slide-up">
        <span class="text-6xl mb-6 block">{theme['hero_emoji']}</span>
      </div>
      <div class="slide-up-1">
        <div class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6"
             style="background: {theme['card_bg']}; border: 1px solid {theme['border']}; color: {theme['accent']};">
          Built for {business_name}
        </div>
      </div>
      <h1 class="text-5xl md:text-7xl font-black mb-6 leading-tight slide-up-2">
        <span class="gradient-text">{theme['hero_tagline']}</span>
      </h1>
      <p class="text-xl text-gray-400 max-w-2xl mx-auto mb-10 slide-up-3">
        See how AI can transform <strong class="text-white">{business_name}</strong> — automating the work that slows you down and unlocking growth you didn't think was possible.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center slide-up-4">
        <a href="#features" class="px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r {theme['gradient']} hover:scale-105 transition-transform duration-300 shadow-lg">
          See What AI Can Do →
        </a>
        <a href="#pricing" class="px-8 py-4 rounded-xl font-bold text-lg border hover:bg-white/5 transition-colors duration-300"
           style="border-color: {theme['border']}; color: {theme['accent']};">
          View Pricing
        </a>
      </div>
    </div>
  </section>

  <!-- ── Features ────────────────────────────────────── -->
  <section id="features" class="py-20 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-14">
        <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">Everything You Need, Automated</h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">AI features custom-built for {theme['name'].lower()} businesses like yours.</p>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        {features_html}
      </div>
    </div>
  </section>

  {time_waster_html}

  <!-- ── AI Mockup ───────────────────────────────────── -->
  <section class="py-20 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Your AI Dashboard Preview</h2>
        <p class="text-gray-400">A glimpse of what {business_name}'s AI command center looks like.</p>
      </div>
      <div class="mockup-window">
        <div class="mockup-titlebar">
          <div class="mockup-dot" style="background: #ff5f57;"></div>
          <div class="mockup-dot" style="background: #febc2e;"></div>
          <div class="mockup-dot" style="background: #28c840;"></div>
          <span class="ml-3 text-xs text-gray-500">{theme['mockup_title']}</span>
        </div>
        <div class="p-4 space-y-1">
          {mockup_items_html}
        </div>
        <div class="p-4 flex items-center gap-2" style="border-top: 1px solid {theme['border']};">
          <div class="w-2 h-2 rounded-full pulse-glow" style="background: {theme['accent']};"></div>
          <span class="text-xs text-gray-500">AI is monitoring... Last updated 2 min ago</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Testimonial ─────────────────────────────────── -->
  <section class="py-16 px-6">
    <div class="max-w-3xl mx-auto text-center">
      <div class="text-5xl mb-6">&ldquo;</div>
      <blockquote class="text-xl md:text-2xl text-gray-300 italic mb-6 leading-relaxed">
        {theme['testimonial']}
      </blockquote>
      <p class="text-sm font-semibold" style="color: {theme['accent']};">— {theme['testimonial_author']}</p>
    </div>
  </section>

  <!-- ── Pricing ─────────────────────────────────────── -->
  <section id="pricing" class="py-20 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
      <p class="text-gray-400 text-lg mb-12">No hidden fees. No long contracts. Just results.</p>
      <div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <div class="p-8 rounded-2xl text-left" style="background: {theme['card_bg']}; border: 1px solid {theme['border']};">
          <div class="text-sm font-semibold uppercase tracking-wider mb-2" style="color: {theme['accent']};">Setup</div>
          <div class="text-4xl font-black text-white mb-2">$500</div>
          <p class="text-gray-400 text-sm mb-6">One-time AI setup & customization</p>
          <ul class="space-y-3 text-sm text-gray-300">
            <li class="flex items-center gap-2"><span style="color: {theme['accent']};">✓</span> Custom AI agent trained on your business</li>
            <li class="flex items-center gap-2"><span style="color: {theme['accent']};">✓</span> Integration with your existing tools</li>
            <li class="flex items-center gap-2"><span style="color: {theme['accent']};">✓</span> 1-on-1 onboarding session</li>
            <li class="flex items-center gap-2"><span style="color: {theme['accent']};">✓</span> 30-day performance guarantee</li>
          </ul>
        </div>
        <div class="p-8 rounded-2xl text-left relative overflow-hidden" style="background: {theme['card_bg']}; border: 2px solid {theme['accent']};">
          <div class="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg" style="background: {theme['accent']};">RECOMMENDED</div>
          <div class="text-sm font-semibold uppercase tracking-wider mb-2" style="color: {theme['accent']};">Monthly</div>
          <div class="text-4xl font-black text-white mb-2">$299<span class="text-lg text-gray-400 font-normal">/mo</span></div>
          <p class="text-gray-400 text-sm mb-6">Ongoing AI management & optimization</p>
          <ul class="space-y-3 text-sm text-gray-300">
            <li class="flex items-center gap-2"><span style="color: {theme['accent']};">✓</span> Unlimited AI interactions</li>
            <li class="flex items-center gap-2"><span style="color: {theme['accent']};">✓</span> Monthly performance reports</li>
            <li class="flex items-center gap-2"><span style="color: {theme['accent']};">✓</span> Priority support</li>
            <li class="flex items-center gap-2"><span style="color: {theme['accent']};">✓</span> Continuous AI improvement</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ── CTA ─────────────────────────────────────────── -->
  <section class="py-20 px-6">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform {business_name}?</h2>
      <p class="text-gray-400 text-lg mb-8">Join hundreds of businesses already saving 20+ hours per week with AI.</p>
      <a href="mailto:hello@openclaw.ai" class="inline-block px-10 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r {theme['gradient']} hover:scale-105 transition-transform duration-300 shadow-lg gradient-shift">
        Get Started Today →
      </a>
    </div>
  </section>

  <!-- ── Footer ──────────────────────────────────────── -->
  <footer class="py-8 px-6 text-center" style="border-top: 1px solid {theme['border']};">
    <p class="text-xs text-gray-600">Powered by <strong class="gradient-text">OpenClaw AI</strong> · Custom demo for {business_name}</p>
  </footer>

</body>
</html>"""


def take_screenshot(html_path: str, screenshot_path: str) -> bool:
    """Use Playwright to screenshot the HTML file."""
    try:
        script = f"""
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={{'width': 1280, 'height': 800}})
        await page.goto('file://{html_path}')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='{screenshot_path}', full_page=False)
        await browser.close()

asyncio.run(main())
"""
        result = subprocess.run(
            ["python3", "-c", script],
            capture_output=True, text=True, timeout=30
        )
        return result.returncode == 0
    except Exception:
        return False


def main():
    try:
        lead = json.load(sys.stdin)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input", "status": "error"}))
        sys.exit(1)

    lead_id = lead.get("id", str(uuid.uuid4())[:8])
    slug = lead.get("business_name", "demo").lower().replace(" ", "-").replace("'", "")[:40]
    filename = f"{lead_id}_{slug}"

    html = generate_html(lead)

    html_path = SITES_DIR / f"{filename}.html"
    html_path.write_text(html, encoding="utf-8")

    screenshot_path = SCREENSHOTS_DIR / f"{filename}.png"
    screenshot_ok = take_screenshot(str(html_path.absolute()), str(screenshot_path.absolute()))

    result = {
        "status": "success",
        "html_path": str(html_path),
        "screenshot_path": str(screenshot_path) if screenshot_ok else None,
        "screenshot_ok": screenshot_ok,
        "theme": detect_theme(lead.get("industry")),
        "business_name": lead.get("business_name"),
    }
    print(json.dumps(result))


if __name__ == "__main__":
    main()
