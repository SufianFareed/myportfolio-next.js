import { Resend } from "resend";
import { NextResponse } from "next/server";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request) {
  try {
    const body = await request.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const subject = (body.subject || "General Inquiry").trim();
    const message = (body.message || "").trim();

    // Server-side validation — never trust the client alone.
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
      console.error("Missing RESEND_API_KEY or CONTACT_EMAIL environment variable.");
      return NextResponse.json(
        { success: false, error: "Email service is not configured yet." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `New portfolio message — ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nProject Type: ${subject}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to send message. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error. Please try again." },
      { status: 500 }
    );
  }
}
