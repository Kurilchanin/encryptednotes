const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const generateKey = async () => {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const raw = await crypto.subtle.exportKey('raw', key);
  return bufToHex(new Uint8Array(raw));
};

export const encryptText = async (text, keyHex) => {
  const key = await importKey(keyHex);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(text)
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...combined));
};

export const decryptText = async (base64, keyHex) => {
  const key = await importKey(keyHex);
  const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  return decoder.decode(plaintext);
};

const importKey = (hex) =>
  crypto.subtle.importKey(
    'raw',
    hexToBuf(hex),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );

const bufToHex = (buf) =>
  [...buf].map(b => b.toString(16).padStart(2, '0')).join('');

const hexToBuf = (hex) =>
  new Uint8Array(hex.match(/.{2}/g).map(b => parseInt(b, 16)));
