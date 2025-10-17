import React from 'react';

type Row = {
  id: number;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

export function UsersTable({ rows }: { rows: Row[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th align="left">ID</th>
          <th align="left">Email</th>
          <th align="left">Role</th>
          <th align="left">Status</th>
          <th align="left">Created</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.email}</td>
            <td>{r.role}</td>
            <td>{r.status}</td>
            <td>{r.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}