import Link from 'next/link'
import Navbar from './components/navbar'
import Footer from './components/footer'

export default function NotFound() {
  return (
    <main className="w-full min-h-screen bg-white">
      <Navbar />
      <section className="w-full min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 
            className="text-6xl md:text-8xl font-light tracking-widest"
            style={{ fontFamily: 'var(--font-brand)', fontWeight: 400 }}
          >
            404
          </h1>
          <h2 
            className="text-2xl md:text-3xl font-light tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-brand)' }}
          >
            Page Not Found
          </h2>
          <p className="text-sm font-light text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 text-xs tracking-widest uppercase font-light mt-8"
            style={{ fontFamily: 'var(--font-brand)' }}
          >
            Return Home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}

