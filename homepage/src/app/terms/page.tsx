export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-neutral-300 mb-8">Last updated: January 15, 2025</p>

        <div className="space-y-6 text-neutral-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
            <p>By accessing and using WebZone, you agree to be bound by these Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Use License</h2>
            <p>Permission is granted to use WebZone for personal, non-commercial purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Privacy</h2>
            <p>Your use of WebZone is also governed by our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Contact</h2>
            <p>Questions about these Terms should be sent to legal@webzone.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}