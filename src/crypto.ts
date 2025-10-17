function pemToArrayBuffer(pem: string): ArrayBuffer {
    const base64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }
  
  export async function importRsaPublicKey(pem: string): Promise<CryptoKey> {
    const keyData = pemToArrayBuffer(pem);
    return crypto.subtle.importKey(
      'spki',
      keyData,
      { name: 'RSA-PSS', hash: 'SHA-384' },
      true,
      ['verify']
    );
  }
  
  export function base64ToUint8(b64: string): Uint8Array {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  
  export async function verifySignatureEmail(
    publicKey: CryptoKey,
    email: string,
    signatureB64: string
  ): Promise<boolean> {
    const enc = new TextEncoder();
    const data = enc.encode(email);
    const sig = base64ToUint8(signatureB64);
    // Node signs RSA-PSS with RSA_PSS_SALTLEN_DIGEST by default => 48 bytes for SHA-384
    return crypto.subtle.verify(
      { name: 'RSA-PSS', saltLength: 48 },
      publicKey,
      sig.buffer as BufferSource,
      data
    );
  }