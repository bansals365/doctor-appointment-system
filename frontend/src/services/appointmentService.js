import api from './api'

export const appointmentService = {
  book: (data) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/my'),
  cancel: (id) => api.delete(`/appointments/${id}`),
  createPaymentOrder: (appointmentId) => api.post('/payments/create-order', { appointmentId }),
  verifyPayment: (data) => api.post('/payments/verify', data),
  payAtHospital: (appointmentId) => api.post('/payments/pay-at-hospital', { appointmentId }),
}
