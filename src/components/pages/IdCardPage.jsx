import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Zap, User, Download, Share } from 'lucide-react';
import teamMembersData from '../../data/teamMembers.json';
import { showToast } from '../../utils/toast';

export const IdCardPage = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const foundMember = teamMembersData.teamMembers.find(m => m.id === id);
    if (foundMember) {
      setMember(foundMember);
    } else {
      setNotFound(true);
    }
  }, [id]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
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

  const downloadAsPDF = () => {
    const element = document.getElementById('standalone-id-card');
    
    import('html2canvas').then(html2canvas => {
      html2canvas.default(element, {
        width: 280,
        height: 380,
        backgroundColor: null,
        scale: 2
      }).then(canvas => {
        import('jspdf').then(({ jsPDF }) => {
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 74; // Vertical card width in mm
          const imgHeight = 100;   // Vertical card height in mm
          
          // Center the image on A4 page
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2;
          
          pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
          pdf.save(`${member.name}-ID-Card.pdf`);
          showToast('success', 'ID card downloaded as PDF! 📄');
        });
      });
    }).catch(() => {
      showToast('error', 'Download failed. Please try again.');
    });
  };

  const downloadAsPNG = () => {
    const element = document.getElementById('standalone-id-card');
    
    import('html2canvas').then(html2canvas => {
      html2canvas.default(element, {
        width: 280,
        height: 380,
        backgroundColor: null,
        scale: 2
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${member.name}-ID-Card.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('success', 'ID card downloaded as PNG! 🖼️');
      });
    }).catch(() => {
      showToast('error', 'Download failed. Please try again.');
    });
  };

  if (notFound) {
    return <Navigate to="/" replace />;
  }

  if (!member) {
    return (
      <div className="page active">
        <div className="container">
          <div className="loading-state">
            <div className="loading-animation">
              <div className="loading-spinner"></div>
            </div>
            <p className="loading-text">Loading ID card...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <div className="container">
        <div className="id-card-page">
          <div className="page-header">
            <h1 className="page-title">
              <User className="page-icon" />
              Media ID Card
            </h1>
            <p className="page-subtitle">{member.name} - {member.position}</p>
          </div>

          <div className="standalone-card-container">
            <div id="standalone-id-card" className="professional-id-card glass-card">
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
          </div>

          <div className="card-actions">
            <button className="btn btn-secondary" onClick={handleShare}>
              <Share size={18} />
              Share Card
            </button>
            <button className="btn btn-primary" onClick={downloadAsPDF}>
              <Download size={18} />
              Download PDF
            </button>
            <button className="btn btn-outline" onClick={downloadAsPNG}>
              <Download size={18} />
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
