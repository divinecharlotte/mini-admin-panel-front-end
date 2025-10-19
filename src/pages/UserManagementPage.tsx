import { UserManagement } from '../components/UserManagement';

export function UserManagementPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-gray-600">
          Manage users in the system
        </p>
      </div>
      <UserManagement />
    </div>
  );
}
