import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Crown, Camera, Video, Edit, PenTool, Zap, User } from 'lucide-react';
import teamMembersData from '../../data/teamMembers.json';

export const OurTeamPage = () => {
  const navigate = useNavigate();

  const handleCardClick = (member) => {
    navigate(`/card/${member.id}`);
  };

  const sections = [
    {
      id: 'body',
      title: 'Board',
      icon: Crown,
      description: 'Our board members guiding the organization',
      color: 'var(--amtics-magenta)'
    },
    {
      id: 'graphic-design',
      title: 'Graphic Design',
      icon: PenTool,
      description: 'Creative minds crafting visual excellence',
      color: 'var(--amtics-blue)'
    },
    {
      id: 'photography',
      title: 'Photography',
      icon: Camera,
      description: 'Capturing moments with artistic vision',
      color: 'var(--amtics-green)'
    },
    {
      id: 'videography',
      title: 'Videography',
      icon: Video,
      description: 'Bringing stories to life through motion',
      color: 'var(--amtics-orange)'
    },
    {
      id: 'video-editing',
      title: 'Video Editing',
      icon: Edit,
      description: 'Crafting seamless visual narratives',
      color: 'var(--amtics-purple)'
    },
    {
      id: 'writing',
      title: 'Writing',
      icon: PenTool,
      description: 'Telling compelling stories through words',
      color: 'var(--amtics-cyan)'
    }
  ];

  const getMembersBySection = (sectionId) => {
    return teamMembersData.teamMembers.filter(member => member.section === sectionId);
  };

  const renderMemberCard = (member) => (
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
            <span>{member.enrollmentNumber}</span>
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
      </div>
    </div>
  );

  return (
    <div id="our-team-page" className="page active">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <Users className="page-icon" />
            Our Team
          </h1>
          <p className="page-subtitle">Meet the talented individuals who make AMTICS possible</p>
        </div>

        {sections.map((section) => {
          const sectionMembers = getMembersBySection(section.id);
          const IconComponent = section.icon;
          
          if (sectionMembers.length === 0) return null;

          return (
            <div key={section.id} className="team-section">
              <div className="section-header">
                <h2 className="section-title" style={{ color: section.color }}>
                  <IconComponent size={24} />
                  {section.title}
                </h2>
                <p className="section-description">{section.description}</p>
              </div>
              
              <div className="team-grid">
                {sectionMembers.map(renderMemberCard)}
              </div>
            </div>
          );
        })}

        {/* Action call */}
        <div className="team-actions glass-card">
          <h3>Want to Join Our Team?</h3>
          <p>We're always looking for talented individuals to join our mission of revolutionizing graphic design with AI.</p>
          <div className="action-buttons">
            <button className="btn btn-primary">
              View Open Positions
            </button>
            <button className="btn btn-secondary">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
