export const metadata = {
  title: "Terms & Conditions | Era of Digital Marketing",
  description:
    "Official Terms and Conditions of Era of Digital Marketing (EDM). Review our policies, client responsibilities, and legal agreements.",
};

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-200 p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#00B7FF] mb-6 text-center">
          Terms & Conditions
        </h1>

        <p className="text-center text-gray-400 mb-10 text-sm md:text-base">
          <strong>Effective Date:</strong> November 2025 <br />
          <strong>Website:</strong> www.eraofdigitalmarketing.com <br />
          <strong>Company:</strong> Era of Digital Marketing (EDM) <br />
          <strong>Contact:</strong>{" "}
          <a
            href="mailto:connectatedm@gmail.com"
            className="text-[#00B7FF] hover:underline"
          >
            connectatedm@gmail.com
          </a>
        </p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          {[
            {
              title: "1. Acceptance of Terms",
              content: `By visiting our website or using our services, you confirm that you are at least 18 years old and agree to comply with these Terms. If you do not agree, you must not access our website or use our services.`,
            },
            {
              title: "2. Scope of Services",
              content: `Era of Digital Marketing provides professional digital marketing solutions, including SEO, social media marketing, performance marketing, web development, CRM automation, graphic designing, and content creation. Service details, deliverables, and timelines will be defined in individual client agreements.`,
            },
            {
              title: "3. Intellectual Property Rights",
              content: `All content, designs, graphics, logos, code, and materials on this website are owned by Era of Digital Marketing and are protected by international copyright, trademark, and intellectual property laws. You may not copy, reproduce, or distribute any materials from this site without our prior written consent.`,
            },
            {
              title: "4. Client Responsibilities",
              content: `Clients are responsible for providing accurate information, brand assets, and timely feedback required for service delivery. Delays in providing these may extend project timelines.`,
            },
            {
              title: "5. Payments and Refund Policy",
              content: `Payments for all services must be made as per the agreed proposal or invoice. Refunds are only applicable if specified in a signed service agreement. Digital services, once delivered or initiated, are non-refundable.`,
            },
            {
              title: "6. Third-Party Tools and Services",
              content: `Our agency may integrate or use third-party tools (such as Google Ads, Meta Ads, or CRM systems). While we ensure proper setup and compliance, we are not liable for any changes or issues arising from third-party platforms.`,
            },
            {
              title: "7. Limitation of Liability",
              content: `EDM will not be liable for any indirect, incidental, or consequential damages arising from the use of our website, campaigns, or services. Results in digital marketing vary and cannot be guaranteed due to algorithmic and market dynamics.`,
            },
            {
              title: "8. Confidentiality",
              content: `Both parties agree to maintain confidentiality of shared business information, client data, and marketing strategies. We will not disclose or sell your data to any third party without consent.`,
            },
            {
              title: "9. Termination",
              content: `We reserve the right to suspend or terminate services if a client violates these Terms, engages in fraudulent behavior, or fails to make timely payments.`,
            },
            {
              title: "10. Governing Law",
              content: `These Terms shall be governed by international business and digital commerce laws, with jurisdiction based on the location of Era of Digital Marketing’s registered operations (India).`,
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
