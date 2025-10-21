export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-6 text-gray-300">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-[#00B7FF] mb-6 tracking-tight">
          About EDM
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          <strong>EDM (Era of Digital Marketing)</strong> is a next-generation digital agency founded by{" "}
          <span className="text-white font-semibold">Abhishek Tyagi</span> and{" "}
          <span className="text-white font-semibold">Ayush Dave</span>.  
          We’re dedicated to driving measurable growth and building brands that last.
        </p>
      </section>

      {/* Mission / Vision Section */}
      <section className="space-y-6">
        <p>
          At EDM, we believe digital marketing goes beyond visibility — it’s about
          crafting experiences that connect, engage, and convert. Our strategies
          combine <span className="text-white font-medium">creative storytelling</span>,
          <span className="text-white font-medium"> data-driven insights</span>, and
          <span className="text-white font-medium"> technical precision</span> to
          deliver campaigns that truly move the needle.
        </p>

        <p>
          From <span className="text-white font-medium">branding and web development</span> 
          to <span className="text-white font-medium">social media marketing, SEO,</span> and 
          <span className="text-white font-medium"> performance campaigns</span>, 
          we tailor every solution around one goal — your sustainable growth.
        </p>

        <p>
          Every project we undertake is guided by our core values:
          <span className="text-[#00B7FF] font-semibold"> transparency</span>,{" "}
          <span className="text-[#00B7FF] font-semibold"> creativity</span>, and{" "}
          <span className="text-[#00B7FF] font-semibold"> long-term value creation</span>.
        </p>

        <p>
          Led by a visionary team that balances strategic foresight and operational
          excellence, EDM empowers brands across industries to innovate and lead in
          today’s ever-evolving digital landscape.
        </p>
      </section>

      {/* Leadership Section */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold text-[#00B7FF] mb-10 text-center">
          Leadership Team
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Abhishek Tyagi */}
          <div className="bg-[#0B0B0B]/60 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-[#00B7FF]/30 transition-shadow">
            <h3 className="text-2xl font-semibold text-white mb-2">
              Abhishek Tyagi
            </h3>
            <span className="text-sm font-semibold text-[#00B7FF] uppercase tracking-wide">
              Founder & Chief Executive Officer
            </span>
            <p className="text-gray-400 mt-3">
              Abhishek drives EDM’s strategic vision and growth. He leads client
              partnerships, brand strategy, and business development. With a
              forward-thinking approach, he ensures every client receives a true
              digital growth partnership.
            </p>
          </div>

          {/* Ayush Dave */}
          <div className="bg-[#0B0B0B]/60 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-[#00B7FF]/30 transition-shadow">
            <h3 className="text-2xl font-semibold text-white mb-2">
              Ayush Dave
            </h3>
            <span className="text-sm font-semibold text-[#00B7FF] uppercase tracking-wide">
              Head of Operations & Technology
            </span>
            <p className="text-gray-400 mt-3">
              Ayush leads EDM’s operations and technological innovation. A certified
              Digital Marketing Professional from IIT Delhi, he ensures flawless
              execution, analytics, and process optimization that keep EDM ahead of
              emerging digital trends.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
