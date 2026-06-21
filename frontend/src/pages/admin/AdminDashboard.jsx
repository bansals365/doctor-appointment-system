import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import StatsCard from '../../components/admin/StatsCard'
import Spinner from '../../components/common/Spinner'
import { Users, Stethoscope, Calendar, IndianRupee, Clock, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getStats().then(res => setStats(res.data.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>
  if (!stats) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">System overview</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard title="Total Doctors" value={stats.totalDoctors} icon={Stethoscope} color="blue" />
        <StatsCard title="Total Patients" value={stats.totalPatients} icon={Users} color="purple" />
        <StatsCard title="Total Appointments" value={stats.totalAppointments} icon={Calendar} color="orange" />
        <StatsCard title="Pending Appointments" value={stats.pendingAppointments} icon={Clock} color="orange" />
        <StatsCard title="Completed Appointments" value={stats.completedAppointments} icon={CheckCircle} color="green" />
        <StatsCard title="Total Revenue" value={`₹${stats.totalRevenue || 0}`} icon={IndianRupee} color="green" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <a href="/admin/doctors" className="card hover:shadow-md transition-shadow text-center group">
          <Stethoscope className="w-8 h-8 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-gray-900">Manage Doctors</p>
          <p className="text-sm text-gray-500 mt-1">Add, edit, remove doctors</p>
        </a>
        <a href="/admin/appointments" className="card hover:shadow-md transition-shadow text-center group">
          <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-gray-900">All Appointments</p>
          <p className="text-sm text-gray-500 mt-1">View system-wide bookings</p>
        </a>
      </div>
    </div>
  )
}
