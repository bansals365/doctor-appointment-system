import api from './api'

export const doctorService = {
  search: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  getSlots: (id, date) => api.get(`/doctors/${id}/slots`, { params: { date } }),

  // Doctor dashboard
  getProfile: () => api.get('/doctor/profile'),
  getMyAppointments: () => api.get('/doctor/appointments'),
  updateAppointmentStatus: (id, status) => api.put(`/doctor/appointments/${id}/status`, { status }),
  getMySlots: () => api.get('/doctor/slots'),
  addSlots: (data) => api.post('/doctor/slots', data),
  deleteSlot: (id) => api.delete(`/doctor/slots/${id}`),
}
