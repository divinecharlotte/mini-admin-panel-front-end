
import  { useState, useEffect } from 'react';
import { type User, createUser, updateUser, deleteUser, fetchAllUsers } from '../api';
import { UserForm } from './UserForm';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (userData: any) => {
    try {
      setFormLoading(true);
      await createUser(userData);
      await loadUsers(); // Refresh the list
      setShowForm(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return;
    try {
      setFormLoading(true);
      await updateUser(editingUser.id, userData);
      await loadUsers(); // Refresh the list
      setEditingUser(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to update user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteUser(id);
      await loadUsers(); // Refresh the list
    } catch (err: any) {
      setError(err?.message || 'Failed to delete user');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>User Management</h2>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '8px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Add New User
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: 12, 
          background: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: 4, 
          color: '#dc2626',
          marginBottom: 16 
        }}>
          {error}
          <button 
            onClick={() => setError(null)}
            style={{ marginLeft: 8, background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

      {showForm && (
        <div style={{ 
          background: '#f9fafb', 
          padding: 24, 
          borderRadius: 8, 
          marginBottom: 24,
          border: '1px solid #e5e7eb'
        }}>
          <UserForm
            user={editingUser}
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            onCancel={handleCancelForm}
            loading={formLoading}
          />
        </div>
      )}

      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #d1d5db' }}>ID</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #d1d5db' }}>Email</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #d1d5db' }}>Role</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #d1d5db' }}>Status</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #d1d5db' }}>Created</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #d1d5db' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ padding: 12, border: '1px solid #d1d5db' }}>{user.id}</td>
                <td style={{ padding: 12, border: '1px solid #d1d5db' }}>{user.email}</td>
                <td style={{ padding: 12, border: '1px solid #d1d5db' }}>{user.role}</td>
                <td style={{ padding: 12, border: '1px solid #d1d5db' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    background: user.status === 'active' ? '#dcfce7' : '#fef2f2',
                    color: user.status === 'active' ? '#166534' : '#dc2626'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: 12, border: '1px solid #d1d5db' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: 12, border: '1px solid #d1d5db' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleEditUser(user)}
                      style={{
                        padding: '4px 8px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{
                        padding: '4px 8px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: '#6b7280' }}>
            No users found. Click "Add New User" to get started.
          </div>
        )}
      </div>
    </div>
  );
}