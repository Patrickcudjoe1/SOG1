import Navbar from "../components/navbar"
import Footer from "../components/footer"

export default function TermsOfService() {
  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar  />
      
      <section className="w-full py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-8"
            style={{ fontFamily: 'var(--font-brand)', fontWeight: 400 }}
          >
            Terms & Services
          </h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">1. Agreement to Terms</h2>
              <p>
                By accessing and using the SON OF GOD website and services, you accept and agree to be bound by these Terms & Services. If you do not agree with any part of these terms, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">2. Use of Services</h2>
              <p>
                You agree to use our services only for lawful purposes and in accordance with these Terms. You are prohibited from:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Using our services in any way that violates applicable laws or regulations</li>
                <li>Impersonating or attempting to impersonate SON OF GOD or any other person or entity</li>
                <li>Engaging in any conduct that restricts or inhibits anyone's use of our services</li>
                <li>Using our services to transmit any unauthorized advertising or promotional material</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">3. Account Registration</h2>
              <p>
                To access certain features, you may be required to register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">4. Products and Services</h2>
              <p>
                All products and services offered through SON OF GOD are subject to availability. We reserve the right to discontinue any product or service at any time. Prices are subject to change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">5. Orders and Payment</h2>
              <p>
                By placing an order, you agree to provide current, complete, and accurate purchase information. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing, or suspected fraud.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">6. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, images, and software, is the property of SON OF GOD and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">7. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, SON OF GOD shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page. Your continued use of our services after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">9. Contact Information</h2>
              <p>
                If you have any questions about these Terms & Services, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> contact@sonofgod.com<br />
                <strong>Phone:</strong> +233 XX XXX XXXX
              </p>
            </section>

            <p className="text-sm text-gray-600 mt-12 pt-8 border-t border-gray-200">
              Last updated: December 25, 2025
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
