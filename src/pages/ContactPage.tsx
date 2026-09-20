import { useEffect } from "react";
import { Link } from "react-router-dom";
import Contact from "../components/Contact";
import "./ContactPage.css";

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact Designtech Engineering | Bangalore";
  }, []);

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
