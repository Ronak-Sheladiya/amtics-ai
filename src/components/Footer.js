import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Navigation, 
  Home, 
  Info, 
  Code, 
  Mail, 
  Globe, 
  Phone,
  Tools,
  Brain,
  Sparkles,
  Image,
  Palette,
  Github,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';

const Footer = ({ currentPage, onNavigate }) => {
  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'developer', label: 'Developer', icon: Code }
  ];

  const contactInfo = [
    { icon: Globe, text: 'www.amtics.com' },
    { icon: Mail, text: 'contact@amtics.com' },
    { icon: Phone, text: '+1 (555) 123-4567' }
  ];

  const platforms = [
    { icon: Brain, name: 'OpenAI DALL-E' },
    { icon: Sparkles, name: 'Google Gemini' },
    { icon: Image, name: 'Adobe Firefly' },
    { icon: Palette, name: 'Canva Magic' }
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="footer-brand">
              <Zap className="footer-brand-icon" />
              <span className="footer-brand-text">AMTICS</span>
            </div>
            <p className="footer-description">
              Revolutionizing graphic design with AI technology. Create professional 
              visuals with intelligent prompt generation and advanced design automation.
            </p>
            <div className="footer-social">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="social-link"
                    title={social.label}
                    whileHover={{ y: -2, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
          
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="footer-title">
              <Navigation size={18} />
              Quick Links
            </h3>
            <div className="footer-links">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    className={`footer-link ${currentPage === link.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.id);
                    }}
                    whileHover={{ x: 4 }}
                  >
                    <Icon size={16} />
                    <span>{link.label}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
          
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="footer-title">
              <Mail size={18} />
              Contact Info
            </h3>
            <div className="footer-contact">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div key={index} className="contact-item">
                    <Icon size={16} />
                    <span>{contact.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
          
          <motion.div 
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="footer-title">
              <Tools size={18} />
              AI Platforms
            </h3>
            <div className="footer-platforms">
              {platforms.map((platform, index) => {
                const Icon = platform.icon;
                return (
                  <div key={index} className="platform-item">
                    <Icon size={16} />
                    <span>{platform.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="footer-copyright">
            <p>&copy; 2024 AMTICS. All rights reserved. Powered by AI technology.</p>
          </div>
          <div className="footer-legal">
            {legalLinks.map((link, index) => (
              <a key={index} href={link.href} className="legal-link">
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
