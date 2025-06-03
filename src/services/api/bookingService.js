import bookingsData from '../mockData/bookings.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let bookings = [...bookingsData]

const bookingService = {
  async getAll() {
    await delay(300)
    return [...bookings]
  },

  async getById(id) {
    await delay(200)
    const booking = bookings.find(b => b.bookingId === id)
    return booking ? { ...booking } : null
  },

  async create(bookingData) {
    await delay(400)
    const newBooking = {
      ...bookingData,
      bookingId: `booking_${Date.now()}`,
      status: bookingData.status || 'confirmed'
    }
    bookings.push(newBooking)
    return { ...newBooking }
  },

  async update(id, bookingData) {
    await delay(350)
    const index = bookings.findIndex(b => b.bookingId === id)
    if (index === -1) {
      throw new Error('Booking not found')
    }
    
    bookings[index] = {
      ...bookings[index],
      ...bookingData
    }
    return { ...bookings[index] }
  },

  async delete(id) {
    await delay(250)
    const index = bookings.findIndex(b => b.bookingId === id)
    if (index === -1) {
      throw new Error('Booking not found')
    }
    
    const deletedBooking = bookings.splice(index, 1)[0]
    return { ...deletedBooking }
  }
}

export default bookingService