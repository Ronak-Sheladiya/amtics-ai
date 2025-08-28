import React, { useState } from 'react';
import { X, User, Mail, Hash, MapPin, Users, UserCog, CheckCircle } from 'lucide-react';
import { dbHelpers } from '../../../config/supabase';
import { useAuth } from '../../../contexts/AuthContext';

export const AddMemberModal = ({ isOpen, onClose, onMemberAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    enrollment_number: '',
    email: '',
    position: '',
    role: 'member',
    user_role: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // For multi-step form if needed
  
  const { user } = useAuth();

  const positions = [
    'President',
    'Vice-President',
    'Secretary',
    'Treasurer',
    'Chair',
    'Vice-Chair',
    'Coordinator',
    'Member'
  ];

  const userRoles = [
    'Web Developer',
    'Mobile Developer',
    'UI/UX Designer',
    'Graphic Designer',
    'Content Writer',
    'Marketing Specialist',
    'Data Analyst',
    'Project Manager',
    'Social Media Manager',
    'Video Editor'
  ];

  const roles = [
    { value: 'member', label: 'Member', description: 'Standard member access' },
    { value: 'moderator', label: 'Moderator', description: 'Can moderate content and manage members' },
    { value: 'admin', label: 'Administrator', description: 'Full system access' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.enrollment_number.trim()) {
      newErrors.enrollment_number = 'Enrollment number is required';
    } else if (!/^[0-9]+$/.test(formData.enrollment_number)) {
      newErrors.enrollment_number = 'Enrollment number must contain only numbers';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Generate temporary password
      const tempPassword = generateTempPassword();
      
      // Create user data
      const userData = {
        ...formData,
        temp_password: tempPassword,
        is_first_login: true,
        is_onboarded: false,
        created_by: user.id
      };

      const { data: newMember, error } = await dbHelpers.createUser(userData);
      
      if (error) {
        setErrors({ submit: error.message });
        return;
      }

      // Log activity
      await dbHelpers.logActivity(
        user.id,
        'member_created',
        `Added new member: ${formData.name}`,
        { target_user_id: newMember.id }
      );

      // Show success and temporary password
      alert(`Member created successfully!\n\nTemporary Password: ${tempPassword}\n\nPlease share this with the new member. They will need to change it on first login.`);

      onMemberAdded();
      resetForm();
    } catch (error) {
      console.error('Error creating member:', error);
      setErrors({ submit: 'Failed to create member. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      enrollment_number: '',
      email: '',
      position: '',
      role: 'member',
      user_role: '',
      status: 'active'
    });
    setErrors({});
    setStep(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container add-member-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            <User className="modal-icon" />
            Add New Member
          </h2>
          <button
            className="modal-close"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          {errors.submit && (
            <div className="error-banner">
              {errors.submit}
            </div>
          )}

          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter full name"
                  required
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="enrollment_number" className="form-label">
                  <Hash size={16} />
                  Enrollment Number *
                </label>
                <input
                  type="text"
                  id="enrollment_number"
                  name="enrollment_number"
                  value={formData.enrollment_number}
                  onChange={handleChange}
                  className={`form-input ${errors.enrollment_number ? 'error' : ''}`}
                  placeholder="Enter enrollment number"
                  required
                />
                {errors.enrollment_number && <span className="error-text">{errors.enrollment_number}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter email address"
                  required
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            {/* Role Information */}
            <div className="form-section">
              <h3 className="section-title">Role & Position</h3>
              
              <div className="form-group">
                <label htmlFor="position" className="form-label">
                  <MapPin size={16} />
                  Position
                </label>
                <select
                  id="position"
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
              </div>

              <div className="form-group">
                <label htmlFor="user_role" className="form-label">
                  <UserCog size={16} />
                  Specialization/Role
                </label>
                <select
                  id="user_role"
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
              </div>

              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  <Users size={16} />
                  System Role *
                </label>
                <div className="role-options">
                  {roles.map((role) => (
                    <label key={role.value} className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={handleChange}
                        className="role-radio"
                      />
                      <div className="role-content">
                        <div className="role-label">{role.label}</div>
                        <div className="role-description">{role.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  <CheckCircle size={16} />
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="active">Active</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="button-loading">
                  <div className="spinner-small"></div>
                  Creating...
                </div>
              ) : (
                <>
                  <User size={16} />
                  Create Member
                </>
              )}
            </button>
          </div>
        </form>

        <div className="modal-note">
          <p>
            <strong>Note:</strong> A temporary password will be generated for the new member. 
            Make sure to share it with them securely. They will be required to change it on first login.
          </p>
        </div>
      </div>
    </div>
  );
};
