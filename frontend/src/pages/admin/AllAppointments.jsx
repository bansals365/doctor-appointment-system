import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import Spinner from '../../components/common/Spinner'
import { Calendar, Clock, Search } from 'lucide-react'

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  NO_SHOW: 'bg-red-100 text-red-700',
}

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    adminService.getAllAppointments()
      .then(res => setAppointments(res.data.data || []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = appointments.filter(a => {
    const matchSearch = !search ||
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || a.status === statusFilter
    return matchSearch && matchStatus
  })

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Appointments</h1>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input-field pl-9" placeholder="Search patient or doctor..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto" value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['#', 'Patient', 'Doctor', 'Specialization', 'Date', 'Time', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{a.id}</td>
                  <td className="px-4 py-3 font-medium">{a.patientName}</td>
                  <td className="px-4 py-3">Dr. {a.doctorName}</td>
                  <td className="px-4 py-3 text-gray-500">{a.specialization || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{a.slotDate}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{a.startTime}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_COLORS[a.status]}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-gray-500 text-center py-8">No appointments found</p>
          )}
        </div>
      </div>
    </div>
  )
}
