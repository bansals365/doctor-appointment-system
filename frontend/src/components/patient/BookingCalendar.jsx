import { useState, useEffect } from 'react'
import { format, addDays } from 'date-fns'
import { doctorService } from '../../services/doctorService'
import Spinner from '../common/Spinner'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function BookingCalendar({ doctorId, onSlotSelect }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true)
      setSlots([])
      setSelectedSlot(null)
      try {
        const res = await doctorService.getSlots(doctorId, format(selectedDate, 'yyyy-MM-dd'))
        setSlots(res.data.data || [])
      } catch {
        setSlots([])
      } finally {
        setLoading(false)
      }
    }
    fetchSlots()
  }, [doctorId, selectedDate])

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot.id)
    onSlotSelect(slot)
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {days.map((day) => {
          const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
          return (
            <button
              key={day}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center px-4 py-2 rounded-lg min-w-[60px] border transition-colors ${
                isSelected
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'
              }`}
            >
              <span className="text-xs">{format(day, 'EEE')}</span>
              <span className="text-lg font-semibold">{format(day, 'd')}</span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <Spinner />
      ) : slots.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No slots available for this date</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot)}
              className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                selectedSlot === slot.id
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400 hover:text-primary-600'
              }`}
            >
              {slot.startTime}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
