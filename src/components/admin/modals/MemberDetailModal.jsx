import React, { useState, useEffect } from 'react';
import { X, User, Mail, Hash, MapPin, Users, UserCog, Edit, Eye, Save, Calendar } from 'lucide-react';
import { dbHelpers } from '../../../config/supabase';
import { useAuth } from '../../../contexts/AuthContext';

export const MemberDetailModal = ({ member, onClose, onMemberUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { user } = useAuth();

  useEffect(() => {
    if (member) {
      const data = {
        name: member.name || '',
        enrollment_number: member.enrollment_number || '',
        email: member.email || '',
        position: member.position || '',
        role: member.role || 'member',
        user_role: member.user_role || '',
        status: member.status || 'active',
        bio: member.bio || ''
      };
      setFormData(data);
      setOriginalData(data);
      setIsEditing(member.mode === 'edit');
    }
  }, [member]);

  const positions = [
    'President', 'Vice-President', 'Secretary', 'Treasurer',
    'Chair', 'Vice-Chair', 'Coordinator', 'Member'
  ];

  const userRoles = [
    'Web Developer', 'Mobile Developer', 'UI/UX Designer',
    'Graphic Designer', 'Content Writer', 'Marketing Specialist',
    'Data Analyst', 'Project Manager', 'Social Media Manager', 'Video Editor'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.enrollment_number?.trim()) {
      newErrors.enrollment_number = 'Enrollment number is required';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data: updatedMember, error } = await dbHelpers.updateUser(member.id, formData);
      
      if (error) {
        setErrors({ submit: error.message });
        return;
      }

      // Log activity
      await dbHelpers.logActivity(
        user.id,
        'member_updated',
        `Updated member: ${formData.name}`,
        { target_user_id: member.id }
      );

      onMemberUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating member:', error);
      setErrors({ submit: 'Failed to update member. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!member) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container member-detail-modal">
        <div className="modal-header">
          <div className="header-left">
            <h2 className="modal-title">
              {isEditing ? <Edit className="modal-icon" /> : <Eye className="modal-icon" />}
              {isEditing ? 'Edit Member' : 'Member Details'}
            </h2>
          </div>
          <div className="header-actions">
            {!isEditing && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={16} />
                Edit
              </button>
            )}
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-content">
          {errors.submit && (
            <div className="error-banner">
              {errors.submit}
            </div>
          )}

          <div className="member-profile">
            <div className="profile-header">
              <div className="member-avatar-large">
                {member.profile_image_url ? (
                  <img
                    src={member.profile_image_url}
                    alt={member.name}
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h3 className="member-name">{member.name}</h3>
                <div className="member-badges">
                  <span className={`role-badge ${member.role}`}>
                    {member.role}
                  </span>
                  <span className={`status-badge ${member.status}`}>
                    {member.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-details">
              <div className="details-grid">
                {/* Basic Information Section */}
                <div className="detail-section">
                  <h4 className="section-title">Basic Information</h4>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                      />
                    ) : (
                      <p className="form-value">{member.name}</p>
                    )}
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Hash size={16} />
                      Enrollment Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="enrollment_number"
                        value={formData.enrollment_number}
                        onChange={handleChange}
                        className={`form-input ${errors.enrollment_number ? 'error' : ''}`}
                      />
                    ) : (
                      <p className="form-value">{member.enrollment_number}</p>
                    )}
                    {errors.enrollment_number && <span className="error-text">{errors.enrollment_number}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Mail size={16} />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                      />
                    ) : (
                      <p className="form-value">{member.email}</p>
                    )}
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                {/* Role Information Section */}
                <div className="detail-section">
                  <h4 className="section-title">Role & Position</h4>
                  
                  <div className="form-group">
                    <label className="form-label">
                      <MapPin size={16} />
                      Position
                    </label>
                    {isEditing ? (
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select position</option>
                        {positions.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="form-value">{member.position || 'Not specified'}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <UserCog size={16} />
                      Specialization
                    </label>
                    {isEditing ? (
                      <select
                        name="user_role"
                        value={formData.user_role}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select specialization</option>
                        {userRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="form-value">{member.user_role || 'Not specified'}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Users size={16} />
                      System Role
                    </label>
                    {isEditing ? (
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="member">Member</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Administrator</option>
                      </select>
                    ) : (
                      <p className="form-value">{member.role}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Status
                    </label>
                    {isEditing ? (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="active">Active</option>
                        <option value="retired">Retired</option>
                      </select>
                    ) : (
                      <p className="form-value">{member.status}</p>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                <div className="detail-section full-width">
                  <h4 className="section-title">Bio</h4>
                  <div className="form-group">
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="form-textarea"
                        rows="4"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="form-value bio-text">
                        {member.bio || 'No bio provided'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Activity Information */}
                <div className="detail-section full-width">
                  <h4 className="section-title">Account Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <Calendar size={16} />
                      <div>
                        <div className="info-label">Member Since</div>
                        <div className="info-value">{formatDate(member.created_at)}</div>
                      </div>
                    </div>
                    <div className="info-item">
                      <Calendar size={16} />
                      <div>
                        <div className="info-label">Last Login</div>
                        <div className="info-value">{formatDate(member.last_login)}</div>
                      </div>
                    </div>
                    <div className="info-item">
                      <User size={16} />
                      <div>
                        <div className="info-label">Created By</div>
                        <div className="info-value">{member.created_by ? 'Admin' : 'System'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {isEditing ? (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <div className="button-loading">
                    <div className="spinner-small"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
