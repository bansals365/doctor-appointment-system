import { useState, useEffect } from 'react'
import { doctorService } from '../../services/doctorService'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import { Plus, Trash2, Clock } from 'lucide-react'
import { format, addDays } from 'date-fns'

export default function ManageSlots() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '' })
  const [adding, setAdding] = useState(false)

  const fetchSlots = async () => {
    try {
      const res = await doctorService.getMySlots()
      setSlots(res.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSlots() }, [])

  const handleAddSlot = async () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast.error('Please fill in start and end time')
      return
    }
    setAdding(true)
    try {
      await doctorService.addSlots({
        date: selectedDate,
        slots: [{ startTime: newSlot.startTime + ':00', endTime: newSlot.endTime + ':00' }]
      })
      toast.success('Slot added!')
      setNewSlot({ startTime: '', endTime: '' })
      fetchSlots()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add slot')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await doctorService.deleteSlot(id)
      toast.success('Slot removed')
      fetchSlots()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete booked slot')
    }
  }

  const filteredSlots = slots.filter(s => s.slotDate === selectedDate)
  const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Time Slots</h1>

      {/* Date Selector */}
      <div className="card mb-6">
        <h2 className="font-medium text-gray-700 mb-3">Select Date</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const isSelected = dateStr === selectedDate
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex flex-col items-center px-4 py-2 rounded-lg min-w-[60px] border transition-colors ${
                  isSelected ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'
                }`}
              >
                <span className="text-xs">{format(day, 'EEE')}</span>
                <span className="text-lg font-semibold">{format(day, 'd')}</span>
                <span className="text-xs">{format(day, 'MMM')}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Add Slot */}
      <div className="card mb-6">
        <h2 className="font-medium text-gray-700 mb-3">Add Slot for {selectedDate}</h2>
        <div className="flex gap-3 flex-wrap">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Start Time</label>
            <input type="time" className="input-field w-auto"
              value={newSlot.startTime}
              onChange={e => setNewSlot(s => ({ ...s, startTime: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">End Time</label>
            <input type="time" className="input-field w-auto"
              value={newSlot.endTime}
              onChange={e => setNewSlot(s => ({ ...s, endTime: e.target.value }))} />
          </div>
          <div className="flex items-end">
            <button onClick={handleAddSlot} disabled={adding} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> {adding ? 'Adding...' : 'Add Slot'}
            </button>
          </div>
        </div>
      </div>

      {/* Slots List */}
      <div className="card">
        <h2 className="font-medium text-gray-700 mb-3">
          Slots for {selectedDate} ({filteredSlots.length} total)
        </h2>
        {filteredSlots.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No slots for this date</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredSlots.map(slot => (
              <div key={slot.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                slot.isBooked ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}>
                <div>
                  <p className="font-medium text-sm">{slot.startTime}</p>
                  <p className={`text-xs ${slot.isBooked ? 'text-red-500' : 'text-green-600'}`}>
                    {slot.isBooked ? 'Booked' : 'Available'}
                  </p>
                </div>
                {!slot.isBooked && (
                  <button onClick={() => handleDelete(slot.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
