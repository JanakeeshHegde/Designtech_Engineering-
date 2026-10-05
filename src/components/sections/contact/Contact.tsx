import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */

import { OFFICE_INFO } from "../../../data/company";
import { generateMailtoUrl } from "../../../utils/mailto";

const GOOGLE_MAPS_DIRECTIONS = OFFICE_INFO.googleMapsUrl;
const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.948!2d77.51833!3d12.9101281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f5aa3717c4d%3A0x65e857e76e832a65!2sDesigntech%20Engineering!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`;

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  _gotcha: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    _gotcha: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  /* ───── FORM HANDLERS ───── */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status === "error") {
      setStatus("idle");
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    const name = form.fullName.trim();
    if (!name) errs.fullName = "Please enter your name.";
    if (!EMAIL_RE.test(form.email.trim())) errs.email = "Please enter a valid email address.";
    if (!form.subject.trim()) errs.subject = "Please enter a subject.";
    if (!form.message.trim()) errs.message = "Please enter your message.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setForm({ fullName: "", email: "", phone: "", company: "", subject: "", message: "", _gotcha: "" });
    setErrors({});
    setStatus("idle");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (form._gotcha) {
      resetForm();
      return;
    }

    const mailtoUrl = generateMailtoUrl({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      company: form.company,
      subject: form.subject,
      message: form.message,
    });

    // Direct synchronous navigation ensures mobile browsers (iOS Safari, Android Chrome)
    // immediately trigger the OS default email client without popup blockers.
    window.location.href = mailtoUrl;

    setStatus("success");
  };

  /* ───── GSAP ANIMATIONS ───── */

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-header", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ".contact-header", start: "top 90%", once: true },
      });

      gsap.fromTo(".contact-form-col", { opacity: 0, y: 12 }, {
        opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".contact-layout", start: "top 92%", once: true },
      });

      gsap.fromTo(".contact-map-col", { opacity: 0, y: 12 }, {
        opacity: 1, y: 0, duration: 0.7, delay: 0.05, ease: "power2.out",
        scrollTrigger: { trigger: ".contact-layout", start: "top 92%", once: true },
      });

      gsap.fromTo(".contact-final-line", { scaleX: 1 }, {
        scaleX: 0, duration: 1.5, stagger: 0.08, ease: "power2.inOut",
        transformOrigin: "center",
        scrollTrigger: {
          trigger: ".contact-final",
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  const phoneLink1 = `tel:+91${OFFICE_INFO.phone1}`;
  const mailtoLink = `mailto:${OFFICE_INFO.email}`;

  /* ───── RENDER ───── */

  const renderSuccess = () => (
    <div className="contact-success" role="alert" aria-live="polite">
      <div className="contact-success-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="#A87524" strokeWidth="1.5" />
          <path d="M 14 24 L 21 31 L 34 17" stroke="#A87524" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="t-heading">EMAIL CLIENT OPENED</h3>
      <p className="t-body" style={{ textAlign: "center", maxWidth: "380px" }}>
        Your email app is opening. Please review the enquiry and press Send.
      </p>
      <button
        type="button"
        className="btn btn-outline"
        onClick={resetForm}
        style={{ marginTop: "1.5rem" }}
      >
        SEND ANOTHER ENQUIRY
      </button>
    </div>
  );

  const renderError = () => (
    <div className="contact-error" role="alert" aria-live="assertive">
      <div className="contact-error-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="#B91C1C" strokeWidth="1.5" />
          <path d="M16 16 L32 32 M32 16 L16 32" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="t-heading">UNABLE TO SEND</h3>
      <p className="t-body" style={{ textAlign: "center", maxWidth: "380px" }}>
        Something went wrong while sending your enquiry. Please try again or contact us directly.
      </p>
      <div style={{ display: "flex", gap: "0.85rem", marginTop: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setStatus("idle")}
        >
          TRY AGAIN
        </button>
        <a href={mailtoLink} className="btn btn-outline">
          EMAIL US DIRECTLY
        </a>
      </div>
    </div>
  );

  return (
    <section id="contact" ref={sectionRef} className="contact section" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact-header section-header">
          <div className="section-number">CONTACT</div>
          <h2 id="contact-heading" className="t-display-lg">LET&apos;S BUILD<br />WHAT LASTS.</h2>
          <div className="section-divider" />
        </div>

        <div className="contact-layout">
          {/* LEFT COLUMN — CONTACT FORM */}
          <div className="contact-form-col">
            {status === "success" ? renderSuccess() : status === "error" ? renderError() : (
              <form
                className="contact-form"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form"
              >
                {/* Honeypot — hidden from humans */}
                <input
                  type="text"
                  name="_gotcha"
                  value={form._gotcha}
                  onChange={handleChange}
                  className="form-honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">FULL NAME *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className={`form-input ${errors.fullName ? "form-input--error" : ""}`}
                    placeholder="Your full name"
                    autoComplete="name"
                    aria-required="true"
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  />
                  {errors.fullName && <span id="fullName-error" className="form-error" role="alert">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? "form-input--error" : ""}`}
                    placeholder="your@email.com"
                    autoComplete="email"
                    aria-required="true"
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <span id="email-error" className="form-error" role="alert">{errors.email}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">PHONE NUMBER</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+91 XXXXX XXXXX"
                      autoComplete="tel"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company" className="form-label">COMPANY / ORGANIZATION</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Your company"
                      autoComplete="organization"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">SUBJECT *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={`form-input ${errors.subject ? "form-input--error" : ""}`}
                    placeholder="Project enquiry, structural consultation, etc."
                    aria-required="true"
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                  />
                  {errors.subject && <span id="subject-error" className="form-error" role="alert">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">MESSAGE *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className={`form-input form-textarea ${errors.message ? "form-input--error" : ""}`}
                    placeholder="Describe your project or enquiry..."
                    rows={5}
                    aria-required="true"
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && <span id="message-error" className="form-error" role="alert">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary form-submit"
                  disabled={status === "loading"}
                  aria-busy={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <span className="form-spinner" aria-hidden="true" />
                      <span>SENDING ENQUIRY...</span>
                    </>
                  ) : (
                    <>
                      <span>SEND ENQUIRY</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN — MAP + CONTACT INFO */}
          <div className="contact-map-col">
            <div className="contact-map-wrap">
              <div className="contact-map-header">
                <div className="contact-map-badge">
                  <span className="contact-map-live-dot" aria-hidden="true" />
                  <span className="contact-map-live-text">GOOGLE MAPS</span>
                </div>
                <a
                  href={GOOGLE_MAPS_DIRECTIONS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-open-link"
                  aria-label="Open location in Google Maps (opens in new tab)"
                >
                  <span>Open in Maps</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>

              <div className="contact-map-frame-container">
                {!mapLoaded && (
                  <div className="contact-map-skeleton" aria-hidden="true">
                    <div className="contact-map-spinner" />
                    <span>Loading satellite & street map...</span>
                  </div>
                )}
                <iframe
                  title="Designtech Engineering Google Map"
                  src={GOOGLE_MAPS_EMBED_URL}
                  className={`contact-map-iframe ${mapLoaded ? "is-loaded" : ""}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setMapLoaded(true)}
                  allowFullScreen
                />
              </div>

              <div className="contact-map-actions">
                <a
                  href={GOOGLE_MAPS_DIRECTIONS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-btn contact-map-btn--primary"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                  </svg>
                  <span>GET DIRECTIONS ON GOOGLE MAPS</span>
                </a>
              </div>
            </div>

            <div className="contact-info-block" style={{ marginTop: "1.5rem" }}>
              <address className="contact-addr" style={{ fontStyle: "normal" }}>
                <div className="contact-addr-line">
                  <span className="t-label">ADDRESS</span>
                  <a
                    className="contact-addr-detail contact-link contact-addr-link"
                    href={GOOGLE_MAPS_DIRECTIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {OFFICE_INFO.addressLine1}<br />
                    {OFFICE_INFO.addressLine2}<br />
                    {OFFICE_INFO.addressLine3}<br />
                    {OFFICE_INFO.addressLine4}<br />
                    {OFFICE_INFO.addressLine5}
                  </a>
                </div>

                <div className="contact-addr-line">
                  <span className="t-label">TELEPHONE</span>
                  <div className="contact-addr-detail">
                    <a href={phoneLink1} className="contact-link">+91 {OFFICE_INFO.phone1}</a>
                  </div>
                </div>

                <div className="contact-addr-line">
                  <span className="t-label">EMAIL</span>
                  <div className="contact-addr-detail">
                    <a href={mailtoLink} className="contact-link">{OFFICE_INFO.email}</a>
                  </div>
                </div>
              </address>
            </div>
          </div>
        </div>

        {/* Final cinematic closer */}
        <div className="contact-final" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="contact-final-line" style={{ opacity: 0.05 + i * 0.03 }} />
          ))}
        </div>
      </div>
    </section>
  );
}
