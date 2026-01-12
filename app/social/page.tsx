import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { Instagram, Facebook, Twitter, Mail, MessageCircle } from "lucide-react"

export default function SocialPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar />
      
      <section className="w-full py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-8"
            style={{ fontFamily: 'var(--font-brand)', fontWeight: 400 }}
          >
            Connect With Us
          </h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <p className="mb-6 text-lg">
                Join the SON OF GOD community and stay connected with us across all our social platforms. Follow us for the latest updates, new collections, exclusive content, and to be part of our faith-inspired journey.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6 text-black">Social Media Platforms</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                  href="https://www.instagram.com/sonofgod_world/?__pwa=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-200 rounded-lg p-6 hover:border-black transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-lg flex items-center justify-center">
                      <Instagram size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black group-hover:opacity-70 transition-opacity">Instagram</h3>
                      <p className="text-sm text-gray-600">@sonofgod_world</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Follow us for daily inspiration, behind-the-scenes content, style tips, and updates on new collections.
                  </p>
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-200 rounded-lg p-6 hover:border-black transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Facebook size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black group-hover:opacity-70 transition-opacity">Facebook</h3>
                      <p className="text-sm text-gray-600">SON OF GOD</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Connect with our community, join discussions, and stay updated on events and special promotions.
                  </p>
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-200 rounded-lg p-6 hover:border-black transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                      <Twitter size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black group-hover:opacity-70 transition-opacity">Twitter / X</h3>
                      <p className="text-sm text-gray-600">@sonofgod_world</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Get real-time updates, engage in conversations, and share your faith journey with our community.
                  </p>
                </a>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                      <MessageCircle size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black">WhatsApp</h3>
                      <p className="text-sm text-gray-600">+233 XX XXX XXXX</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">
                    Chat with us directly for customer support, inquiries, and personalized assistance.
                  </p>
                  <a
                    href="https://wa.me/233XXXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-black font-semibold hover:opacity-70 transition-opacity inline-flex items-center gap-2"
                  >
                    Send Message →
                  </a>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Newsletter & Email</h2>
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black">Email Newsletter</h3>
                    <p className="text-sm text-gray-600">Subscribe for exclusive updates</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Be the first to know about new collections, exclusive offers, and special events. Subscribe to our newsletter and join our community of believers who walk in faith and wear their purpose.
                </p>
                <p className="text-sm text-gray-600">
                  You can subscribe through our website footer or contact us directly at: contact@sonofgod.com
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Community Guidelines</h2>
              <p className="mb-3">
                We believe in creating a positive, respectful, and faith-centered community. When engaging with us on social media:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Show respect and kindness to all community members</li>
                <li>Share content that aligns with our values of faith, hope, and love</li>
                <li>Engage in constructive and meaningful conversations</li>
                <li>Respect intellectual property and copyright</li>
                <li>Report any inappropriate content or behavior</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Content & User-Generated Content</h2>
              <p className="mb-3">
                We love to see how you style SON OF GOD pieces! When you tag us or use our hashtags, you grant us permission to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Share your content on our social media platforms (with credit)</li>
                <li>Use your content for promotional purposes</li>
                <li>Feature your content in our marketing materials</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                By using our hashtags or tagging us, you confirm that you own the rights to the content or have obtained necessary permissions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Privacy & Data Protection</h2>
              <p className="mb-3">
                Your privacy is important to us. When you interact with us on social media:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your interactions are subject to the respective social media platform's privacy policies</li>
                <li>We handle any personal information you share with us in accordance with our Privacy Policy and Ghana's Data Protection Act, 2012 (Act 843)</li>
                <li>We will never share your personal information without your consent</li>
              </ul>
              <p className="mt-4">
                For more information, please review our <a href="/privacy" className="text-black underline hover:opacity-70">Privacy Policy</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-black">Contact Us</h2>
              <p className="mb-3">
                For social media inquiries, collaborations, or concerns, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="mb-2"><strong>Email:</strong> contact@sonofgod.com</p>
                <p className="mb-2"><strong>Subject Line:</strong> Social Media Inquiry</p>
                <p className="mb-2"><strong>Phone:</strong> +233 XX XXX XXXX</p>
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
