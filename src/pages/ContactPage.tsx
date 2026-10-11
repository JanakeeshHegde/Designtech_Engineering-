import { Link } from "react-router-dom";
import { useSEO } from "../hooks";
import Contact from "../components/sections/contact/Contact";
import "./ContactPage.css";

export default function ContactPage() {
  useSEO({
    title: "Contact DesignTech Engineering | Consult Structural Engineers Bengaluru",
    description: "Connect with DesignTech Engineering for structural consultations, building stability evaluations, civil engineering design, and project inquiries in Bengaluru, Karnataka.",
    path: "/contact",
    breadcrumbs: [{ name: "Contact", path: "/contact" }],
  });

  return (
    <main id="main-content">
      {/* Page intro strip */}
      <div className="contact-page-intro">
        <div className="container contact-page-intro-inner">
          <div className="section-number">GET IN TOUCH</div>
          <div className="contact-page-breadcrumb">
            <Link to="/" className="contact-page-breadcrumb-link">HOME</Link>
            <span className="contact-page-breadcrumb-sep" aria-hidden="true">/</span>
            <span>CONTACT</span>
          </div>
        </div>
      </div>

      {/* Existing Contact component — completely unchanged */}
      <Contact />
    </main>
  );
}
