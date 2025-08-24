import React from 'react';
import { X, Share, Download, Mail, Phone, MapPin, Calendar, User, Zap } from 'lucide-react';
import { showToast } from '../utils/toast';

export const IdCardModal = ({ member, isOpen, onClose }) => {
  if (!isOpen || !member) return null;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${member.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('success', 'ID card link copied to clipboard! 🔗');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('success', 'ID card link copied to clipboard! 🔗');
    }
  };

  const handleDownload = () => {
    // This will generate and download a PDF version of the ID card
    const element = document.getElementById('id-card-content');
    
    // For now, we'll create a simple HTML version that can be printed
    const printWindow = window.open('', '_blank');
    const cardHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AMTICS Employee ID - ${member.name}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { 
            font-family: 'Inter', Arial, sans-serif; 
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
            margin: 0; 
            padding: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .id-card {
            width: 400px;
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            border: 2px solid #e2e8f0;
          }
          .card-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f5f9;
          }
          .company-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            font-size: 24px;
            font-weight: 700;
            color: #d40075;
            margin-bottom: 10px;
          }
          .card-title {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
          }
          .member-photo {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #d40075;
            margin: 0 auto 20px;
            display: block;
          }
          .member-name {
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            text-align: center;
            margin-bottom: 8px;
          }
          .member-position {
            font-size: 16px;
            color: #d40075;
            text-align: center;
            font-weight: 600;
            margin-bottom: 20px;
          }
          .details-grid {
            display: grid;
            gap: 15px;
          }
          .detail-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            border-bottom: 1px solid #f1f5f9;
          }
          .detail-item:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #475569;
            min-width: 100px;
          }
          .detail-value {
            color: #1e293b;
          }
          .skills-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #f1f5f9;
          }
          .skills-title {
            font-weight: 600;
            color: #475569;
            margin-bottom: 10px;
          }
          .skills-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .skill-tag {
            background: #f1f5f9;
            color: #475569;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }
          .card-footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #f1f5f9;
            font-size: 12px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="id-card">
          <div class="card-header">
            <div class="company-logo">
              <span>⚡</span>
              <span>AMTICS Multi-Media</span>
            </div>
            <div class="card-title">Employee Identification Card</div>
          </div>
          
          <img src="${member.imageUrl}" alt="${member.name}" class="member-photo" />
          
          <div class="member-name">${member.name}</div>
          <div class="member-position">${member.position}</div>
          
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">ID:</span>
              <span class="detail-value">${member.employeeId}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Department:</span>
              <span class="detail-value">${member.department}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${member.email}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${member.phone}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Location:</span>
              <span class="detail-value">${member.location}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Join Date:</span>
              <span class="detail-value">${new Date(member.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div class="skills-section">
            <div class="skills-title">Skills & Expertise</div>
            <div class="skills-tags">
              ${member.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
          
          <div class="card-footer">
            Generated on ${new Date().toLocaleDateString()} | AMTICS Multi-Media
          </div>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(cardHtml);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      showToast('success', 'ID card ready for download! 📄');
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content id-card-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div id="id-card-content" className="id-card-content">
          <div className="id-card-header">
            <div className="company-brand">
              <Zap size={24} />
              <span>AMTICS Multi-Media</span>
            </div>
            <h3>Employee Identification Card</h3>
          </div>
          
          <div className="id-card-body">
            <div className="member-photo-section">
              <img 
                src={member.imageUrl} 
                alt={member.name}
                className="member-photo"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjFGNUY5Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjE2IiBmaWxsPSIjRDQwMDc1Ii8+CjxwYXRoIGQ9Ik0zMCA4MEMzMCA3MS43MTU3IDM2LjcxNTcgNjUgNDUgNjVINzVDODMuMjg0MyA2NSA5MCA3MS43MTU3IDkwIDgwVjkwSDMwVjgwWiIgZmlsbD0iI0Q0MDA3NSIvPgo8L3N2Zz4K';
                }}
              />
              <div className="id-badge">
                <User size={16} />
                <span>{member.employeeId}</span>
              </div>
            </div>
            
            <div className="member-details">
              <h2 className="member-name">{member.name}</h2>
              <p className="member-position">{member.position}</p>
              <p className="member-department">{member.department}</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <Mail size={16} />
                  <span>{member.email}</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>{member.phone}</span>
                </div>
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>{member.location}</span>
                </div>
                <div className="contact-item">
                  <Calendar size={16} />
                  <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="skills-section">
                <h4>Skills & Expertise</h4>
                <div className="skills-tags">
                  {member.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="id-card-footer">
            <div className="enrollment-info">
              <span>ID: {member.enrollmentNumber}</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleShare}>
            <Share size={18} />
            Share Card
          </button>
          <button className="btn btn-primary" onClick={handleDownload}>
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
