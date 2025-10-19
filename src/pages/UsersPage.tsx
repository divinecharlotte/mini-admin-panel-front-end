import { useEffect, useMemo, useState } from 'react';
import { fetchPublicKeyPem, fetchUsersProtobuf } from '../api';
import { importRsaPublicKey, verifySignatureEmail } from '../crypto';
import { getUsersListType, timestampToDate, type ProtoUser } from '../proto';
import { UsersTable } from '../components/UsersTable';

type TableRow = { id: number; email: string; role: string; status: string; createdAt: string };

export function UsersPage() {
  const [rows, setRows] = useState<TableRow[]>([]);
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
      } catch (e: any) {
        setError(e?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span className="text-gray-600">Loading users...</span>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Verified Users</h2>
            <p className="mt-1 text-sm text-gray-500">
              All users with verified signatures ({rows.length} total)
            </p>
          </div>
          <div className="p-6">
            <UsersTable rows={rows} />
          </div>
        </div>
      </div>
    );
  }, [loading, error, rows]);

  return (
    <div>
      {content}
    </div>
  );
}
