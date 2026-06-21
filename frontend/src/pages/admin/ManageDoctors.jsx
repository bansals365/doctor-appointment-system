import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

function DoctorModal({ doctor, specs, onClose, onSave }) {
  const [form, setForm] = useState(doctor || {
    name: '', email: '', password: '', phone: '', specializationId: '',
    experience: '', fees: '', bio: '', location: ''
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (doctor) {
        await adminService.updateDoctor(doctor.id, form)
        toast.success('Doctor updated')
      } else {
        await adminService.createDoctor(form)
        toast.success('Doctor created')
      }
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { label: 'Full Name', key: 'name', type: 'text', required: true },
    { label: 'Email', key: 'email', type: 'email', required: true },
    ...(!doctor ? [{ label: 'Password', key: 'password', type: 'password', required: true }] : []),
    { label: 'Phone', key: 'phone', type: 'text' },
    { label: 'Experience (years)', key: 'experience', type: 'number' },
    { label: 'Fees (₹)', key: 'fees', type: 'number' },
    { label: 'Location', key: 'location', type: 'text' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-semibold text-lg">{doctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{f.label}</label>
              <input
                type={f.type}
                required={f.required}
                className="input-field"
                value={form[f.key] || ''}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Specialization</label>
            <select className="input-field" value={form.specializationId || ''}
              onChange={e => setForm(p => ({ ...p, specializationId: e.target.value }))}>
              <option value="">Select specialization</option>
              {specs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Bio</label>
            <textarea className="input-field" rows={3} value={form.bio || ''}
              onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([])
  const [specs, setSpecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchData = async () => {
    const [dRes, sRes] = await Promise.all([adminService.getAllDoctors(), adminService.getSpecializations()])
    setDoctors(dRes.data.data || [])
    setSpecs(sRes.data.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this doctor?')) return
    try {
      await adminService.deleteDoctor(id)
      toast.success('Doctor deactivated')
      fetchData()
    } catch { toast.error('Failed') }
  }

  const openEdit = (doc) => { setEditing(doc); setModalOpen(true) }
  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }
  const onSave = () => { closeModal(); fetchData() }

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Doctor
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Name', 'Email', 'Specialization', 'Experience', 'Fees', 'Location', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {doctors.map(d => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Dr. {d.name}</td>
                  <td className="px-4 py-3 text-gray-500">{d.email}</td>
                  <td className="px-4 py-3 text-gray-500">{d.specialization || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{d.experience ? `${d.experience} yrs` : '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{d.fees ? `₹${d.fees}` : '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{d.location || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${d.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {d.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(d)} className="text-blue-500 hover:text-blue-700">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(d.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <DoctorModal
          doctor={editing}
          specs={specs}
          onClose={closeModal}
          onSave={onSave}
        />
      )}
    </div>
  )
}
