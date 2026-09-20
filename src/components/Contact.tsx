import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

const PROJECT_TYPES = [
  "Residential Building",
  "Commercial Building",
  "Hotel / Hospitality",
  "Industrial Structure",
  "Institutional Building",
  "Water / Sewage Treatment",
  "Solar Energy Structure",
  "Other",
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", projectType: PROJECT_TYPES[0], message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-header", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ".contact-header", start: "top 90%", once: true },
      });

      gsap.fromTo(".contact-form-col", { opacity: 0, y: 25 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: ".contact-layout", start: "top 92%", once: true },
      });

      gsap.fromTo(".contact-info-col", { opacity: 0, y: 25 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: ".contact-layout", start: "top 92%", once: true },
      });

      // Final lines collapse animation
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
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email required";
    if (form.message.trim().length < 10) errs.message = "Message must be at least 10 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // NOTE: No backend configured. Form is ready for future integration.
      // To enable: connect to an email service such as EmailJS, Formspree, or a custom backend.
      console.log("Form data ready for submission:", form);
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="contact section" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact-header section-header">
          <div className="section-number">07 / CONTACT</div>
          <h2 id="contact-heading" className="t-display-lg">LET&apos;S BUILD<br />WHAT LASTS.</h2>
          <div className="section-divider" />
        </div>

        <div className="contact-layout">
          {/* Info column */}
          <div className="contact-info-col">
            <div className="contact-info-block">
              <div className="contact-section-label" style={{ marginBottom: "1rem" }}>STUDIO / BENGALURU</div>

              <address className="contact-addr" style={{ fontStyle: "normal" }}>
                <div className="contact-addr-line">
                  <span className="t-label">ADDRESS</span>
                  <div className="contact-addr-detail">
                    880, Nehru Road,<br />
                    BEML Layout 4th Stage,<br />
                    RR Nagar,<br />
                    Bangalore – 560098
                  </div>
                </div>

                <div className="contact-addr-line">
                  <span className="t-label">TELEPHONE</span>
                  <div className="contact-addr-detail">
                    <a href="tel:+919035761979" className="contact-link">+91 9035761979</a><br />
                    <a href="tel:+919880593211" className="contact-link">+91 9880593211</a>
                  </div>
                </div>

                <div className="contact-addr-line">
                  <span className="t-label">EMAIL</span>
                  <div className="contact-addr-detail">
                    <a href="mailto:designtecheng.team@gmail.com" className="contact-link">
                      designtecheng.team@gmail.com
                    </a>
                  </div>
                </div>
              </address>
            </div>

            {/* Geo locations */}
            <div className="contact-geo">
              <div className="contact-section-label" style={{ marginBottom: "1rem" }}>PROJECT LOCATIONS</div>
              <div className="contact-geo-list">
                {["Bengaluru", "Manipal / Udupi", "Mangalore", "Hyderabad", "Peenya", "Alur"].map((loc) => (
                  <div key={loc} className="contact-geo-item">
                    <div className="contact-geo-dot" aria-hidden="true" />
                    <span className="contact-geo-name">{loc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="contact-form-col">
            {submitted ? (
              <div className="contact-success" role="alert" aria-live="assertive">
                <div className="contact-success-icon" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" stroke="#A87524" strokeWidth="1.5" />
                    <path d="M 14 24 L 21 31 L 34 17" stroke="#A87524" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="t-heading">ENQUIRY RECEIVED</h3>
                <p className="t-body" style={{ textAlign: "center", maxWidth: "340px" }}>
                  Thank you for reaching out. Our engineering team has received your details and will get in touch promptly.
                </p>
                <button
                  className="btn btn-outline"
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: "1.5rem" }}
                >
                  SEND ANOTHER ENQUIRY
                </button>
              </div>
            ) : (
              <form
                className="contact-form"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form"
              >

                <div className="form-group">
                  <label htmlFor="name" className="form-label">NAME *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? "form-input--error" : ""}`}
                    placeholder="Your full name"
                    aria-required="true"
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <span id="name-error" className="form-error" role="alert">{errors.name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">EMAIL *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? "form-input--error" : ""}`}
                      placeholder="your@email.com"
                      aria-required="true"
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && <span id="email-error" className="form-error" role="alert">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">PHONE</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="projectType" className="form-label">PROJECT TYPE</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={form.projectType}
                    onChange={handleChange}
                    className="form-input form-select"
                  >
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
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

                <button type="submit" className="btn btn-primary form-submit">
                  <span>SEND ENQUIRY</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Final cinematic closer */}
        <div className="contact-final" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="contact-final-line" style={{ opacity: 0.05 + i * 0.03 }} />
          ))}
          <div className="contact-final-text">
            <div className="t-display-lg" style={{ opacity: 0.06, userSelect: "none" }}>
              DESIGNTECH ENGINEERING
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
