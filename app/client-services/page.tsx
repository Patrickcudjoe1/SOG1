import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ClientServicesPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar />
      
      <section className="w-full py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-8"
            style={{ fontFamily: 'var(--font-brand)', fontWeight: 400 }}
          >
            Client Services
          </h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Customer Support</h2>
              <p className="mb-4">
                At SON OF GOD, we are committed to providing exceptional customer service in accordance with Ghanaian consumer protection standards. Our customer support team is available to assist you with any inquiries, orders, or concerns.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="flex items-start gap-4">
                  <Mail size={24} className="text-black mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-black mb-2">Email Support</h3>
                    <p className="text-sm">contact@sonofgod.com</p>
                    <p className="text-sm text-gray-600 mt-1">Response within 24-48 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone size={24} className="text-black mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-black mb-2">Phone Support</h3>
                    <p className="text-sm">+233 XX XXX XXXX</p>
                    <p className="text-sm text-gray-600 mt-1">Monday - Friday, 9:00 AM - 5:00 PM GMT</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin size={24} className="text-black mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-black mb-2">Location</h3>
                    <p className="text-sm">Accra, Ghana</p>
                    <p className="text-sm text-gray-600 mt-1">Visit us by appointment</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock size={24} className="text-black mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-black mb-2">Business Hours</h3>
                    <p className="text-sm">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-sm">Saturday: 10:00 AM - 2:00 PM</p>
                    <p className="text-sm text-gray-600 mt-1">Closed on Sundays</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Order Services</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Order Tracking:</strong> Track your order status through your account dashboard or contact us for updates</li>
                <li><strong>Order Modifications:</strong> Contact us within 24 hours of placing your order to modify or cancel</li>
                <li><strong>Delivery Information:</strong> We deliver throughout Ghana. Standard delivery times: 3-7 business days in Accra, 7-14 business days for other regions</li>
                <li><strong>Payment Methods:</strong> We accept mobile money (MTN, Vodafone, AirtelTigo), bank transfers, and major credit/debit cards through secure payment gateways</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Returns & Exchanges</h2>
              <p className="mb-3">
                In accordance with Ghanaian consumer protection laws, we offer returns and exchanges within 14 days of purchase, provided items are:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Unworn and in original condition with tags attached</li>
                <li>Accompanied by original receipt or order confirmation</li>
                <li>Not personalized or customized items</li>
              </ul>
              <p className="mt-4">
                To initiate a return or exchange, please contact our customer service team. Return shipping costs may apply depending on the reason for return.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Warranty & Quality Assurance</h2>
              <p className="mb-3">
                All SON OF GOD products are covered by our quality guarantee. If you receive a defective item, please contact us within 30 days for a replacement or refund. We stand behind the quality of our craftsmanship and materials.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Consumer Rights (Ghana)</h2>
              <p className="mb-3">
                As a customer in Ghana, you are protected under the Consumer Protection Act. Your rights include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Right to safe and quality products</li>
                <li>Right to accurate information about products and services</li>
                <li>Right to fair and honest treatment</li>
                <li>Right to redress for unsatisfactory goods or services</li>
                <li>Right to consumer education and awareness</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Account Services</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Management:</strong> Update your profile, shipping addresses, and preferences through your account dashboard</li>
                <li><strong>Order History:</strong> View all your past orders and receipts</li>
                <li><strong>Wishlist:</strong> Save your favorite items for later</li>
                <li><strong>Newsletter:</strong> Subscribe to receive updates on new collections and exclusive offers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Business Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="mb-2"><strong>Business Name:</strong> SON OF GOD</p>
                <p className="mb-2"><strong>Registration:</strong> Registered in Ghana</p>
                <p className="mb-2"><strong>Tax ID:</strong> Available upon request</p>
                <p className="mb-2"><strong>Registered Address:</strong> Accra, Ghana</p>
                <p className="mb-2"><strong>VAT Registration:</strong> In compliance with Ghana Revenue Authority requirements</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Complaints & Feedback</h2>
              <p className="mb-3">
                We value your feedback and are committed to resolving any concerns. If you have a complaint, please contact us through any of the channels listed above. We aim to respond to all complaints within 5 business days.
              </p>
              <p>
                For matters that cannot be resolved directly, you may contact the Ghana Standards Authority or the National Board for Small Scale Industries (NBSSI) for further assistance.
              </p>
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
