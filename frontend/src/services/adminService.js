import api from './api'

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAllDoctors: () => api.get('/admin/doctors'),
  createDoctor: (data) => api.post('/admin/doctors', data),
  updateDoctor: (id, data) => api.put(`/admin/doctors/${id}`, data),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
  getAllAppointments: () => api.get('/admin/appointments'),
  getSpecializations: () => api.get('/admin/specializations'),
  addSpecialization: (data) => api.post('/admin/specializations', data),
}
