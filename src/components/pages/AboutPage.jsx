import React from 'react';
import { Users, Target, Eye, Award, Check, Lightbulb, Heart, Globe, Zap, Shield } from 'lucide-react';

export const AboutPage = () => {
  const values = [
    { icon: Lightbulb, text: "Innovation in AI technology" },
    { icon: Users, text: "User-centric design approach" },
    { icon: Award, text: "Quality and professionalism" },
    { icon: Heart, text: "Accessibility and inclusivity" },
    { icon: Shield, text: "Ethical AI development" },
    { icon: Globe, text: "Global design standards" }
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Generation",
      description: "Advanced algorithms that understand design principles and create contextually relevant prompts for professional graphics."
    },
    {
      icon: Globe,
      title: "Multi-Platform Support",
      description: "Seamless integration with 5+ leading AI platforms including Gemini, ChatGPT, Midjourney, and more."
    },
    {
      icon: Users,
      title: "User-Friendly Interface",
      description: "Intuitive design that makes professional graphic creation accessible to users of all skill levels."
    },
    {
      icon: Award,
      title: "Professional Quality",
      description: "Every generated prompt is crafted to meet industry standards and brand consistency requirements."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Prompts Generated" },
    { number: "500+", label: "Happy Users" },
    { number: "5", label: "AI Platforms" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div id="about-page" className="page active">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <Users className="page-icon" />
            About AMTICS
          </h1>
          <p className="page-subtitle">Revolutionizing graphic design with artificial intelligence</p>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card glass-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="content-grid">
          {/* Mission */}
          <div className="glass-card">
            <div className="card-header">
              <h2 className="card-title">
                <Target size={20} />
                Our Mission
              </h2>
            </div>
            <div className="card-body">
              <p>
                At AMTICS, we're dedicated to democratizing professional graphic design through cutting-edge artificial intelligence. Our platform empowers creators, marketers, and businesses to generate stunning visuals with intelligent prompt engineering.
              </p>
              <p>
                We believe that great design should be accessible to everyone, regardless of their technical expertise or design background. Our AI-powered platform bridges the gap between creative vision and technical execution.
              </p>
            </div>
          </div>
          
          {/* Vision */}
          <div className="glass-card">
            <div className="card-header">
              <h2 className="card-title">
                <Eye size={20} />
                Our Vision
              </h2>
            </div>
            <div className="card-body">
              <p>
                To become the leading AI-powered design platform that bridges the gap between creativity and technology, making professional-grade graphic design accessible to everyone.
              </p>
              <p>
                We envision a future where AI amplifies human creativity rather than replacing it, enabling designers and non-designers alike to create exceptional visual content.
              </p>
            </div>
          </div>
          
          {/* Values */}
          <div className="glass-card">
            <div className="card-header">
              <h2 className="card-title">
                <Award size={20} />
                Our Values
              </h2>
            </div>
            <div className="card-body">
              <ul className="values-list">
                {values.map((value, index) => {
                  const IconComponent = value.icon;
                  return (
                    <li key={index}>
                      <IconComponent size={18} />
                      <span>{value.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="glass-card full-width">
            <div className="card-header">
              <h2 className="card-title">
                <Zap size={20} />
                What Makes Us Different
              </h2>
            </div>
            <div className="card-body">
              <div className="features-grid">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="feature-item">
                      <div className="feature-icon">
                        <IconComponent size={24} />
                      </div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member-card glass-card">
              <div className="member-content">
                <div className="member-image">
                  <Users size={48} />
                </div>
                <div className="member-details">
                  <h3>John Smith</h3>
                  <p className="member-position">AI Research Lead</p>
                  <p className="enrollment-number">ID: EMP-2024-001</p>
                </div>
              </div>
              <div className="card-footer">
                <div className="footer-brand">
                  <Zap size={16} />
                  <span>AMTICS Multi-Media</span>
                </div>
              </div>
            </div>

            <div className="team-member-card glass-card">
              <div className="member-content">
                <div className="member-image">
                  <Award size={48} />
                </div>
                <div className="member-details">
                  <h3>Sarah Johnson</h3>
                  <p className="member-position">Lead UX Designer</p>
                  <p className="enrollment-number">ID: EMP-2024-002</p>
                </div>
              </div>
              <div className="card-footer">
                <div className="footer-brand">
                  <Zap size={16} />
                  <span>AMTICS Multi-Media</span>
                </div>
              </div>
            </div>

            <div className="team-member-card glass-card">
              <div className="member-content">
                <div className="member-image">
                  <Globe size={48} />
                </div>
                <div className="member-details">
                  <h3>Mike Chen</h3>
                  <p className="member-position">Full-Stack Developer</p>
                  <p className="enrollment-number">ID: EMP-2024-003</p>
                </div>
              </div>
              <div className="card-footer">
                <div className="footer-brand">
                  <Zap size={16} />
                  <span>AMTICS Multi-Media</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
