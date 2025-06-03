import guestsData from '../mockData/guests.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let guests = [...guestsData]

const guestService = {
  async getAll() {
    await delay(250)
    return [...guests]
  },

  async getById(id) {
    await delay(200)
    const guest = guests.find(g => g.guestId === id)
    return guest ? { ...guest } : null
  },

  async create(guestData) {
    await delay(400)
    const newGuest = {
      ...guestData,
      guestId: `guest_${Date.now()}`,
      bookingHistory: []
    }
    guests.push(newGuest)
    return { ...newGuest }
  },

  async update(id, guestData) {
    await delay(350)
    const index = guests.findIndex(g => g.guestId === id)
    if (index === -1) {
      throw new Error('Guest not found')
    }
    
    guests[index] = {
      ...guests[index],
      ...guestData
    }
    return { ...guests[index] }
  },

  async delete(id) {
    await delay(250)
    const index = guests.findIndex(g => g.guestId === id)
    if (index === -1) {
      throw new Error('Guest not found')
    }
    
    const deletedGuest = guests.splice(index, 1)[0]
    return { ...deletedGuest }
  }
}

export default guestService