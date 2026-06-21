import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Stethoscope, LogOut, User, Calendar } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    if (user.role === 'DOCTOR') return '/doctor/dashboard'
    if (user.role === 'ADMIN') return '/admin/dashboard'
    return '/'
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={getDashboardLink()} className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <Stethoscope className="w-7 h-7" />
            DocApp
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user.role === 'PATIENT' && (
                  <>
                    <Link to="/doctors" className="text-gray-600 hover:text-primary-600 text-sm font-medium">Find Doctors</Link>
                    <Link to="/my-appointments" className="flex items-center gap-1 text-gray-600 hover:text-primary-600 text-sm font-medium">
                      <Calendar className="w-4 h-4" /> My Appointments
                    </Link>
                  </>
                )}
                {user.role === 'DOCTOR' && (
                  <>
                    <Link to="/doctor/dashboard" className="text-gray-600 hover:text-primary-600 text-sm font-medium">Dashboard</Link>
                    <Link to="/doctor/appointments" className="text-gray-600 hover:text-primary-600 text-sm font-medium">Appointments</Link>
                    <Link to="/doctor/slots" className="text-gray-600 hover:text-primary-600 text-sm font-medium">Manage Slots</Link>
                  </>
                )}
                {user.role === 'ADMIN' && (
                  <>
                    <Link to="/admin/dashboard" className="text-gray-600 hover:text-primary-600 text-sm font-medium">Dashboard</Link>
                    <Link to="/admin/doctors" className="text-gray-600 hover:text-primary-600 text-sm font-medium">Doctors</Link>
                    <Link to="/admin/appointments" className="text-gray-600 hover:text-primary-600 text-sm font-medium">Appointments</Link>
                  </>
                )}
                <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                  <button onClick={handleLogout} className="ml-2 text-gray-500 hover:text-red-500 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 text-sm font-medium">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
