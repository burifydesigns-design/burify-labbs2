"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

type BookingField = "name" | "email";
type BookingFieldErrors = Partial<Record<BookingField, string>>;

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
  const [bookingCompany, setBookingCompany] = useState("");
  const [bookingService, setBookingService] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingFieldErrors, setBookingFieldErrors] = useState<BookingFieldErrors>({});
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingUrl, setBookingUrl] = useState(CALENDLY_URL);
  const [isBooking, setIsBooking] = useState(false);
  const submissionInProgress = useRef(false);

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

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submissionInProgress.current) return;

    setBookingError("");
    setBookingSuccess("");

    const name = bookingName.trim();
    const email = bookingEmail.trim().toLowerCase();
    const fieldErrors: BookingFieldErrors = {};

    if (!name) {
      fieldErrors.name = "Please enter your name.";
    } else if (name.length > 100) {
      fieldErrors.name = "Name must be 100 characters or fewer.";
    }

    if (!email) {
      fieldErrors.email = "Please enter your email.";
    } else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldErrors.email = "Please enter a valid email address.";
    }

    setBookingFieldErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    const formData = new FormData(e.currentTarget);
    const consent = formData.get("consent") === "on";
    if (!consent) {
      setBookingError("Please confirm that Burify may use your details to respond to your enquiry.");
      return;
    }

    submissionInProgress.current = true;
    setIsBooking(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: bookingCompany.trim(),
          service_interest: bookingService,
          message: bookingMessage.trim() || "Discovery call request submitted through the Burify website.",
          consent,
          websiteUrl: formData.get("websiteUrl") ?? "",
          landing_page: window.location.pathname,
          referrer: document.referrer,
          utm_source: new URLSearchParams(window.location.search).get("utm_source") ?? "",
          utm_medium: new URLSearchParams(window.location.search).get("utm_medium") ?? "",
          utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign") ?? "",
          utm_term: new URLSearchParams(window.location.search).get("utm_term") ?? "",
          utm_content: new URLSearchParams(window.location.search).get("utm_content") ?? "",
        }),
      });

      const result: unknown = await response.json().catch(() => null);
      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        (result as { success?: unknown }).success !== true
      ) {
        throw new Error("Submission failed");
      }

      // Keep personal details out of the Calendly URL, browser history and referrer logs.
      setBookingUrl(CALENDLY_URL);
      setBookingName("");
      setBookingEmail("");
      setBookingCompany("");
      setBookingService("");
      setBookingMessage("");
      setBookingFieldErrors({});
      setBookingSuccess(
        "Thanks! Your enquiry has been saved to our inbox and sales pipeline. Choose a time for your discovery call when you are ready."
      );
    } catch {
      setBookingError("Something went wrong while sending your message. Please try again.");
    } finally {
      setIsBooking(false);
      submissionInProgress.current = false;
    }
  };

  return (
    <>
      <Navbar variant={scrolled ? "light" : "transparent"} showCta />
      <main id="main-content">
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
                    Share a few details so we can prepare for your discovery call. You can then choose a time on Calendly.
                  </p>
                  <form onSubmit={handleBookingSubmit} className="space-y-5" noValidate>
                    <div className="sr-only" aria-hidden="true">
                      <label htmlFor="website-url">Leave this field empty</label>
                      <input
                        id="website-url"
                        name="websiteUrl"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-name" className="block text-body-sm font-medium text-text-primary mb-2">
                        Name <span className="text-accent-pink ml-1">*</span>
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        autoComplete="name"
                        value={bookingName}
                        onChange={(e) => {
                          setBookingName(e.target.value);
                          if (bookingFieldErrors.name) {
                            setBookingFieldErrors((errors) => ({ ...errors, name: undefined }));
                          }
                        }}
                        placeholder="Your name"
                        required
                        maxLength={100}
                        aria-invalid={!!bookingFieldErrors.name}
                        aria-describedby={bookingFieldErrors.name ? "booking-name-error" : undefined}
                        className="w-full px-4 py-3 bg-background text-text-primary border border-border rounded-xl text-body placeholder:text-primary-dark/50 transition-all duration-200 ease-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      {bookingFieldErrors.name && (
                        <p id="booking-name-error" className="mt-2 text-body-sm text-red-500" role="alert">
                          {bookingFieldErrors.name}
                        </p>
                      )}
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
                        onChange={(e) => {
                          setBookingEmail(e.target.value);
                          if (bookingFieldErrors.email) {
                            setBookingFieldErrors((errors) => ({ ...errors, email: undefined }));
                          }
                        }}
                        placeholder="you@company.com"
                        required
                        maxLength={254}
                        aria-invalid={!!bookingFieldErrors.email}
                        aria-describedby={bookingFieldErrors.email ? "booking-email-error" : undefined}
                        className="w-full px-4 py-3 bg-background text-text-primary border border-border rounded-xl text-body placeholder:text-primary-dark/50 transition-all duration-200 ease-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      {bookingFieldErrors.email && (
                        <p id="booking-email-error" className="mt-2 text-body-sm text-red-500" role="alert">
                          {bookingFieldErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="booking-company" className="block text-body-sm font-medium text-text-primary mb-2">
                        Company <span className="text-text-secondary">(optional)</span>
                      </label>
                      <input
                        id="booking-company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        value={bookingCompany}
                        onChange={(e) => setBookingCompany(e.target.value)}
                        placeholder="Your company"
                        maxLength={180}
                        className="w-full px-4 py-3 bg-background text-text-primary border border-border rounded-xl text-body placeholder:text-primary-dark/50 transition-all duration-200 ease-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-service" className="block text-body-sm font-medium text-text-primary mb-2">
                        What do you need help with? <span className="text-text-secondary">(optional)</span>
                      </label>
                      <select
                        id="booking-service"
                        name="service_interest"
                        value={bookingService}
                        onChange={(e) => setBookingService(e.target.value)}
                        className="w-full px-4 py-3 bg-background text-text-primary border border-border rounded-xl text-body transition-all duration-200 ease-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Select a service</option>
                        <option value="Website design and development">Website design and development</option>
                        <option value="AI automation">AI automation</option>
                        <option value="Web applications">Web applications</option>
                        <option value="Other / not sure yet">Other / not sure yet</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="booking-message" className="block text-body-sm font-medium text-text-primary mb-2">
                        Project details <span className="text-text-secondary">(optional)</span>
                      </label>
                      <textarea
                        id="booking-message"
                        name="message"
                        rows={4}
                        value={bookingMessage}
                        onChange={(e) => setBookingMessage(e.target.value)}
                        placeholder="Briefly describe what you are looking to build or improve."
                        maxLength={5000}
                        className="w-full px-4 py-3 bg-background text-text-primary border border-border rounded-xl text-body placeholder:text-primary-dark/50 transition-all duration-200 ease-out focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="booking-consent" className="flex items-start gap-3 text-body-sm text-text-secondary">
                        <input
                          id="booking-consent"
                          name="consent"
                          type="checkbox"
                          required
                          className="mt-1 h-4 w-4 shrink-0 accent-primary"
                        />
                        <span>
                          I agree that Burify may use my name and email to respond to this enquiry and arrange my discovery call.
                          <span className="text-accent-pink ml-1">*</span>
                        </span>
                      </label>
                    </div>
                    {bookingError && (
                      <p className="text-body-sm text-red-500" role="alert">
                        {bookingError}
                      </p>
                    )}
                    {bookingSuccess && (
                      <div className="text-body-sm text-green-700" role="status" aria-live="polite">
                        <p>{bookingSuccess}</p>
                        <a
                          href={bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 font-medium text-primary hover:text-primary-dark transition-colors duration-200"
                        >
                          Choose a time on Calendly
                        </a>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isBooking}
                      aria-disabled={isBooking}
                      className="w-full px-8 py-4 text-body-sm font-medium rounded-xl bg-primary text-white hover:bg-primary-dark active:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed transition-all duration-200 ease-out"
                    >
                      {isBooking ? "Sending..." : "Book a Discovery Call"}
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
