import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useAmtics } from '../context/AmticsContext';

const ToastContainer = () => {
  const { toasts, actions } = useAmtics();

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'error':
        return <XCircle size={18} />;
      case 'info':
      default:
        return <Info size={18} />;
    }
  };

  const toastVariants = {
    initial: { 
      opacity: 0, 
      x: 100,
      scale: 0.8
    },
    animate: { 
      opacity: 1, 
      x: 0,
      scale: 1
    },
    exit: { 
      opacity: 0, 
      x: 100,
      scale: 0.8
    }
  };

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ 
              type: 'spring', 
              stiffness: 500, 
              damping: 30 
            }}
            layout
          >
            <div className="toast-icon">
              {getToastIcon(toast.type)}
            </div>
            <p className="toast-message">{toast.message}</p>
            <motion.button
              className="toast-close"
              onClick={() => actions.removeToast(toast.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
