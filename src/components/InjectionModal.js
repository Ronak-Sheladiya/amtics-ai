import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, X, Play, Copy } from 'lucide-react';
import { useAmtics } from '../context/AmticsContext';

const InjectionModal = () => {
  const { showModal, modalData, actions } = useAmtics();

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const handleStartInjection = () => {
    // This would trigger the actual injection logic
    actions.hideModal();
    actions.addToast({
      type: 'info',
      message: 'Starting auto-injection process...'
    });
  };

  const handleManualCopy = () => {
    actions.hideModal();
    actions.addToast({
      type: 'info',
      message: 'Prompts ready for manual copying'
    });
  };

  const steps = modalData?.steps || [
    'Open AI platform in multiple tabs',
    'Wait for each platform to fully load',
    'Copy prompts from the generated list',
    'Paste prompts into each platform\'s input field',
    'Submit prompts manually or use auto-injection'
  ];

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div 
          className="modal"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => actions.hideModal()}
        >
          <div className="modal-overlay" />
          <motion.div 
            className="modal-content glass-card"
            variants={modalVariants}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 25 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">
                <Rocket size={20} />
                Auto-Injection Instructions
              </h3>
              <motion.button 
                className="modal-close" 
                onClick={() => actions.hideModal()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>
            
            <div className="modal-body">
              <p>Follow these steps for automatic prompt injection:</p>
              <ol>
                {steps.map((step, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {step}
                  </motion.li>
                ))}
              </ol>
            </div>
            
            <div className="modal-actions">
              <motion.button 
                className="btn btn-primary" 
                onClick={handleStartInjection}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play size={18} />
                Start Auto-Injection
              </motion.button>
              <motion.button 
                className="btn btn-outline" 
                onClick={handleManualCopy}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Copy size={18} />
                Manual Copy
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InjectionModal;
