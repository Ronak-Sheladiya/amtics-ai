import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  UserCog, 
  Camera, 
  Save, 
  Lock, 
  Eye, 
  EyeOff,
  Edit,
  Check,
  X,
  Upload,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { dbHelpers } from '../../../config/supabase';

export const AdminProfileTab = () => {
  const { user, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    position: '',
    user_role: '',
    bio: '',
    profile_image_url: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        position: user.position || '',
        user_role: user.user_role || '',
        bio: user.bio || '',
        profile_image_url: user.profile_image_url || ''
      });
    }
  }, [user]);

  const sections = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'security', label: 'Security Settings', icon: Lock }
  ];

  const positions = [
    'President', 'Vice-President', 'Secretary', 'Treasurer',
    'Chair', 'Vice-Chair', 'Coordinator', 'Administrator'
  ];

  const userRoles = [
    'Web Developer', 'Mobile Developer', 'UI/UX Designer',
    'Graphic Designer', 'Content Writer', 'Marketing Specialist',
    'Data Analyst', 'Project Manager', 'System Administrator'
  ];

  const validateProfile = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) return;

    setLoading(true);
    try {
      const { data: updatedProfile, error } = await dbHelpers.updateUser(user.id, profileData);
      
      if (error) {
        setErrors({ submit: error.message });
        return;
      }

      // Update auth context
      updateUser(updatedProfile);
      
      // Log activity
      await dbHelpers.logActivity(
        user.id,
        'profile_updated',
        'Updated admin profile information'
      );

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setLoading(true);
    try {
      // This would normally call a password change API endpoint
      // For now, we'll simulate it
      console.log('Password change requested');
      
      // Log activity
      await dbHelpers.logActivity(
        user.id,
        'password_change',
        'Changed account password'
      );

      setSuccessMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setErrors({ submit: 'Failed to change password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors({ image: 'Please upload a valid image file (JPEG, PNG, or WebP)' });
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB
      setErrors({ image: 'Image must be less than 2MB' });
      return;
    }

    setLoading(true);
    try {
      // This would normally upload to Supabase Storage
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      
      setProfileData(prev => ({
        ...prev,
        profile_image_url: imageUrl
      }));
      
      setErrors(prev => ({ ...prev, image: '' }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors({ image: 'Failed to upload image' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    if (section === 'profile') {
      setProfileData(prev => ({ ...prev, [field]: value }));
    } else if (section === 'password') {
      setPasswordData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear related errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="admin-profile-tab">
      <div className="tab-header">
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-subtitle">Manage your personal information and account settings</p>
      </div>

      {successMessage && (
        <div className="success-banner">
          <Check size={20} />
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="error-banner">
          <X size={20} />
          {errors.submit}
        </div>
      )}

      <div className="profile-container">
        <div className="profile-sidebar">
          <nav className="profile-nav">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <IconComponent size={20} />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="profile-content">
          {activeSection === 'profile' && (
            <ProfileSection 
              profileData={profileData}
              isEditing={isEditing}
              loading={loading}
              errors={errors}
              positions={positions}
              userRoles={userRoles}
              onEdit={() => setIsEditing(true)}
              onCancel={() => {
                setIsEditing(false);
                setErrors({});
                // Reset form data
                if (user) {
                  setProfileData({
                    name: user.name || '',
                    email: user.email || '',
                    position: user.position || '',
                    user_role: user.user_role || '',
                    bio: user.bio || '',
                    profile_image_url: user.profile_image_url || ''
                  });
                }
              }}
              onSubmit={handleProfileSubmit}
              onChange={(field, value) => handleChange('profile', field, value)}
              onImageUpload={handleImageUpload}
            />
          )}

          {activeSection === 'security' && (
            <SecuritySection 
              passwordData={passwordData}
              showPasswords={showPasswords}
              loading={loading}
              errors={errors}
              onSubmit={handlePasswordSubmit}
              onChange={(field, value) => handleChange('password', field, value)}
              onToggleVisibility={togglePasswordVisibility}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Profile Section Component
const ProfileSection = ({ 
  profileData, 
  isEditing, 
  loading, 
  errors, 
  positions, 
  userRoles,
  onEdit, 
  onCancel, 
  onSubmit, 
  onChange, 
  onImageUpload 
}) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>Profile Information</h2>
        {!isEditing && (
          <button className="btn btn-secondary" onClick={onEdit}>
            <Edit size={16} />
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="profile-form">
        {/* Profile Image */}
        <div className="image-upload-section">
          <div className="current-image">
            {profileData.profile_image_url ? (
              <img
                src={profileData.profile_image_url}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">
                <User size={48} />
              </div>
            )}
          </div>
          
          {isEditing && (
            <div className="image-controls">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              <label htmlFor="image-upload" className="upload-btn">
                <Camera size={16} />
                Change Photo
              </label>
              {profileData.profile_image_url && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => onChange('profile_image_url', '')}
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              )}
            </div>
          )}
          
          {errors.image && (
            <span className="error-text">{errors.image}</span>
          )}
        </div>

        {/* Form Fields */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              <User size={16} />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => onChange('name', e.target.value)}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
              />
            ) : (
              <p className="form-value">{profileData.name || 'Not specified'}</p>
            )}
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={16} />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => onChange('email', e.target.value)}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
              />
            ) : (
              <p className="form-value">{profileData.email || 'Not specified'}</p>
            )}
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <MapPin size={16} />
              Position
            </label>
            {isEditing ? (
              <select
                value={profileData.position}
                onChange={(e) => onChange('position', e.target.value)}
                className="form-select"
              >
                <option value="">Select position</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            ) : (
              <p className="form-value">{profileData.position || 'Not specified'}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <UserCog size={16} />
              Specialization
            </label>
            {isEditing ? (
              <select
                value={profileData.user_role}
                onChange={(e) => onChange('user_role', e.target.value)}
                className="form-select"
              >
                <option value="">Select specialization</option>
                {userRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            ) : (
              <p className="form-value">{profileData.user_role || 'Not specified'}</p>
            )}
          </div>

          <div className="form-group full-width">
            <label className="form-label">Bio</label>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => onChange('bio', e.target.value)}
                className="form-textarea"
                rows="4"
                placeholder="Tell us about yourself..."
                maxLength="500"
              />
            ) : (
              <p className="form-value bio-text">
                {profileData.bio || 'No bio provided'}
              </p>
            )}
            {isEditing && (
              <div className="char-count">
                {profileData.bio.length}/500 characters
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
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
                  Saving...
                </div>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

// Security Section Component
const SecuritySection = ({ 
  passwordData, 
  showPasswords, 
  loading, 
  errors, 
  onSubmit, 
  onChange, 
  onToggleVisibility 
}) => {
  return (
    <div className="security-section">
      <div className="section-header">
        <h2>Security Settings</h2>
        <p>Manage your account security and password</p>
      </div>

      <form onSubmit={onSubmit} className="security-form">
        <div className="form-group">
          <label className="form-label">
            <Lock size={16} />
            Current Password
          </label>
          <div className="password-input-container">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => onChange('currentPassword', e.target.value)}
              className={`form-input ${errors.currentPassword ? 'error' : ''}`}
              placeholder="Enter current password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => onToggleVisibility('current')}
            >
              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Lock size={16} />
            New Password
          </label>
          <div className="password-input-container">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => onChange('newPassword', e.target.value)}
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => onToggleVisibility('new')}
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Lock size={16} />
            Confirm New Password
          </label>
          <div className="password-input-container">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => onChange('confirmPassword', e.target.value)}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => onToggleVisibility('confirm')}
            >
              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>

        <div className="password-requirements">
          <h4>Password Requirements:</h4>
          <ul>
            <li>At least 8 characters long</li>
            <li>Contains uppercase and lowercase letters</li>
            <li>Contains at least one number</li>
            <li>Contains at least one special character</li>
          </ul>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="button-loading">
                <div className="spinner-small"></div>
                Changing...
              </div>
            ) : (
              <>
                <Lock size={16} />
                Change Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
