import { appointmentService } from './appointmentService'

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

// Loads the Razorpay checkout SDK once and caches it on window.
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/**
 * Runs the full payment flow for a PENDING appointment:
 *   1. ask the backend to create a Razorpay order
 *   2. open the Razorpay checkout popup
 *   3. verify the signature on the backend (marks appointment CONFIRMED)
 *
 * Resolves when payment is verified. Rejects if the SDK fails to load,
 * the user closes the popup, or the payment/verification fails.
 */
export async function payForAppointment(appointment, user) {
  const loaded = await loadRazorpayScript()
  if (!loaded) {
    throw new Error('Could not load Razorpay. Check your internet connection.')
  }

  // 1. Create the order on our backend
  const { data } = await appointmentService.createPaymentOrder(appointment.id)
  const order = data.data // { orderId, amount, currency, keyId }

  // 2. Open Razorpay checkout, 3. verify in the success handler
  return new Promise((resolve, reject) => {
    let paid = false // set the moment Razorpay fires its success handler

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: Math.round(Number(order.amount) * 100), // rupees -> paise
      currency: order.currency,
      name: 'DocApp',
      description: `Consultation with Dr. ${appointment.doctorName}`,
      order_id: order.orderId,
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
      },
      theme: { color: '#2563eb' },
      handler: async (response) => {
        paid = true // mark before the async verify so ondismiss won't treat it as a cancel
        try {
          await appointmentService.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })
          resolve(true)
        } catch (err) {
          reject(new Error('Payment could not be verified. Please contact support.'))
        }
      },
      modal: {
        // Razorpay also fires ondismiss when the modal closes after a successful
        // payment — only treat it as a cancellation if the handler never ran.
        ondismiss: () => {
          if (!paid) reject(new Error('Payment cancelled'))
        },
      },
    })

    rzp.on('payment.failed', (resp) => {
      reject(new Error(resp.error?.description || 'Payment failed'))
    })

    rzp.open()
  })
}