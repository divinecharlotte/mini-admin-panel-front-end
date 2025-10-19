import React, { useState, useEffect } from 'react';
import type { CreateUserDto, UpdateUserDto, User } from '../api';

type UserFormProps = {
  user?: User | null;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
};

export function UserForm({ user, onSubmit, onCancel, loading = false }: UserFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setFormData({
        email: '',
        role: '',
        status: 'active',
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3>{user ? 'Edit User' : 'Add New User'}</h3>
      
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: 4 }}>
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          style={{
            width: '100%',
            padding: 8,
            border: errors.email ? '1px solid #dc2626' : '1px solid #d1d5db',
            borderRadius: 4,
          }}
        />
        {errors.email && (
          <div style={{ color: '#dc2626', fontSize: 14, marginTop: 4 }}>
            {errors.email}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="role" style={{ display: 'block', marginBottom: 4 }}>
          Role *
        </label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={loading}
          placeholder="e.g., admin, user, manager"
          style={{
            width: '100%',
            padding: 8,
            border: errors.role ? '1px solid #dc2626' : '1px solid #d1d5db',
            borderRadius: 4,
          }}
        />
        {errors.role && (
          <div style={{ color: '#dc2626', fontSize: 14, marginTop: 4 }}>
            {errors.role}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="status" style={{ display: 'block', marginBottom: 4 }}>
          Status *
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={loading}
          style={{
            width: '100%',
            padding: 8,
            border: errors.status ? '1px solid #dc2626' : '1px solid #d1d5db',
            borderRadius: 4,
          }}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && (
          <div style={{ color: '#dc2626', fontSize: 14, marginTop: 4 }}>
            {errors.status}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            background: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: 4,
            background: loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Saving...' : (user ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
}