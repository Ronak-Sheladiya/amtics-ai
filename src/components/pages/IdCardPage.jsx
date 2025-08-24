import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { User, Download, Share, Zap } from 'lucide-react';
import teamMembersData from '../../data/teamMembers.json';
import { showToast } from '../../utils/toast';
import { MemberCard } from '../MemberCard';

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
            <MemberCard member={member} clickable={false} standalone={true} />
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
