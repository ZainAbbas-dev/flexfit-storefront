import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | FlexFit",
  description: "Get in touch with the FlexFit team for support and inquiries.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-heading text-white mb-6 uppercase tracking-wide">
        Contact <span className="text-primary">Us</span>
      </h1>
      <p className="text-gray-400 mb-10 text-lg">
        Have a question about our equipment, your order, or shipping? Our support team is here to help you lift heavier and train harder.
      </p>
      
      <div className="bg-[#1a1a1a] p-8 rounded-lg border border-[#333]">
        <h2 className="text-2xl text-white font-bold mb-4">Email Support</h2>
        <p className="text-gray-400 mb-6">We aim to respond to all inquiries within 24 hours.</p>
        <a 
          href="mailto:support@flexfit.demo" 
          className="inline-block bg-primary hover:bg-[#e04f1a] text-white font-bold py-4 px-8 rounded uppercase tracking-wider transition-colors"
        >
          support@flexfit.demo
        </a>
      </div>
    </div>
  );
}