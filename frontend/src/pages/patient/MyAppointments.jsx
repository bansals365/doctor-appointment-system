import { useState, useEffect } from 'react'
import { appointmentService } from '../../services/appointmentService'
import { payForAppointment } from '../../services/paymentService'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { Calendar, Clock, User, XCircle, CreditCard, Building2 } from 'lucide-react'

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  NO_SHOW: 'bg-red-100 text-red-700',
}

export default function MyAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState(null)

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getMyAppointments()
      setAppointments(res.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAppointments() }, [])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return
    try {
      await appointmentService.cancel(id)
      toast.success('Appointment cancelled')
      fetchAppointments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    }
  }

  const handlePay = async (appt) => {
    try {
      setPayingId(appt.id)
      await payForAppointment(appt, user)
      toast.success('Payment successful! Appointment confirmed.')
      await fetchAppointments()
    } catch (err) {
      toast.error(err.message || 'Payment failed')
    } finally {
      setPayingId(null)
    }
  }

  const handlePayAtHospital = async (appt) => {
    if (!confirm('Confirm this appointment and pay at the hospital during your visit?')) return
    try {
      setPayingId(appt.id)
      await appointmentService.payAtHospital(appt.id)
      toast.success('Booking confirmed! Please pay at the hospital during your visit.')
      await fetchAppointments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm')
    } finally {
      setPayingId(null)
    }
  }

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h1>

      {appointments.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No appointments yet</p>
          <a href="/doctors" className="btn-primary mt-4 inline-block">Find a Doctor</a>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(appt => (
            <div key={appt.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">Dr. {appt.doctorName}</span>
                    {appt.specialization && (
                      <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                        {appt.specialization}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {appt.slotDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {appt.startTime}
                    </span>
                  </div>
                  {appt.notes && <p className="text-sm text-gray-500 mt-2 italic">{appt.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`badge ${STATUS_COLORS[appt.status]}`}>{appt.status}</span>
                  {appt.status === 'PENDING' && (
                    <button
                      onClick={() => handlePay(appt)}
                      disabled={payingId === appt.id}
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      {payingId === appt.id ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}
                  {appt.status === 'PENDING' && (
                    <button
                      onClick={() => handlePayAtHospital(appt)}
                      disabled={payingId === appt.id}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Pay at Hospital
                    </button>
                  )}
                  {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
