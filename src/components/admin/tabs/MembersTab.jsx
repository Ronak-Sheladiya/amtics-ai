import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  UserPlus,
  Download,
  Upload
} from 'lucide-react';
import { dbHelpers } from '../../../config/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { AddMemberModal } from '../modals/AddMemberModal';
import { MemberDetailModal } from '../modals/MemberDetailModal';

export const MembersTab = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchMembers();
  }, [filters, pagination.page]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await dbHelpers.getUsers({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (error) {
        console.error('Error fetching members:', error);
        return;
      }

      setMembers(data || []);
      // In a real implementation, you'd get the total count from the API
      setPagination(prev => ({ ...prev, total: data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (memberId, newStatus) => {
    try {
      const { data, error } = await dbHelpers.updateUser(memberId, { status: newStatus });
      
      if (error) {
        console.error('Error updating status:', error);
        return;
      }

      // Update local state
      setMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, status: newStatus } : member
        )
      );

      // Log activity
      await dbHelpers.logActivity(
        user.id,
        'member_status_update',
        `Changed member status to ${newStatus}`,
        { target_user_id: memberId }
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (memberId) => {
    const member = members.find(m => m.id === memberId);
    
    if (!window.confirm(`Are you sure you want to delete ${member?.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await dbHelpers.deleteUser(memberId);
      
      if (error) {
        console.error('Error deleting member:', error);
        return;
      }

      // Update local state
      setMembers(prev => prev.filter(member => member.id !== memberId));

      // Log activity
      await dbHelpers.logActivity(
        user.id,
        'member_deleted',
        `Deleted member: ${member?.name}`,
        { target_user_id: memberId }
      );
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const filteredMembers = members.filter(member => {
    if (filters.status !== 'all' && member.status !== filters.status) return false;
    if (filters.role !== 'all' && member.role !== filters.role) return false;
    if (filters.search && !member.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !member.email.toLowerCase().includes(filters.search.toLowerCase()) &&
        !member.enrollment_number.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="members-tab">
      <div className="tab-header">
        <div className="header-left">
          <h1 className="page-title">Members Management</h1>
          <p className="page-subtitle">Manage team members and their roles</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => console.log('Export members')}
          >
            <Download size={16} />
            Export
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            Add Member
          </button>
        </div>
      </div>

      <div className="members-controls">
        <div className="controls-left">
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search members..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="retired">Retired</option>
            </select>

            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="member">Member</option>
            </select>
          </div>
        </div>

        <div className="controls-right">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              <List size={16} />
            </button>
            <button
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card view"
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading members...</p>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <MembersTable 
              members={filteredMembers}
              onEdit={(member) => setSelectedMember({ ...member, mode: 'edit' })}
              onView={(member) => setSelectedMember({ ...member, mode: 'view' })}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <MembersCards 
              members={filteredMembers}
              onEdit={(member) => setSelectedMember({ ...member, mode: 'edit' })}
              onView={(member) => setSelectedMember({ ...member, mode: 'view' })}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )}

          {filteredMembers.length === 0 && !loading && (
            <div className="empty-state">
              <UserPlus className="empty-icon" size={48} />
              <h3>No members found</h3>
              <p>Try adjusting your search or filters, or add a new member.</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={16} />
                Add First Member
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <AddMemberModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onMemberAdded={() => {
          setShowAddModal(false);
          fetchMembers();
        }}
      />

      <MemberDetailModal 
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onMemberUpdated={() => {
          setSelectedMember(null);
          fetchMembers();
        }}
      />
    </div>
  );
};

// Members Table Component
const MembersTable = ({ members, onEdit, onView, onDelete, onStatusChange }) => {
  return (
    <div className="table-container">
      <table className="members-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Enrollment No.</th>
            <th>Email</th>
            <th>Position</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>
                <div className="member-info">
                  <div className="member-avatar">
                    {member.profile_image_url ? (
                      <img
                        src={member.profile_image_url}
                        alt={member.name}
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="member-details">
                    <div className="member-name">{member.name}</div>
                    <div className="member-specialization">{member.user_role}</div>
                  </div>
                </div>
              </td>
              <td className="enrollment-number">{member.enrollment_number}</td>
              <td className="email">{member.email}</td>
              <td className="position">{member.position}</td>
              <td>
                <span className={`role-badge ${member.role}`}>
                  {member.role}
                </span>
              </td>
              <td>
                <StatusToggle 
                  status={member.status}
                  onChange={(status) => onStatusChange(member.id, status)}
                />
              </td>
              <td className="last-login">
                {member.last_login ? 
                  new Date(member.last_login).toLocaleDateString() : 
                  'Never'
                }
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="action-btn view"
                    onClick={() => onView(member)}
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="action-btn edit"
                    onClick={() => onEdit(member)}
                    title="Edit member"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => onDelete(member.id)}
                    title="Delete member"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Members Cards Component
const MembersCards = ({ members, onEdit, onView, onDelete, onStatusChange }) => {
  return (
    <div className="members-grid">
      {members.map((member) => (
        <div key={member.id} className="member-card">
          <div className="card-header">
            <div className="member-avatar">
              {member.profile_image_url ? (
                <img
                  src={member.profile_image_url}
                  alt={member.name}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="card-actions">
              <div className="dropdown">
                <button className="dropdown-trigger">
                  <MoreVertical size={16} />
                </button>
                <div className="dropdown-menu">
                  <button onClick={() => onView(member)}>
                    <Eye size={14} /> View
                  </button>
                  <button onClick={() => onEdit(member)}>
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => onDelete(member.id)} className="danger">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-content">
            <h3 className="member-name">{member.name}</h3>
            <p className="member-position">{member.position}</p>
            <p className="member-specialization">{member.user_role}</p>
            <p className="member-enrollment">{member.enrollment_number}</p>
            <p className="member-email">{member.email}</p>
          </div>
          
          <div className="card-footer">
            <div className="member-badges">
              <span className={`role-badge ${member.role}`}>
                {member.role}
              </span>
              <StatusToggle 
                status={member.status}
                onChange={(status) => onStatusChange(member.id, status)}
                compact
              />
            </div>
            <div className="last-login">
              Last login: {member.last_login ? 
                new Date(member.last_login).toLocaleDateString() : 
                'Never'
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Status Toggle Component
const StatusToggle = ({ status, onChange, compact = false }) => {
  return (
    <div className={`status-toggle ${compact ? 'compact' : ''}`}>
      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        className={`status-select ${status}`}
      >
        <option value="active">Active</option>
        <option value="retired">Retired</option>
      </select>
    </div>
  );
};
