import React from 'react';
import { Users, Crown, Camera, Video, Edit, PenTool } from 'lucide-react';
import teamMembersData from '../../data/teamMembers.json';
import { MemberCard } from '../MemberCard';

export const OurTeamPage = () => {

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

  return (
    <div id="our-team-page" className="page active">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <Users className="page-icon" />
            Our Team
          </h1>
          <p className="page-subtitle">Meet the talented individuals who make AMTICS Media possible</p>
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
                {sectionMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Action call */}
        <div className="team-actions glass-card">
          <h3>Want to Join Our Team?</h3>
          <p>We're always looking for talented individuals to join our mission of providing exceptional multimedia services.</p>
          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={() => window.open('mailto:22amtics221@gmail.com?subject=Application for joining in AMTICS multi-media team', '_blank')}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
