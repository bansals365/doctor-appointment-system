import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { doctorService } from '../../services/doctorService'
import { adminService } from '../../services/adminService'
import DoctorCard from '../../components/patient/DoctorCard'
import Spinner from '../../components/common/Spinner'
import { Search, Filter } from 'lucide-react'

export default function DoctorList() {
  const [searchParams] = useSearchParams()
  const [doctors, setDoctors] = useState([])
  const [specs, setSpecs] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    name: searchParams.get('name') || '',
    specId: '',
    location: '',
  })

  useEffect(() => {
    adminService.getSpecializations().then(res => setSpecs(res.data.data || []))
  }, [])

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true)
      try {
        const params = {}
        if (filters.name) params.name = filters.name
        if (filters.specId) params.specId = filters.specId
        if (filters.location) params.location = filters.location
        const res = await doctorService.search(params)
        setDoctors(res.data.data || [])
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [filters])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Doctors</h1>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Doctor name..."
              value={filters.name}
              onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <select
            className="input-field"
            value={filters.specId}
            onChange={e => setFilters(f => ({ ...f, specId: e.target.value }))}
          >
            <option value="">All Specializations</option>
            {specs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input
            className="input-field"
            placeholder="Location..."
            value={filters.location}
            onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
          />
        </div>
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No doctors found</p>
          <p className="text-sm mt-1">Try different filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{doctors.length} doctor(s) found</p>
          {doctors.map(d => <DoctorCard key={d.id} doctor={d} />)}
        </div>
      )}
    </div>
  )
}
