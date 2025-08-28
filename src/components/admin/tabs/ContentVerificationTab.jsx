import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  Eye, 
  Check, 
  X, 
  FileText, 
  Image, 
  Video, 
  File,
  Calendar,
  User,
  MessageSquare,
  Download
} from 'lucide-react';
import { dbHelpers } from '../../../config/supabase';
import { useAuth } from '../../../contexts/AuthContext';

export const ContentVerificationTab = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [filters, setFilters] = useState({
    status: 'pending',
    type: 'all',
    search: '',
    dateRange: 'all'
  });
  const [verificationNotes, setVerificationNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [actionType, setActionType] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchContent();
  }, [filters]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await dbHelpers.getContent(filters);
      
      if (error) {
        console.error('Error fetching content:', error);
        return;
      }

      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyContent = async (contentId, status, notes = '') => {
    try {
      const { data, error } = await dbHelpers.verifyContent(contentId, status, notes, user.id);
      
      if (error) {
        console.error('Error verifying content:', error);
        return;
      }

      // Update local state
      setContent(prev => 
        prev.map(item => 
          item.id === contentId 
            ? { ...item, verification_status: status, verification_notes: notes, verified_by: user.id }
            : item
        )
      );

      // Log activity
      await dbHelpers.logActivity(
        user.id,
        'content_verified',
        `${status} content verification`,
        { content_id: contentId, status }
      );

      setShowNotesModal(false);
      setVerificationNotes('');
    } catch (error) {
      console.error('Error verifying content:', error);
    }
  };

  const openNotesModal = (contentId, action) => {
    setSelectedContent(contentId);
    setActionType(action);
    setShowNotesModal(true);
  };

  const handleNotesSubmit = () => {
    if (selectedContent && actionType) {
      handleVerifyContent(selectedContent, actionType, verificationNotes);
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) return Image;
    if (mimeType?.startsWith('video/')) return Video;
    if (mimeType?.includes('pdf')) return FileText;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredContent = content.filter(item => {
    if (filters.status !== 'all' && item.verification_status !== filters.status) return false;
    if (filters.type !== 'all' && item.content_type !== filters.type) return false;
    if (filters.search && !item.title?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !item.users?.name?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="content-verification-tab">
      <div className="tab-header">
        <div className="header-left">
          <h1 className="page-title">Content Verification</h1>
          <p className="page-subtitle">Review and verify user-uploaded content</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-value">{content.filter(c => c.verification_status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{content.filter(c => c.verification_status === 'verified').length}</span>
            <span className="stat-label">Verified</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{content.filter(c => c.verification_status === 'declined').length}</span>
            <span className="stat-label">Declined</span>
          </div>
        </div>
      </div>

      <div className="content-controls">
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search content or users..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="declined">Declined</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
            <option value="portfolio">Portfolio</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading content...</p>
        </div>
      ) : (
        <>
          {filteredContent.length > 0 ? (
            <div className="content-grid">
              {filteredContent.map((item) => (
                <ContentCard 
                  key={item.id}
                  content={item}
                  onView={() => setSelectedContent(item)}
                  onVerify={(status) => {
                    if (status === 'declined') {
                      openNotesModal(item.id, status);
                    } else {
                      handleVerifyContent(item.id, status);
                    }
                  }}
                  getFileIcon={getFileIcon}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FileText className="empty-icon" size={48} />
              <h3>No content found</h3>
              <p>No content matches your current filters.</p>
            </div>
          )}
        </>
      )}

      {/* Content Detail Modal */}
      {selectedContent && typeof selectedContent === 'object' && (
        <ContentDetailModal 
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onVerify={handleVerifyContent}
          formatFileSize={formatFileSize}
          getFileIcon={getFileIcon}
        />
      )}

      {/* Verification Notes Modal */}
      {showNotesModal && (
        <div className="modal-overlay">
          <div className="modal-container notes-modal">
            <div className="modal-header">
              <h3>Add Verification Notes</h3>
              <button onClick={() => setShowNotesModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <p>Please provide a reason for {actionType === 'declined' ? 'declining' : 'verifying'} this content:</p>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Enter your notes here..."
                rows="4"
                className="notes-textarea"
              />
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowNotesModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleNotesSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Content Card Component
const ContentCard = ({ content, onView, onVerify, getFileIcon, formatFileSize }) => {
  const FileIcon = getFileIcon(content.mime_type);
  
  return (
    <div className="content-card">
      <div className="content-preview">
        {content.content_type === 'image' ? (
          <img 
            src={content.thumbnail_url || content.file_url}
            alt={content.title}
            className="preview-image"
          />
        ) : (
          <div className="file-preview">
            <FileIcon size={48} className="file-icon" />
          </div>
        )}
        <div className="content-overlay">
          <button 
            className="preview-btn"
            onClick={onView}
            title="View details"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>
      
      <div className="content-info">
        <h4 className="content-title">{content.title || 'Untitled'}</h4>
        <p className="content-description">
          {content.description || 'No description provided'}
        </p>
        
        <div className="content-meta">
          <div className="meta-item">
            <User size={14} />
            <span>{content.users?.name}</span>
          </div>
          <div className="meta-item">
            <Calendar size={14} />
            <span>{new Date(content.uploaded_at).toLocaleDateString()}</span>
          </div>
          {content.file_size && (
            <div className="meta-item">
              <File size={14} />
              <span>{formatFileSize(content.file_size)}</span>
            </div>
          )}
        </div>
        
        <div className="content-status">
          <span className={`status-badge ${content.verification_status}`}>
            {content.verification_status}
          </span>
        </div>
      </div>

      {content.verification_status === 'pending' && (
        <div className="content-actions">
          <button 
            className="action-btn verify"
            onClick={() => onVerify('verified')}
            title="Verify content"
          >
            <Check size={16} />
            Verify
          </button>
          <button 
            className="action-btn decline"
            onClick={() => onVerify('declined')}
            title="Decline content"
          >
            <X size={16} />
            Decline
          </button>
        </div>
      )}

      {content.verification_notes && (
        <div className="verification-notes">
          <MessageSquare size={14} />
          <span>{content.verification_notes}</span>
        </div>
      )}
    </div>
  );
};

// Content Detail Modal Component
const ContentDetailModal = ({ content, onClose, onVerify, formatFileSize, getFileIcon }) => {
  const FileIcon = getFileIcon(content.mime_type);
  
  return (
    <div className="modal-overlay">
      <div className="modal-container content-detail-modal">
        <div className="modal-header">
          <h2 className="modal-title">Content Details</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="content-detail">
            <div className="detail-preview">
              {content.content_type === 'image' ? (
                <img 
                  src={content.file_url}
                  alt={content.title}
                  className="detail-image"
                />
              ) : (
                <div className="detail-file">
                  <FileIcon size={64} className="file-icon" />
                  <a 
                    href={content.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link"
                  >
                    <Download size={16} />
                    Download File
                  </a>
                </div>
              )}
            </div>
            
            <div className="detail-info">
              <h3 className="detail-title">{content.title || 'Untitled'}</h3>
              <p className="detail-description">
                {content.description || 'No description provided'}
              </p>
              
              <div className="detail-metadata">
                <div className="metadata-group">
                  <h4>Upload Information</h4>
                  <div className="metadata-item">
                    <span className="metadata-label">Uploaded by:</span>
                    <span className="metadata-value">{content.users?.name} ({content.users?.enrollment_number})</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Upload date:</span>
                    <span className="metadata-value">{new Date(content.uploaded_at).toLocaleString()}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Content type:</span>
                    <span className="metadata-value">{content.content_type}</span>
                  </div>
                  {content.file_size && (
                    <div className="metadata-item">
                      <span className="metadata-label">File size:</span>
                      <span className="metadata-value">{formatFileSize(content.file_size)}</span>
                    </div>
                  )}
                </div>
                
                <div className="metadata-group">
                  <h4>Verification Status</h4>
                  <div className="metadata-item">
                    <span className="metadata-label">Status:</span>
                    <span className={`status-badge ${content.verification_status}`}>
                      {content.verification_status}
                    </span>
                  </div>
                  {content.verification_notes && (
                    <div className="metadata-item">
                      <span className="metadata-label">Notes:</span>
                      <span className="metadata-value">{content.verification_notes}</span>
                    </div>
                  )}
                  {content.verified_at && (
                    <div className="metadata-item">
                      <span className="metadata-label">Verified at:</span>
                      <span className="metadata-value">{new Date(content.verified_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {content.verification_status === 'pending' && (
          <div className="modal-footer">
            <button 
              className="btn btn-success"
              onClick={() => {
                onVerify(content.id, 'verified');
                onClose();
              }}
            >
              <Check size={16} />
              Verify Content
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => {
                const notes = prompt('Please provide a reason for declining this content:');
                if (notes) {
                  onVerify(content.id, 'declined', notes);
                  onClose();
                }
              }}
            >
              <X size={16} />
              Decline Content
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
