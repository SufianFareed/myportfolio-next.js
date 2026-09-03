"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";
import ScrollReveal from "./ScrollReveal";

const PROJECT_TYPES = [
  "WordPress Project",
  "Shopify Project",
  "Next.js / Custom Web App",
  "Website Optimization",
  "Other",
];

const initialForm = { name: "", email: "", subject: PROJECT_TYPES[0], message: "" };
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = "Please enter a valid email.";
    }
    if (!form.message.trim()) nextErrors.message = "Please enter a message.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions while a request is already in flight.
    if (status === "submitting") return;

    if (!validate()) {
      setStatus("error");
      setStatusMessage("Please fix the highlighted fields.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setStatusMessage("Thanks — your message is on its way. I'll get back to you soon.");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setStatusMessage(
        err.message || "Something went wrong sending your message. Please try again."
      );
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="section-inner contact__grid">
        <ScrollReveal>
          <p className="section-eyebrow">// 06 — contact.tsx</p>
          <h2 className="section-title">Let&apos;s build something.</h2>
          <p className="contact__lede">
            Have a WordPress, Shopify, or Next.js project in mind? Send a
            message and I&apos;ll get back to you.
          </p>

          <div className="contact__socials">
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.5 0 12.3c0 5.44 3.44 10.05 8.21 11.68.6.11.82-.27.82-.6v-2.1c-3.34.75-4.04-1.66-4.04-1.66-.55-1.43-1.33-1.82-1.33-1.82-1.08-.76.09-.74.09-.74 1.2.09 1.83 1.26 1.83 1.26 1.07 1.87 2.8 1.33 3.49 1.02.1-.79.42-1.33.76-1.64-2.67-.31-5.47-1.37-5.47-6.1 0-1.35.46-2.45 1.23-3.31-.12-.31-.53-1.57.12-3.28 0 0 1-.33 3.3 1.26a11.2 11.2 0 0 1 6 0c2.29-1.59 3.3-1.26 3.3-1.26.65 1.71.24 2.97.12 3.28.77.86 1.23 1.96 1.23 3.31 0 4.74-2.81 5.78-5.49 6.09.43.38.81 1.14.81 2.3v3.4c0 .33.22.72.83.6C20.57 22.34 24 17.73 24 12.3 24 5.5 18.63 0 12 0z" />
              </svg>
            </a>
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z" />
              </svg>
            </a>
            <a
              href={siteConfig.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
              </svg>
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="terminal__bar terminal__bar--mini">
              <span className="terminal__dot terminal__dot--red"></span>
              <span className="terminal__dot terminal__dot--yellow"></span>
              <span className="terminal__dot terminal__dot--green"></span>
              <span className="terminal__title">new_message.tsx</span>
            </div>
            <div className="contact-form__body">
              <label className={`field ${errors.name ? "has-error" : ""}`}>
                <span className="field__label">Name</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
                <span className="field__error">{errors.name}</span>
              </label>

              <label className={`field ${errors.email ? "has-error" : ""}`}>
                <span className="field__label">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
                <span className="field__error">{errors.email}</span>
              </label>

              <label className="field">
                <span className="field__label">Project Type</span>
                <select name="subject" value={form.subject} onChange={handleChange}>
                  {PROJECT_TYPES.map((type) => (
                    <option value={type} key={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className={`field ${errors.message ? "has-error" : ""}`}>
                <span className="field__label">Message</span>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  required
                ></textarea>
                <span className="field__error">{errors.message}</span>
              </label>

              <button
                type="submit"
                className="btn btn--primary btn--block"
                disabled={status === "submitting"}
              >
                {status === "submitting" && <span className="spinner"></span>}
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>

              {statusMessage && (
                <p
                  className={`contact-form__status ${
                    status === "success" ? "is-success" : ""
                  } ${status === "error" ? "is-error" : ""}`}
                  role="status"
                >
                  {statusMessage}
                </p>
              )}
            </div>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
