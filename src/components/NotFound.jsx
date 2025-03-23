import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * NotFound Component
 * Displays a 404 error page with navigation options
 */
function NotFound() {
    return (
        <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary">
                Go Back Home
            </Link>
        </motion.div>
    )
}

export default NotFound