import { Link } from 'react-router-dom'
import { Star, MapPin, Clock, IndianRupee } from 'lucide-react'

export default function DoctorCard({ doctor }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          {doctor.profileImage ? (
            <img src={doctor.profileImage} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-primary-600">{doctor.name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg">Dr. {doctor.name}</h3>
          {doctor.specialization && (
            <p className="text-primary-600 text-sm font-medium">{doctor.specialization}</p>
          )}
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
            {doctor.experience && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {doctor.experience} yrs exp
              </span>
            )}
            {doctor.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {doctor.location}
              </span>
            )}
            {doctor.rating > 0 && (
              <span className="flex items-center gap-1 text-yellow-600">
                <Star className="w-3.5 h-3.5 fill-yellow-400" /> {doctor.rating}
              </span>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          {doctor.fees && (
            <p className="font-semibold text-gray-900 flex items-center justify-end gap-0.5">
              <IndianRupee className="w-4 h-4" />{doctor.fees}
            </p>
          )}
          <p className="text-xs text-gray-500 mb-3">per visit</p>
          <Link to={`/doctors/${doctor.id}`} className="btn-primary text-sm">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
