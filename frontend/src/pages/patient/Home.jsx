import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Stethoscope, Calendar, Shield } from 'lucide-react'

const SPECIALIZATIONS = [
  { name: 'Cardiologist', icon: '❤️' },
  { name: 'Dermatologist', icon: '🌿' },
  { name: 'Neurologist', icon: '🧠' },
  { name: 'Orthopedist', icon: '🦴' },
  { name: 'Pediatrician', icon: '👶' },
  { name: 'Psychiatrist', icon: '🧘' },
  { name: 'Gynecologist', icon: '👩‍⚕️' },
  { name: 'ENT Specialist', icon: '👂' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/doctors?name=${encodeURIComponent(query)}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Find & Book Your Doctor
          </h1>
          <p className="text-primary-100 text-lg mb-8">
            Search from hundreds of verified doctors across specializations. Book appointments instantly.
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor name or specialization..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Specializations */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Specialization</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SPECIALIZATIONS.map((spec) => (
            <button
              key={spec.name}
              onClick={() => navigate(`/doctors?name=${encodeURIComponent(spec.name)}`)}
              className="card hover:shadow-md transition-shadow text-center hover:border-primary-300"
            >
              <div className="text-4xl mb-2">{spec.icon}</div>
              <p className="font-medium text-gray-700 text-sm">{spec.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">Why Choose DocApp?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Stethoscope, title: 'Verified Doctors', desc: 'All doctors are verified with proper credentials and experience', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: Calendar, title: 'Easy Booking', desc: 'Book appointments in minutes, choose your preferred time slot', color: 'text-green-500', bg: 'bg-green-50' },
              { icon: Shield, title: 'Secure & Private', desc: 'Your health data is encrypted and kept completely private', color: 'text-purple-500', bg: 'bg-purple-50' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="text-center">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${bg} mb-4`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
