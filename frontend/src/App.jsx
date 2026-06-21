import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import ProtectedRoute from './components/common/ProtectedRoute'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Patient
import Home from './pages/patient/Home'
import DoctorList from './pages/patient/DoctorList'
import DoctorProfile from './pages/patient/DoctorProfile'
import MyAppointments from './pages/patient/MyAppointments'

// Doctor
import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import ManageSlots from './pages/doctor/ManageSlots'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageDoctors from './pages/admin/ManageDoctors'
import AllAppointments from './pages/admin/AllAppointments'

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'DOCTOR') return <Navigate to="/doctor/dashboard" replace />
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
  return <Home />
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />

          {/* Home with role redirect */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Patient only */}
          <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
            <Route path="/my-appointments" element={<MyAppointments />} />
          </Route>

          {/* Doctor only */}
          <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/slots" element={<ManageSlots />} />
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/doctors" element={<ManageDoctors />} />
            <Route path="/admin/appointments" element={<AllAppointments />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
