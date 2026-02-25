import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenClaw for Small Business — Your 24/7 AI Employee",
  description:
    "Never miss a call, email, or appointment again. Private AI assistant installed on your computer in one day. $500 one-time setup.",
  keywords: [
    "AI assistant",
    "small business automation",
    "private AI",
    "appointment booking",
    "email automation",
    "OpenClaw",
  ],
  openGraph: {
    title: "Your 24/7 AI Employee — Installed in One Day",
    description:
      "Never miss a call, email, or appointment again. No subscriptions. No cloud spying. Just your own private AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
