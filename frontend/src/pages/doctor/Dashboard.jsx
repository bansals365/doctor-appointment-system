import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doctorService } from '../../services/doctorService'
import Spinner from '../../components/common/Spinner'
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  NO_SHOW: 'bg-red-100 text-red-700',
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([doctorService.getProfile(), doctorService.getMyAppointments()])
      .then(([pRes, aRes]) => {
        setProfile(pRes.data.data)
        setAppointments(aRes.data.data || [])
      })
      .finally(() => setLoading(false))
  }, [])

  const today = format(new Date(), 'yyyy-MM-dd')
  const todayAppts = appointments.filter(a => a.slotDate === today)
  const pending = appointments.filter(a => a.status === 'PENDING').length
  const completed = appointments.filter(a => a.status === 'COMPLETED').length

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, Dr. {profile?.name?.split(' ')[0] || ''}!
        </h1>
        <p className="text-gray-500 text-sm mt-1">{format(new Date(), 'EEEE, dd MMMM yyyy')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Appointments", value: todayAppts.length, icon: Calendar, color: 'bg-blue-100 text-blue-600' },
          { label: 'Total Appointments', value: appointments.length, icon: Users, color: 'bg-purple-100 text-purple-600' },
          { label: 'Pending', value: pending, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
          { label: 'Completed', value: completed, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
              </div>
              <div className={`p-3 rounded-xl ${color}`}><Icon className="w-5 h-5" /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Today&apos;s Appointments</h2>
          <Link to="/doctor/appointments" className="text-primary-600 text-sm hover:underline">View all</Link>
        </div>
        {todayAppts.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No appointments today</p>
        ) : (
          <div className="space-y-3">
            {todayAppts.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{a.patientName}</p>
                  <p className="text-sm text-gray-500">{a.startTime} – {a.endTime}</p>
                </div>
                <span className={`badge ${STATUS_COLORS[a.status]}`}>{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
