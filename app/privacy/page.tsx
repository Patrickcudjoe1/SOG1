import Navbar from "../components/navbar"
import Footer from "../components/footer"

export default function PrivacyPolicy() {
  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar forceDark={true} />
      
      <section className="w-full py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-8"
            style={{ fontFamily: 'var(--font-brand)', fontWeight: 400 }}
          >
            Privacy Policy
          </h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">1. Introduction</h2>
              <p>
                At SON OF GOD, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">2. Information We Collect</h2>
              <p className="mb-3">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address</li>
                <li><strong>Account Information:</strong> Username, password, and account preferences</li>
                <li><strong>Payment Information:</strong> Credit card details and billing address (processed securely through third-party payment processors)</li>
                <li><strong>Order Information:</strong> Purchase history, order details, and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">3. How We Use Your Information</h2>
              <p className="mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>Provide customer support</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our products and services</li>
                <li>Detect and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">4. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties except:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>To service providers who assist us in operating our website and conducting our business</li>
                <li>To comply with legal requirements or protect our rights</li>
                <li>In connection with a business transaction such as a merger or acquisition</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">6. Authentication and Firebase</h2>
              <p>
                We use Firebase Authentication to manage user accounts securely. Firebase processes your authentication data in accordance with Google's privacy policies. Your password is encrypted and never stored in plain text.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience, analyze website traffic, and personalize content. You can control cookie settings through your browser.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">8. Your Rights</h2>
              <p className="mb-3">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your information</li>
                <li>Withdraw consent for marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">9. Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">10. Changes to Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or how we handle your personal information, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@sonofgod.com<br />
                <strong>Phone:</strong> +233 XX XXX XXXX<br />
                <strong>Address:</strong> Accra, Ghana
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