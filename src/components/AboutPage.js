import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Eye, Award, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const values = [
    "Innovation in AI technology",
    "User-centric design approach", 
    "Quality and professionalism",
    "Accessibility and inclusivity",
    "Ethical AI development"
  ];

  return (
    <div className="container">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="page-title">
          <Users className="page-icon" />
          About AMTICS
        </h1>
        <p className="page-subtitle">
          Revolutionizing graphic design with artificial intelligence
        </p>
      </motion.div>
      
      <div className="content-grid">
        <motion.div 
          className="glass-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="card-header">
            <h2 className="card-title">
              <Target size={20} />
              Our Mission
            </h2>
          </div>
          <div className="card-body">
            <p>
              At AMTICS, we're dedicated to democratizing professional graphic design through 
              cutting-edge artificial intelligence. Our platform empowers creators, marketers, 
              and businesses to generate stunning visuals with intelligent prompt engineering.
            </p>
            <p>
              We believe that great design should be accessible to everyone, regardless of 
              their technical expertise or design background.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="glass-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <div className="card-header">
            <h2 className="card-title">
              <Eye size={20} />
              Our Vision
            </h2>
          </div>
          <div className="card-body">
            <p>
              To become the leading AI-powered design platform that bridges the gap between 
              creativity and technology, making professional-grade graphic design accessible 
              to everyone.
            </p>
            <p>
              We envision a future where AI amplifies human creativity rather than replacing it.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="glass-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <div className="card-header">
            <h2 className="card-title">
              <Award size={20} />
              Our Values
            </h2>
          </div>
          <div className="card-body">
            <ul className="values-list">
              {values.map((value, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <CheckCircle size={18} />
                  <span>{value}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
