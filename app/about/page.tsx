import Navbar from "../components/navbar"
import Footer from "../components/footer"
import { Cross as Cross2 } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="w-full">
      <Navbar />
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background pt-28 md:pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Cross2 size={64} className="text-foreground mx-auto mb-8" />
            <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">OUR MISSION</h1>
          </div>

          <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
            <p>
              SON OF GOD exists to glorify Christ through timeless design — clothing that reflects inner faith and
              divine identity. We believe that what you wear is a statement of who you are.
            </p>

            <p>
              Our collections are crafted for believers who lead with purpose, strength, and grace. Each piece is
              designed with intention, combining minimalist aesthetics with faith-inspired messaging that resonates with
              your spiritual journey.
            </p>

            <p>
              We are committed to creating clothing that empowers you to walk in faith, wear your purpose, and share
              your devotion with the world. Every design tells a story of grace, hope, and the transformative power of
              believing.
            </p>

            <p>
              Join the faith family and discover how fashion can be a powerful expression of your deepest convictions.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
