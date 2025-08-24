import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Code2, 
  Users, 
  BookOpen, 
  Globe, 
  Zap, 
  Palette, 
  Cpu, 
  Smartphone, 
  Accessibility,
  User,
  Brain,
  Sparkles,
  Image,
  Wand2
} from 'lucide-react';

const DeveloperPage = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const techStack = [
    { icon: Globe, name: "HTML5 & CSS3" },
    { icon: Zap, name: "React & JavaScript" },
    { icon: Palette, name: "Glassmorphism Design" },
    { icon: Cpu, name: "AI Integration APIs" },
    { icon: Smartphone, name: "Responsive Design" },
    { icon: Accessibility, name: "Accessibility Standards" }
  ];

  const apiIntegrations = [
    { icon: Brain, name: "OpenAI DALL-E Integration" },
    { icon: Sparkles, name: "Google Gemini Imagen" },
    { icon: Image, name: "Adobe Firefly API" },
    { icon: Palette, name: "Canva Magic Design" },
    { icon: Wand2, name: "Midjourney Integration" }
  ];

  const skillTags = [
    "Frontend Development",
    "AI Integration", 
    "UX Design",
    "API Development",
    "React Development",
    "State Management"
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
          <Terminal className="page-icon" />
          Developer Information
        </h1>
        <p className="page-subtitle">
          Technical insights and development team
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
              <Code2 size={20} />
              Technology Stack
            </h2>
          </div>
          <div className="card-body">
            <div className="tech-stack">
              {techStack.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <motion.div 
                    key={index}
                    className="tech-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <Icon size={20} />
                    <span>{tech.name}</span>
                  </motion.div>
                );
              })}
            </div>
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
              <Users size={20} />
              Development Team
            </h2>
          </div>
          <div className="card-body">
            <div className="team-member">
              <div className="member-avatar">
                <User size={24} />
              </div>
              <div className="member-info">
                <h3>AMTICS Development Team</h3>
                <p>Full-Stack Developers & AI Specialists</p>
                <div className="member-skills">
                  {skillTags.map((skill, index) => (
                    <motion.span 
                      key={index}
                      className="skill-tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
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
              <BookOpen size={20} />
              AI Integrations
            </h2>
          </div>
          <div className="card-body">
            <p>Our platform integrates with multiple AI providers to ensure the best results:</p>
            <div className="api-list">
              {apiIntegrations.map((api, index) => {
                const Icon = api.icon;
                return (
                  <motion.div 
                    key={index}
                    className="api-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <Icon size={20} />
                    <span>{api.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperPage;
