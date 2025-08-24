import React from 'react';
import { User, Code, Github, Linkedin, Mail, MapPin, Calendar } from 'lucide-react';

export const DeveloperPage = () => {
  // Single developer information
  const developer = {
    id: "DEV-2024-001",
    name: "Alex Thompson",
    position: "Full Stack Developer",
    department: "Development Team",
    enrollmentNumber: "DEV-2024-001",
    email: "alex.thompson@amtics.com",
    phone: "+1 (555) 987-6543",
    joinDate: "2024-01-10",
    imageUrl: "/src/data/member-images/developer-avatar.svg",
    location: "San Francisco, CA",
    github: "https://github.com/alexthompson",
    linkedin: "https://linkedin.com/in/alexthompson"
  };

  return (
    <div id="developer-page" className="page active">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <Code className="page-icon" />
            Meet Our Developer
          </h1>
          <p className="page-subtitle">The technical mind behind AMTICS innovations</p>
        </div>

        <div className="developer-profile glass-card">
          <div className="developer-header">
            <div className="developer-photo-container">
              <img
                src={developer.imageUrl}
                alt={developer.name}
                className="developer-photo"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjFGNUY5Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDUiIHI9IjE4IiBmaWxsPSIjRDQwMDc1Ii8+CjxwYXRoIGQ9Ik0zMCA5MEMzMCA4MC4wNTg5IDM4LjA1ODkgNzIgNDggNzJINzJDODEuOTQxMSA3MiA5MCA4MC4wNTg5IDkwIDkwVjk3LjVIMzBWOTBaIiBmaWxsPSIjRDQwMDc1Ii8+Cjwvc3ZnPgo=';
                }}
              />
              <div className="developer-status">
                <span className="status-dot"></span>
                <span>Available</span>
              </div>
            </div>
            
            <div className="developer-info">
              <h2 className="developer-name">{developer.name}</h2>
              <p className="developer-position">{developer.position}</p>
              <p className="developer-department">{developer.department}</p>
              
              <div className="developer-meta">
                <div className="meta-item">
                  <MapPin size={16} />
                  <span>{developer.location}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>Joined {new Date(developer.joinDate).getFullYear()}</span>
                </div>
                <div className="meta-item">
                  <User size={16} />
                  <span>ID: {developer.enrollmentNumber}</span>
                </div>
              </div>

              <div className="developer-social">
                <a href={developer.github} target="_blank" rel="noopener noreferrer" className="social-link">
                  <Github size={20} />
                </a>
                <a href={developer.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                  <Linkedin size={20} />
                </a>
                <a href={`mailto:${developer.email}`} className="social-link">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
