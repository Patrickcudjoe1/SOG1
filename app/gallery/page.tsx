import Navbar from "../components/navbar"
import Footer from "../components/footer"

export default function GalleryPage() {
  const galleryImages = [
    { id: 1, label: "Faith", image: "/SOG105.jpg" },
    { id: 2, label: "Grace", image: "/SOG106.jpg" },
    { id: 3, label: "Purpose", image: "/SOG107.jpg" },
    { id: 4, label: "Light", image: "/SOG200.jpg" },
    { id: 5, label: "Devotion", image: "/SOG103.jpg" },
    { id: 6, label: "Spirit", image: "/SOG300.jpg" },
    { id: 7, label: "Truth", image: "/SOG222.jpg" },
    { id: 8, label: "Love", image: "/SOG333.jpg" },
    { id: 9, label: "Peace", image: "/SOG444.jpg" },
    { id: 10, label: "Hope", image: "/SOG600.jpg" },
    { id: 11, label: "Joy", image: "/SOG777.jpg" },
    { id: 12, label: "Strength", image: "/SOG888.jpg" },
  ]

  return (
    <main className="w-full">
      <Navbar />
      
      {/* Collection Hero Section */}
      <section className="w-full bg-white border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] md:min-h-screen">
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-wide uppercase mb-6 md:mb-8 leading-tight">
              COLLECTION 777 WEAR
            </h1>
            <p className="text-sm md:text-base lg:text-lg font-light leading-relaxed text-gray-700 mb-8 md:mb-12 max-w-2xl">
              For Collection Nine, Son of God draws from the visual and metaphoric field of faith: a realm embedded deeply in our culture and the vision of Son of God. "The one constant in our history is faith, a mark of the times." reflects our founder. "And growing up in a faith-filled family, nine is the perfect number. Nine fruits of the spirit, nine as a symbol of completion." Translated from the ethereal to the physical, what emerges is the refined sophistication of the house's shapes and silhouettes, imbued with the honesty of American tailoring and sportswear. Here is one of the enduring signposts of our culture, reflected through the distinct Son of God perspective.
            </p>
            <p className="text-xs md:text-sm font-light text-gray-600 uppercase tracking-wider">
              The collection arrives early 2026.
            </p>
          </div>

          {/* Right: Model Image */}
          <div className="relative w-full h-[400px] md:h-auto bg-gray-100">
            <img
              src="/SOG106.jpg"
              alt="Collection Nine Menswear"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="w-full py-8 md:py-20 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black mb-3 md:mb-4 text-center">FAITH IN MOTION</h2>
          <p className="text-sm md:text-lg text-stone-600 text-center mb-8 md:mb-16">
            A complete visual story of style, purpose, and devotion.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {galleryImages.map((item) => (
              <div key={item.id} className="relative overflow-hidden group cursor-pointer aspect-square">
                <img
                  src={item.image || "/SOG12.jpg"}
                  alt={`${item.label}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-lg md:text-2xl font-semibold tracking-wide">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
