export const API_BASE = 'http://localhost:3000';
export type Last7 = { date: string; count: number };

export type CreateUserDto = {
  email: string;
  role: string;
  status: string;
};

export type UpdateUserDto = Partial<CreateUserDto>;

export type User = {
  id: number;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  emailHash?: string;
  signature?: string;
};

// CRUD operations
export async function createUser(userData: CreateUserDto): Promise<User> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create user: ${error}`);
  }
  return await res.json();
}

export async function updateUser(id: number, userData: UpdateUserDto): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update user: ${error}`);
  }
  return await res.json();
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to delete user: ${error}`);
  }
}

export async function fetchAllUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return await res.json();
}

export async function fetchUsersProtobuf(): Promise<ArrayBuffer> {
  const res = await fetch(`${API_BASE}/users/export`);
  if (!res.ok) throw new Error('Failed to fetch users export');
  return await res.arrayBuffer();
}

export async function fetchPublicKeyPem(): Promise<string> {
  const res = await fetch(`${API_BASE}/keys/public`);
  if (!res.ok) throw new Error('Failed to fetch public key');
  return await res.text();
}

export async function fetchLast7Days(): Promise<Last7[]> {
  const res = await fetch(`${API_BASE}/users/stats/last7days`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return await res.json();
}