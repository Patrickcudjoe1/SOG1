import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="w-full">
      <Navbar />
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white pt-20 md:pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight text-black mb-4 text-center">GET IN TOUCH</h1>
          <p className="text-lg text-stone-600 text-center mb-16">
            We'd love to hear from you. Reach out with any questions or inquiries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <Mail size={40} className="text-black mx-auto mb-4" />
              <h3 className="font-semibold text-black mb-2">Email</h3>
              <p className="text-stone-600">hello@sonofgod.com</p>
            </div>
            <div className="text-center">
              <Phone size={40} className="text-black mx-auto mb-4" />
              <h3 className="font-semibold text-black mb-2">Phone</h3>
              <p className="text-stone-600">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <MapPin size={40} className="text-black mx-auto mb-4" />
              <h3 className="font-semibold text-black mb-2">Location</h3>
              <p className="text-stone-600">New York, NY</p>
            </div>
          </div>

          <form className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Your email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Message</label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Your message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-4 font-semibold tracking-wide hover:bg-stone-800 transition-colors"
            >
              SEND MESSAGE
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  )
}
