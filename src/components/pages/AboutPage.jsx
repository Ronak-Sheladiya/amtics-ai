import React, { useState, useEffect } from 'react';
import { Users, Target, Eye, Award, Check, Lightbulb, Heart, Globe, Zap, Shield, User } from 'lucide-react';
import { IdCardModal } from '../IdCardModal';
import teamMembersData from '../../data/teamMembers.json';

export const AboutPage = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if there's an ID in the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = urlParams.get('id');

    if (memberId) {
      const member = teamMembersData.teamMembers.find(m => m.id === memberId);
      if (member) {
        setSelectedMember(member);
        setIsModalOpen(true);
      }
    }
  }, []);

  const handleCardClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    // Clear URL parameters
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.replaceState({}, '', url);
  };
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
          <p className="section-subtitle">Click on any ID card to view details and share</p>
          <div className="team-grid">
            {teamMembersData.teamMembers.map((member) => (
              <div
                key={member.id}
                className="professional-id-card glass-card"
                onClick={() => handleCardClick(member)}
              >
                <div className="id-card-background">
                  <div className="card-pattern"></div>
                  <div className="card-shine"></div>
                </div>

                <div className="id-card-header">
                  <div className="company-logo">
                    <Zap size={20} />
                    <span>AMTICS</span>
                  </div>
                  <div className="card-type">MEDIA ID</div>
                </div>

                <div className="id-card-content">
                  <div className="member-photo-container">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="member-photo-circle"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjFGNUY5Ii8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iMzAiIHI9IjEyIiBmaWxsPSIjRDQwMDc1Ii8+CjxwYXRoIGQ9Ik0yMCA2MEMyMCA1My4zNzI2IDI1LjM3MjYgNDggMzIgNDhINDhDNTQuNjI3NCA0OCA2MCA1My4zNzI2IDYwIDYwVjY1SDIwVjYwWiIgZmlsbD0iI0Q0MDA3NSIvPgo8L3N2Zz4K';
                      }}
                    />
                    <div className="employee-id-badge">
                      <User size={12} />
                      <span>{member.employeeId}</span>
                    </div>
                  </div>

                  <div className="member-info-card">
                    <h3 className="member-name-card">{member.name}</h3>
                    <p className="member-position-card">{member.position}</p>
                    <p className="member-department">{member.department}</p>

                    <div className="member-meta">
                      <div className="meta-item">
                        <span className="meta-label">ID:</span>
                        <span className="meta-value">{member.enrollmentNumber}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Since:</span>
                        <span className="meta-value">{new Date(member.joinDate).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="id-card-footer">
                  <div className="footer-brand-card">
                    <Zap size={14} />
                    <span>AMTICS Multi-Media</span>
                  </div>
                  <div className="card-action-hint">
                    Click to view details
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <IdCardModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};
