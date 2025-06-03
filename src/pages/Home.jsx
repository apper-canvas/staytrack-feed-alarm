import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import { bookingService, guestService, roomService } from '../services'

const Home = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    availableRooms: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      try {
        const [bookings, rooms] = await Promise.all([
          bookingService.getAll(),
          roomService.getAll()
        ])

        const totalBookings = bookings?.length || 0
        const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0) || 0
        const availableRooms = rooms?.filter(room => room.status === 'available')?.length || 0
        const occupancyRate = rooms?.length > 0 ? ((rooms.length - availableRooms) / rooms.length * 100) : 0

        setStats({
          totalBookings,
          totalRevenue,
          occupancyRate: Math.round(occupancyRate),
          availableRooms
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: "Calendar",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: "DollarSign",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      icon: "TrendingUp",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Available Rooms",
      value: stats.availableRooms,
      icon: "Home",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Error Loading Data</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="Building2" className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  StayTrack Pro
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  Hotel Management Platform
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors duration-200 shadow-soft"
            >
              <ApperIcon 
                name={darkMode ? "Sun" : "Moon"} 
                className="w-5 h-5 text-gray-600 dark:text-gray-400" 
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Grid */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className={`${stat.bgColor} rounded-2xl p-4 sm:p-6 shadow-card hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <ApperIcon name={stat.icon} className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Feature */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <MainFeature />
        </motion.div>
      </main>
    </div>
  )
}

export default Home