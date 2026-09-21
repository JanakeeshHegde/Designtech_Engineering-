import { OFFICE_INFO } from "../data/company";

export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

/**
 * Builds the structured mailto URL for contact form enquiries.
 * Opens the visitor's native email client prefilled with enquiry details.
 */
export function generateMailtoUrl(data: ContactFormData): string {
  const fullName = data.fullName.trim();
  const email = data.email.trim();
  const phone = (data.phone || "").trim();
  const company = (data.company || "").trim();
  const subject = data.subject.trim();
  const message = data.message.trim();

  const subjectLine = `New Website Enquiry — ${subject}`;

  const body = `DESIGNTECH ENGINEERING
CONTACT ENQUIRY

--------------------------------

Name
${fullName}

Email
${email}

Phone
${phone}

Company
${company}

Subject
${subject}

Message
${message}

--------------------------------`;

  return `mailto:${OFFICE_INFO.email}?subject=${encodeURIComponent(
    subjectLine
  )}&body=${encodeURIComponent(body)}`;
}
