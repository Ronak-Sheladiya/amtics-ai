import React from 'react';
import { motion } from 'framer-motion';

const BackgroundElements = () => {
  return (
    <>
      <div className="bg-gradient" />
      <div className="bg-shapes">
        <motion.div 
          className="shape shape-1"
          animate={{
            transform: [
              "translate(0, 0) rotate(0deg)",
              "translate(30px, -30px) rotate(120deg)",
              "translate(-20px, 20px) rotate(240deg)",
              "translate(0, 0) rotate(360deg)"
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="shape shape-2"
          animate={{
            transform: [
              "translate(0, 0) rotate(0deg)",
              "translate(30px, -30px) rotate(120deg)",
              "translate(-20px, 20px) rotate(240deg)",
              "translate(0, 0) rotate(360deg)"
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: -7
          }}
        />
        <motion.div 
          className="shape shape-3"
          animate={{
            transform: [
              "translate(-50%, -50%) rotate(0deg)",
              "translate(-20px, -80px) rotate(120deg)",
              "translate(-80px, -20px) rotate(240deg)",
              "translate(-50%, -50%) rotate(360deg)"
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: -14
          }}
        />
      </div>
    </>
  );
};

export default BackgroundElements;
