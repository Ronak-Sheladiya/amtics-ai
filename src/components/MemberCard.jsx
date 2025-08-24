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
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjFGNUY5Ii8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iMzAiIHI9IjEyIiBmaWxsPSIjRDQwMDc1Ii8+CjxwYXRoIGQ9Ik0yMCA2MEMyMCA1My4zNzI2IDI1LjM3MjYgNDggMzIgNDhINDhDNTQuNjI3NCA0OCA2MCA1My4zNzI2IDYwIDYwVjY1SDIwVjYwWiIgZmlsbD0iI0Q0MDA3NSIvPgo8L3N2Zz4K';
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
