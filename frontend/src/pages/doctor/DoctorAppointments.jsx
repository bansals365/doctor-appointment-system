import { useState, useEffect } from 'react'
import { doctorService } from '../../services/doctorService'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { Calendar, Clock } from 'lucide-react'

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  NO_SHOW: 'bg-red-100 text-red-700',
}

const NEXT_STATUSES = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'NO_SHOW', 'CANCELLED'],
}

function PaymentBadge({ method, status }) {
  if (!method) return <span className="text-gray-400">—</span>
  if (method === 'CASH') return <span className="badge bg-amber-100 text-amber-700">Cash · at hospital</span>
  if (status === 'SUCCESS') return <span className="badge bg-green-100 text-green-700">Paid online</span>
  return <span className="badge bg-gray-100 text-gray-500">Online · pending</span>
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    try {
      const res = await doctorService.getMyAppointments()
      setAppointments(res.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAppointments() }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await doctorService.updateAppointmentStatus(id, status)
      toast.success(`Status updated to ${status}`)
      fetchAppointments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  }

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h1>

      {appointments.length === 0 ? (
        <div className="card text-center py-16 text-gray-500">No appointments yet</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Patient', 'Date', 'Time', 'Status', 'Payment', 'Notes', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{a.patientName}</td>
                    <td className="px-4 py-3 text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{a.slotDate}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{a.startTime}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLORS[a.status]}`}>{a.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <PaymentBadge method={a.paymentMethod} status={a.paymentStatus} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{a.notes || '—'}</td>
                    <td className="px-4 py-3">
                      {NEXT_STATUSES[a.status] && (
                        <div className="flex gap-2">
                          {NEXT_STATUSES[a.status].map(s => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(a.id, s)}
                              className={`text-xs px-2 py-1 rounded font-medium ${
                                s === 'COMPLETED' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                s === 'CONFIRMED' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
