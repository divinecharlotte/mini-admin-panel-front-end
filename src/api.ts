export const API_BASE = 'http://localhost:3000';

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

export type Last7 = { date: string; count: number };

export async function fetchLast7Days(): Promise<Last7[]> {
  const res = await fetch(`${API_BASE}/users/stats/last7days`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return await res.json();
}