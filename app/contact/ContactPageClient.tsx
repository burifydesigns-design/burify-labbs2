"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const contactOptions = [
  {
    title: "Email",
    description: "hello@burifylabs.com",
    href: "mailto:hello@burifylabs.com",
  },
];

const CALENDLY_URL = "https://calendly.com/burify-designs/new-meeting";

export function ContactPageClient() {
  const [scrolled, setScrolled] = useState(false);
  const revealRefs = useRef<HTMLElement[]>([]);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");

    const name = bookingName.trim();
    const email = bookingEmail.trim();

    if (!name) {
      setBookingError("Please enter your name.");
      return;
    }

    if (!email) {
      setBookingError("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setBookingError("Please enter a valid email address.");
      return;
    }

    const params = new URLSearchParams();
    params.set("name", name);
    params.set("email", email);
    const calendlyUrl = `${CALENDLY_URL}?${params.toString()}`;

    setIsBooking(true);
    const newTab = window.open(calendlyUrl, "_blank", "noopener,noreferrer");

    if (!newTab) {
      setBookingError(
        "Your browser blocked the new tab. Please allow pop-ups for this site and try again."
      );
      setIsBooking(false);
      return;
    }

    setIsBooking(false);
  };

  return (
    <>
      <Navbar variant={scrolled ? "light" : "transparent"} showCta />
      <main>
        {/* ===== HERO ===== */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" aria-hidden="true" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <p
                ref={(el) => { if (el) revealRefs.current[0] = el; }}
                className="text-caption font-medium uppercase tracking-widest text-primary mb-4"
              >
                Contact
              </p>
              <h1
                ref={(el) => { if (el) revealRefs.current[1] = el; }}
                className="text-h1 md:text-display text-text-primary mb-6 leading-tight"
              >
                Start a project
              </h1>
              <p
                ref={(el) => { if (el) revealRefs.current[2] = el; }}
                className="text-body-lg text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto"
              >
                Tell us about your website or automation needs. We will respond with clear next steps.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CONTACT SECTION ===== */}
        <section className="section bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Info */}
              <div
                ref={(el) => { if (el) revealRefs.current[3] = el; }}
                className="lg:col-span-1"
              >
                <h2 className="text-h3 text-text-primary mb-6">
                  Contact options
                </h2>
                <p className="text-body text-text-secondary mb-8 leading-relaxed">
                  Book a discovery call to discuss your project, goals, and how Burify Labs can help.
                  You can also reach us directly via email.
                </p>

                <div className="space-y-6">
                  {contactOptions.map((option) => (
                    <div key={option.title} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-body font-medium text-text-primary mb-1">{option.title}</h3>
                        {option.href ? (
                          <Link href={option.href} className="text-body text-primary hover:text-primary-dark transition-colors duration-200">
                            {option.description}
                          </Link>
                        ) : (
                          <p className="text-body text-text-secondary">{option.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discovery Call Booking Card */}
              <div
                ref={(el) => { if (el) revealRefs.current[4] = el; }}
                className="lg:col-span-1"
              >
                <div className="p-8 rounded-2xl border border-border bg-background">
                  <h2 className="text-h3 text-text-primary mb-2">
                    Book a Discovery Call
                  </h2>
                  <p className="text-body text-text-secondary mb-6">
                    Tell us who you are and we&apos;ll take you straight to our calendar to choose a time that works for you.
                  </p>
                  <form onSubmit={handleBookingSubmit} className="space-y-5" noValidate>
                    <div>
                      <label htmlFor="booking-name" className="block text-body-sm font-medium text-text-primary mb-2">
                        Name <span className="text-accent-pink ml-1">*</span>
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        autoComplete="name"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="Your name"
                        required
                        aria-invalid={!!bookingError && !bookingName.trim()}
                        className="w-full px-4 py-3 bg-background text-text-primary border border-border rounded-xl text-body placeholder:text-primary-dark/50 transition-all duration-200 ease-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-email" className="block text-body-sm font-medium text-text-primary mb-2">
                        Email <span className="text-accent-pink ml-1">*</span>
                      </label>
                      <input
                        id="booking-email"
                        type="email"
                        autoComplete="email"
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        aria-invalid={!!bookingError && bookingEmail.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingEmail)}
                        className="w-full px-4 py-3 bg-background text-text-primary border border-border rounded-xl text-body placeholder:text-primary-dark/50 transition-all duration-200 ease-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    {bookingError && (
                      <p className="text-body-sm text-red-500" role="alert">
                        {bookingError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isBooking}
                      className="w-full px-8 py-4 text-body-sm font-medium rounded-xl bg-primary text-white hover:bg-primary-dark active:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed transition-all duration-200 ease-out"
                    >
                      {isBooking ? "Opening calendar..." : "Book a Discovery Call"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ContactPageClient;
