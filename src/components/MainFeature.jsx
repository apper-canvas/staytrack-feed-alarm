import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, addDays, startOfDay } from 'date-fns'
import { Link } from 'react-router-dom'
import ApperIcon from './ApperIcon'
import { bookingService, guestService, roomService } from '../services'
const MainFeature = () => {
  const [bookings, setBookings] = useState([])
  const [guests, setGuests] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)

  const [newBooking, setNewBooking] = useState({
    guestId: '',
    roomId: '',
    checkInDate: format(new Date(), 'yyyy-MM-dd'),
    checkOutDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    totalAmount: 0,
    paymentStatus: 'pending'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [bookingsData, guestsData, roomsData] = await Promise.all([
        bookingService.getAll(),
        guestService.getAll(),
        roomService.getAll()
      ])
      
      setBookings(bookingsData || [])
      setGuests(guestsData || [])
      setRooms(roomsData || [])
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM dd')
  }

  const getBookingsForDate = (date) => {
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkInDate)
      const checkOut = new Date(booking.checkOutDate)
      return date >= startOfDay(checkIn) && date < startOfDay(checkOut)
    })
  }

  const handleCreateBooking = async (e) => {
    e.preventDefault()
    
    if (!newBooking.guestId || !newBooking.roomId) {
      toast.error("Please select both guest and room")
      return
    }

    const selectedRoom = rooms.find(room => room.roomId === newBooking.roomId)
    if (!selectedRoom) {
      toast.error("Selected room not found")
      return
    }

    try {
      const bookingData = {
        ...newBooking,
        totalAmount: selectedRoom.price,
        status: 'confirmed'
      }

      let result
      if (editingBooking) {
        result = await bookingService.update(editingBooking.bookingId, bookingData)
        setBookings(prev => prev.map(b => b.bookingId === editingBooking.bookingId ? result : b))
        toast.success("Booking updated successfully")
      } else {
        result = await bookingService.create(bookingData)
        setBookings(prev => [...prev, result])
        toast.success("Booking created successfully")
      }

      setShowBookingForm(false)
      setEditingBooking(null)
      setNewBooking({
        guestId: '',
        roomId: '',
        checkInDate: format(new Date(), 'yyyy-MM-dd'),
        checkOutDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        totalAmount: 0,
        paymentStatus: 'pending'
      })
    } catch (err) {
      toast.error("Failed to save booking")
    }
  }

  const handleEditBooking = (booking) => {
    setEditingBooking(booking)
    setNewBooking({
      guestId: booking.guestId,
      roomId: booking.roomId,
      checkInDate: format(new Date(booking.checkInDate), 'yyyy-MM-dd'),
      checkOutDate: format(new Date(booking.checkOutDate), 'yyyy-MM-dd'),
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus
    })
    setShowBookingForm(true)
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.delete(bookingId)
      setBookings(prev => prev.filter(b => b.bookingId !== bookingId))
      toast.success("Booking cancelled successfully")
    } catch (err) {
      toast.error("Failed to cancel booking")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'occupied': return 'bg-red-500'
      case 'maintenance': return 'bg-yellow-500'
      case 'reserved': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const tabs = [
    { id: 'calendar', label: 'Booking Calendar', icon: 'Calendar' },
    { id: 'rooms', label: 'Room Status', icon: 'Home' },
    { id: 'bookings', label: 'All Bookings', icon: 'List' }
  ]

  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-card border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Hotel Management Dashboard
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage bookings, rooms, and guest information
            </p>
          </div>
          
          <button
            onClick={() => {
              setEditingBooking(null)
              setNewBooking({
                guestId: '',
                roomId: '',
                checkInDate: format(new Date(), 'yyyy-MM-dd'),
                checkOutDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
                totalAmount: 0,
                paymentStatus: 'pending'
              })
              setShowBookingForm(true)
            }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <ApperIcon name="Plus" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">New Booking</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 sm:space-y-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                7-Day Booking Calendar
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 sm:gap-4">
                {next7Days.map((date) => {
                  const dayBookings = getBookingsForDate(date)
                  
                  return (
                    <motion.div
                      key={date.toISOString()}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-surface-50 dark:bg-surface-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="text-center mb-3">
                        <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                          {format(date, 'EEE')}
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                          {format(date, 'dd')}
                        </div>
                        <div className="text-xs text-primary font-medium">
                          {getDateLabel(date)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {dayBookings.length === 0 ? (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                            No bookings
                          </div>
                        ) : (
                          dayBookings.map((booking) => {
                            const guest = guests.find(g => g.guestId === booking.guestId)
                            const room = rooms.find(r => r.roomId === booking.roomId)
                            
                            return (
                              <div
                                key={booking.bookingId}
                                className="bg-white dark:bg-gray-700 rounded-lg p-2 border border-gray-200 dark:border-gray-600 text-xs"
                              >
                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                  {guest?.name || 'Unknown Guest'}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  Room {room?.roomNumber || 'N/A'}
                                </div>
                                <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'rooms' && (
            <motion.div
              key="rooms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 sm:space-y-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Room Status Overview
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {rooms.map((room) => (
                  <motion.div
                    key={room.roomId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-surface-50 dark:bg-surface-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getRoomStatusColor(room.status)}`} />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Room {room.roomNumber}
                        </span>
                      </div>
                      <ApperIcon name="Home" className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <span className="text-gray-900 dark:text-white capitalize">{room.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Price:</span>
                        <span className="text-gray-900 dark:text-white">${room.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(room.status)}`}>
                          {room.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 sm:space-y-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                All Bookings ({bookings.length})
              </h3>
              
              <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No bookings found</p>
                  </div>
                ) : (
                  bookings.map((booking) => {
                    const guest = guests.find(g => g.guestId === booking.guestId)
                    const room = rooms.find(r => r.roomId === booking.roomId)
                    
                    return (
                      <motion.div
                        key={booking.bookingId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-surface-50 dark:bg-surface-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {guest?.name || 'Unknown Guest'}
                              </h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Room: </span>
                                <span className="text-gray-900 dark:text-white">
                                  {room?.roomNumber || 'N/A'} ({room?.type || 'N/A'})
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Check-in: </span>
                                <span className="text-gray-900 dark:text-white">
                                  {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Check-out: </span>
                                <span className="text-gray-900 dark:text-white">
                                  {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Amount: </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  ${booking.totalAmount}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Payment: </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                                  {booking.paymentStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditBooking(booking)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                            >
                              <ApperIcon name="Edit" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking.bookingId)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowBookingForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingBooking ? 'Edit Booking' : 'New Booking'}
                </h3>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Guest
                  </label>
                  <select
                    value={newBooking.guestId}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, guestId: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select a guest</option>
                    {guests.map(guest => (
                      <option key={guest.guestId} value={guest.guestId}>
                        {guest.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room
                  </label>
                  <select
                    value={newBooking.roomId}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, roomId: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select a room</option>
                    {rooms.filter(room => room.status === 'available').map(room => (
                      <option key={room.roomId} value={room.roomId}>
                        Room {room.roomNumber} - {room.type} (${room.price})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={newBooking.checkInDate}
                      onChange={(e) => setNewBooking(prev => ({ ...prev, checkInDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={newBooking.checkOutDate}
                      onChange={(e) => setNewBooking(prev => ({ ...prev, checkOutDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={newBooking.paymentStatus}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, paymentStatus: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    {editingBooking ? 'Update' : 'Create'} Booking
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature