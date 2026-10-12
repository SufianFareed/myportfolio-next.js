import Link from "next/link";
import InvoiceGenerator from "@/components/tools/invoice/InvoiceGenerator";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Free Invoice Generator — Create and Download PDF Invoices",
  description:
    "Create professional invoices in your browser: multiple templates, PKR, USD, GBP, EUR, AED and SAR, discounts and tax, live preview, and a clean A4 PDF with selectable text. Nothing is uploaded.",
  alternates: { canonical: "/tools/invoice-generator" },
};

export default function InvoiceGeneratorPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="section-inner">
          <ScrollReveal>
            <Link href="/tools" className="tool-back">← All tools</Link>
            <p className="section-eyebrow">{"// tools / invoice-generator"}</p>
            <h1 className="section-title">Invoice generator.</h1>
            <p className="page-hero__lede">
              Build a clean invoice, preview it live, and download a print-ready A4 PDF.
              Your details are saved only in this browser, nothing is sent to a server.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="tools-list">
        <div className="inv-wrap">
          <InvoiceGenerator />
        </div>
      </section>
    </main>
  );
}
