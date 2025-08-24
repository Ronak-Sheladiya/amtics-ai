import React from 'react';
import { X, Share, Download, Mail, Phone, MapPin, Calendar, User, Zap } from 'lucide-react';
import { showToast } from '../utils/toast';

export const IdCardModal = ({ member, isOpen, onClose }) => {
  if (!isOpen || !member) return null;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/card/${member.id}`;

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
    // Create a canvas from the complete ID card element including header and footer
    const element = document.getElementById('id-card-content');

    // Use html2canvas to capture the element
    import('html2canvas').then(html2canvas => {
      html2canvas.default(element, {
        width: 324,
        height: 204,
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        allowTaint: true
      }).then(canvas => {
        // Create PDF using jsPDF
        import('jspdf').then(({ jsPDF }) => {
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 85.6; // Exact credit card width in mm
          const imgHeight = 54;   // Exact credit card height in mm

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
    const element = document.getElementById('id-card-content');

    import('html2canvas').then(html2canvas => {
      html2canvas.default(element, {
        width: 324,
        height: 204,
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        allowTaint: true
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content id-card-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div id="id-card-content" className="modal-card-replica">
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
        
        <div className="modal-actions">
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
  );
};
