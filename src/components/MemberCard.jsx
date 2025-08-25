import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, User } from 'lucide-react';

export const MemberCard = ({ member, clickable = true, standalone = false }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (clickable) {
      navigate(`/card/${member.id}`);
    }
  };

  const cardClass = standalone ? 'professional-id-card glass-card' : 'professional-id-card glass-card';
  const cardId = standalone ? 'standalone-id-card' : undefined;

  return (
    <div
      id={cardId}
      className={cardClass}
      onClick={handleCardClick}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
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
              e.target.src = member.imageUrl;
            }}
          />
          
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
        <div>
          <span className="full-amtics">Asha M. Tarsadia Institute of <br/> Computer Science and Technology</span>
        </div>
      </div>

      <div className="id-card-footer">
        <div className="footer-brand-card">
          <Zap size={14} />
          <span>AMTICS Multi-Media, UTU</span>
        </div>
      </div>
    </div>
  );
};
