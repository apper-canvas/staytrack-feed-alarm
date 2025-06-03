import roomsData from '../mockData/rooms.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let rooms = [...roomsData]

const roomService = {
  async getAll() {
    await delay(300)
    return [...rooms]
  },

  async getById(id) {
    await delay(200)
    const room = rooms.find(r => r.roomId === id)
    return room ? { ...room } : null
  },

  async create(roomData) {
    await delay(400)
    const newRoom = {
      ...roomData,
      roomId: `room_${Date.now()}`,
      status: roomData.status || 'available'
    }
    rooms.push(newRoom)
    return { ...newRoom }
  },

  async update(id, roomData) {
    await delay(350)
    const index = rooms.findIndex(r => r.roomId === id)
    if (index === -1) {
      throw new Error('Room not found')
    }
    
    rooms[index] = {
      ...rooms[index],
      ...roomData
    }
    return { ...rooms[index] }
  },

  async delete(id) {
    await delay(250)
    const index = rooms.findIndex(r => r.roomId === id)
    if (index === -1) {
      throw new Error('Room not found')
    }
    
    const deletedRoom = rooms.splice(index, 1)[0]
    return { ...deletedRoom }
  }
}

export default roomService