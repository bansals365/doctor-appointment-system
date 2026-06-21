import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doctorService } from '../../services/doctorService'
import { appointmentService } from '../../services/appointmentService'
import BookingCalendar from '../../components/patient/BookingCalendar'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { MapPin, Clock, Star, IndianRupee, GraduationCap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function DoctorProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [booking, setBooking] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    doctorService.getById(id)
      .then(res => setDoctor(res.data.data))
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (!selectedSlot) { toast.error('Please select a time slot'); return }

    setBooking(true)
    try {
      await appointmentService.book({ slotId: selectedSlot.id, notes })
      toast.success('Appointment booked successfully!')
      navigate('/my-appointments')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>
  if (!doctor) return <div className="text-center py-20 text-gray-500">Doctor not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Doctor Info */}
      <div className="card mb-6">
        <div className="flex gap-6">
          <div className="w-24 h-24 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            {doctor.profileImage ? (
              <img src={doctor.profileImage} className="w-24 h-24 rounded-2xl object-cover" alt={doctor.name} />
            ) : (
              <span className="text-3xl font-bold text-primary-600">{doctor.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Dr. {doctor.name}</h1>
            {doctor.specialization && (
              <p className="text-primary-600 font-medium">{doctor.specialization}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              {doctor.experience && (
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {doctor.experience} yrs experience</span>
              )}
              {doctor.location && (
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {doctor.location}</span>
              )}
              {doctor.rating > 0 && (
                <span className="flex items-center gap-1 text-yellow-600"><Star className="w-4 h-4 fill-yellow-400" /> {doctor.rating} rating</span>
              )}
            </div>
            {doctor.fees && (
              <div className="mt-3 flex items-center gap-1 text-lg font-semibold text-gray-900">
                <IndianRupee className="w-5 h-5" />{doctor.fees} per visit
              </div>
            )}
          </div>
        </div>
        {doctor.bio && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> About
            </h3>
            <p className="text-gray-600 text-sm">{doctor.bio}</p>
          </div>
        )}
      </div>

      {/* Booking Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Book an Appointment</h2>
        <BookingCalendar doctorId={id} onSlotSelect={setSelectedSlot} />

        {selectedSlot && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="bg-primary-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-primary-800">
                Selected: {selectedSlot.slotDate} at {selectedSlot.startTime}
              </p>
            </div>
            <textarea
              className="input-field mb-4"
              rows={3}
              placeholder="Any notes for the doctor? (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <button
              onClick={handleBook}
              disabled={booking}
              className="btn-primary w-full"
            >
              {booking ? 'Booking...' : `Book Appointment`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
