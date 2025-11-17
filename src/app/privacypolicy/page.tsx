export const metadata = {
  title: "Privacy Policy | Era of Digital Marketing",
  description:
    "Learn how Era of Digital Marketing (EDM) collects, uses, and protects your data in compliance with global privacy standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-200 p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#00B7FF] mb-6 text-center">
          Privacy Policy
        </h1>

        <p className="text-center text-gray-400 mb-10 text-sm md:text-base">
          <strong>Effective Date:</strong> November 2025 <br />
          <strong>Company:</strong> Era of Digital Marketing (EDM) <br />
          <strong>Email:</strong>{" "}
          <a
            href="mailto:connectatedm@gmail.com"
            className="text-[#00B7FF] hover:underline"
          >
            connectatedm@gmail.com
          </a>{" "}
          <br />
          <strong>Website:</strong> www.eraofdigitalmarketing.com
        </p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          {[
            {
              title: "1. Information We Collect",
              content: `We may collect personal information such as your name, email, phone number, and project details shared through contact forms, as well as technical data like IP address, browser type, and usage analytics.`,
            },
            {
              title: "2. How We Use Your Information",
              content: `Your data is used to improve our services, respond to inquiries, send updates, and comply with legal obligations. We only send marketing materials with your explicit consent.`,
            },
            {
              title: "3. Legal Basis for Processing",
              content: `We process data based on consent, contractual necessity, or legitimate business interests.`,
            },
            {
              title: "4. Data Retention",
              content: `We retain personal data only as long as necessary to fulfill its purpose or comply with legal obligations.`,
            },
            {
              title: "5. Sharing of Data",
              content: `We do not sell or rent your data. We may share it with trusted partners who assist in service delivery — all bound by confidentiality agreements.`,
            },
            {
              title: "6. International Data Transfers",
              content: `Data may be processed in other countries where our partners operate, following GDPR-compliant safeguards.`,
            },
            {
              title: "7. Cookies and Tracking Technologies",
              content: `We use cookies to enhance functionality and analytics. You can disable cookies in browser settings, though some features may not function properly.`,
            },
            {
              title: "8. Data Security",
              content: `We use modern encryption, firewalls, and secure systems to protect your data from unauthorized access or loss.`,
            },
            {
              title: "9. Your Rights",
              content: `Depending on your location, you have the right to access, correct, delete, or request copies of your data, and withdraw consent anytime.`,
            },
            {
              title: "10. Links to Third-Party Websites",
              content: `Our site may link to third-party platforms. We are not responsible for their privacy practices and encourage reviewing their policies before sharing information.`,
            },
            {
              title: "11. Policy Updates",
              content: `We may update this policy periodically. Changes will be reflected on this page with a new effective date.`,
            },
            {
              title: "12. Contact Us",
              content: `For any privacy-related questions or requests, contact us at connectatedm@gmail.com.`,
            },
          ].map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-[#00B7FF] font-semibold text-lg mb-2">
                {title}
              </h2>
              <p className="text-gray-300">{content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
