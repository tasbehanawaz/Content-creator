export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-neutral-300 mb-8">Last updated: January 15, 2025</p>

        <div className="space-y-6 text-neutral-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when using WebZone.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
            <p>We use the information to provide, maintain, and improve our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, contact us at privacy@webzone.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}