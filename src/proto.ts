import * as protobuf from 'protobufjs';

let UsersListType: protobuf.Type | null = null;

export async function getUsersListType(): Promise<protobuf.Type> {
  if (UsersListType) return UsersListType;
  const root = await protobuf.load('/user.proto');
  UsersListType = root.lookupType('adminpanel.UsersList') as protobuf.Type;
  return UsersListType;
}

export type ProtoUser = {
  id: number;
  email: string;
  role: string;
  status: string;
  createdAt?: { seconds: number; nanos: number };
  emailHash?: Uint8Array;
  signature?: Uint8Array;
};

export function timestampToDate(ts?: { seconds: number; nanos: number }): Date | null {
  if (!ts) return null;
  const ms = ts.seconds * 1000 + Math.floor((ts.nanos || 0) / 1e6);
  return new Date(ms);
}