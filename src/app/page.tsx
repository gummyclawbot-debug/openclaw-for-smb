import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { BookingForm } from "@/components/BookingForm";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <BookingForm />
      <FAQ />
      <Footer />
    </main>
  );
}
