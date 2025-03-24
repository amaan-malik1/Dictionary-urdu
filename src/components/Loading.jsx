import React from 'react';
import { motion } from 'framer-motion';

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.1
    }
  },
  end: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const loadingCircleVariants = {
  start: {
    y: '0%'
  },
  end: {
    y: '100%'
  }
};

const loadingCircleTransition = {
  duration: 0.4,
  yoyo: Infinity,
  ease: 'easeInOut'
};

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        className="flex space-x-2"
        variants={loadingContainerVariants}
        initial="start"
        animate="end"
      >
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="w-4 h-4 bg-blue-500 rounded-full"
            variants={loadingCircleVariants}
            transition={loadingCircleTransition}
          />
        ))}
      </motion.div>
      
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default Loading; 