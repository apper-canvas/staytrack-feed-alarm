import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 sm:p-12 max-w-md mx-4"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl"
        >
          <ApperIcon name="MapPin" className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-4"
        >
          404
        </motion.h1>
        
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-4"
        >
          Room Not Found
        </motion.h2>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 dark:text-gray-300 mb-8 text-base sm:text-lg leading-relaxed"
        >
          The page you're looking for seems to have checked out. Let's get you back to the lobby.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 shadow-card"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span className="text-base sm:text-lg">Return to Dashboard</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound