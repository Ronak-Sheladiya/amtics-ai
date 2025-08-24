import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Navigation, Mail, Globe, Facebook, Linkedin, Instagram, Phone, Users, Code } from 'lucide-react';

export const Footer = () => {
  const quickLinks = [
    { path: '/', label: 'Home', icon: Navigation },
    { path: '/about', label: 'About Us', icon: Mail },
    { path: '/team', label: 'Our Team', icon: Users },
    { path: '/developer', label: 'Developer', icon: Code }
  ];

  const platforms = [
    { icon: "🧠", name: "OpenAI DALL-E" },
    { icon: "✨", name: "Google Gemini" },
    { icon: "🖼️", name: "Adobe Firefly" },
    { icon: "🎨", name: "Canva Magic" }
  ];

  const socialLinks = [
    { icon: Globe, href: "#", title: "Website" },
    { icon: Facebook, href: "#", title: "Facebook" },
    { icon: Linkedin, href: "#", title: "LinkedIn" },
    { icon: Instagram, href: "#", title: "Instagram" }
  ];

  const legalLinks = [];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <Zap className="footer-brand-icon" />
              <span className="footer-brand-text">AMTICS</span>
            </div>
            <p className="footer-description">
              Revolutionizing graphic design with AI technology. Create professional visuals with intelligent prompt generation and advanced design automation.
            </p>
            <div className="footer-social">
              {socialLinks.map(({ icon: Icon, href, title }, index) => (
                <a key={index} href={href} className="social-link" title={title}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">
              <Navigation size={18} />
              Quick Links
            </h3>
            <div className="footer-links">
              {quickLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className="footer-link"
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">
              <Mail size={18} />
              Contact Info
            </h3>
            <div className="footer-contact">
              <div className="contact-item">
                <Globe size={16} />
                <span>www.amtics.com</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>22amtics221@gmail.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
          
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 AMTICS. All rights reserved.</p>
          </div>
          <div className="footer-legal">
            {legalLinks.map((link, index) => (
              <a key={index} href={link.href} className="legal-link">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
