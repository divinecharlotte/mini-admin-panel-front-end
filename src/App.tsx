import React, { useEffect, useMemo, useState } from 'react';
import { fetchPublicKeyPem, fetchUsersProtobuf, fetchLast7Days } from './api';
import { importRsaPublicKey, verifySignatureEmail } from './crypto';
import { getUsersListType, timestampToDate, type ProtoUser } from './proto';
import { UsersTable } from './components/UsersTable';
import { UsersChart } from './components/UsersChart';

type TableRow = { id: number; email: string; role: string; status: string; createdAt: string };

function App() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [chart, setChart] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Load public key
        const pem = await fetchPublicKeyPem();
        const publicKey = await importRsaPublicKey(pem);

        // Fetch protobuf and decode
        const buf = await fetchUsersProtobuf();
        const UsersList = await getUsersListType();
        const msg = UsersList.decode(new Uint8Array(buf));
        const obj = UsersList.toObject(msg, { enums: String, bytes: Array });

        const protoUsers: ProtoUser[] = (obj.users || []) as unknown as ProtoUser[];

        // Verify signatures and build rows
        const verified: TableRow[] = [];
        for (const u of protoUsers) {
          const email = u.email;
          const signatureB64 = u.signature ? btoa(String.fromCharCode(...Array.from(u.signature))) : '';
          const ok = signatureB64 && email
            ? await verifySignatureEmail(publicKey, email, signatureB64)
            : false;

          if (ok) {
            const d = timestampToDate(u.createdAt);
            verified.push({
              id: Number(u.id),
              email,
              role: u.role || '',
              status: u.status || '',
              createdAt: d ? d.toISOString().slice(0, 19).replace('T', ' ') : '',
            });
          }
        }

        setRows(verified);

        // Fetch chart data
        const stats = await fetchLast7Days();
        setChart(stats);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const content = useMemo(() => {
    if (loading) return <div>Loading…</div>;
    if (error) return <div style={{ color: 'crimson' }}>{error}</div>;
    return (
      <>
        <h2>Verified Users</h2>
        <UsersTable rows={rows} />
        <h2 style={{ marginTop: 24 }}>Users Created (Last 7 Days)</h2>
        <UsersChart data={chart} />
      </>
    );
  }, [loading, error, rows, chart]);

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Mini Admin Panel</h1>
      {content}
    </div>
  );
}

export default App;