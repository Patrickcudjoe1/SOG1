import Navbar from "../components/navbar"
import Footer from "../components/footer"

export default function LegalNoticesPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar />
      
      <section className="w-full py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-8"
            style={{ fontFamily: 'var(--font-brand)', fontWeight: 400 }}
          >
            Legal Notices
          </h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">1. Company Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <p className="mb-2"><strong>Business Name:</strong> SON OF GOD</p>
                <p className="mb-2"><strong>Jurisdiction:</strong> Republic of Ghana</p>
                <p className="mb-2"><strong>Registered Address:</strong> Accra, Ghana</p>
                <p className="mb-2"><strong>Contact Email:</strong> contact@sonofgod.com</p>
                <p className="mb-2"><strong>Contact Phone:</strong> +233 XX XXX XXXX</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">2. Governing Law</h2>
              <p>
                This website and all transactions conducted through it are governed by the laws of the Republic of Ghana. Any disputes arising from or related to the use of this website or our services shall be subject to the exclusive jurisdiction of the courts of Ghana.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">3. Compliance with Ghanaian Law</h2>
              <p className="mb-3">
                SON OF GOD operates in compliance with all applicable Ghanaian laws and regulations, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Companies Act, 2019 (Act 992)</li>
                <li>The Consumer Protection Act, 2020 (Act 1026)</li>
                <li>The Data Protection Act, 2012 (Act 843)</li>
                <li>The Value Added Tax Act, 2013 (Act 870)</li>
                <li>The Electronic Transactions Act, 2008 (Act 772)</li>
                <li>Ghana Revenue Authority tax regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">4. Intellectual Property Rights</h2>
              <p className="mb-3">
                All content on this website, including but not limited to text, graphics, logos, images, designs, and software, is the property of SON OF GOD or its licensors and is protected by Ghanaian copyright, trademark, and other intellectual property laws, as well as international treaties.
              </p>
              <p>
                Unauthorized reproduction, distribution, or use of any content from this website is strictly prohibited and may result in legal action under the Copyright Act, 2005 (Act 690) and other applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">5. Trademarks</h2>
              <p>
                "SON OF GOD" and all related logos, designs, and marks are trademarks of SON OF GOD. All other trademarks, service marks, and trade names appearing on this website are the property of their respective owners. Use of any trademarks without express written permission is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">6. Disclaimer of Warranties</h2>
              <p className="mb-3">
                While we strive to provide accurate information, this website and its content are provided "as is" without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Warranties of merchantability</li>
                <li>Warranties of fitness for a particular purpose</li>
                <li>Warranties of non-infringement</li>
                <li>Warranties regarding the accuracy, reliability, or availability of the website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by Ghanaian law, SON OF GOD shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses, arising from your use of or inability to use this website or our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">8. Data Protection</h2>
              <p className="mb-3">
                We are committed to protecting your personal data in accordance with the Data Protection Act, 2012 (Act 843) of Ghana. Our data collection and processing practices are detailed in our Privacy Policy, which forms part of these legal notices.
              </p>
              <p>
                You have the right to access, correct, and request deletion of your personal data in accordance with applicable data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">9. Tax Compliance</h2>
              <p className="mb-3">
                All prices displayed on this website are inclusive of applicable taxes as required by Ghanaian law, including Value Added Tax (VAT) where applicable. SON OF GOD is registered with the Ghana Revenue Authority and complies with all tax obligations.
              </p>
              <p>
                Customers are responsible for any customs duties or taxes that may be applicable to international orders, if and when such services become available.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">10. E-Commerce Regulations</h2>
              <p className="mb-3">
                Our e-commerce operations comply with the Electronic Transactions Act, 2008 (Act 772) of Ghana, which provides the legal framework for electronic commerce and transactions in Ghana.
              </p>
              <p>
                All electronic contracts entered into through this website are legally binding in accordance with Ghanaian law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">11. Consumer Rights</h2>
              <p className="mb-3">
                Your rights as a consumer are protected under the Consumer Protection Act, 2020 (Act 1026). These rights include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Right to information about goods and services</li>
                <li>Right to safe and quality products</li>
                <li>Right to fair and honest treatment</li>
                <li>Right to redress for unsatisfactory goods or services</li>
                <li>Right to fair, just, and reasonable terms and conditions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">12. Dispute Resolution</h2>
              <p className="mb-3">
                In the event of any dispute, we encourage you to contact us first to seek an amicable resolution. If a dispute cannot be resolved directly:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Disputes will be resolved through the courts of Ghana</li>
                <li>Alternative dispute resolution mechanisms may be pursued where appropriate</li>
                <li>You may contact the Ghana Standards Authority or relevant consumer protection bodies for assistance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">13. Changes to Legal Notices</h2>
              <p>
                We reserve the right to modify these legal notices at any time. Changes will be effective immediately upon posting on this page. Your continued use of our website and services after such changes constitutes acceptance of the modified notices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">14. Contact Information</h2>
              <p className="mb-3">
                For any legal inquiries or concerns, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="mb-2"><strong>Email:</strong> legal@sonofgod.com</p>
                <p className="mb-2"><strong>General Contact:</strong> contact@sonofgod.com</p>
                <p className="mb-2"><strong>Phone:</strong> +233 XX XXX XXXX</p>
                <p className="mb-2"><strong>Address:</strong> Accra, Ghana</p>
              </div>
            </section>

            <p className="text-sm text-gray-600 mt-12 pt-8 border-t border-gray-200">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
