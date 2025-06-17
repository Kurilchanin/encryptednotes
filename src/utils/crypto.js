import { secretbox, randomBytes } from 'tweetnacl';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';

export const generateKey = () => {
  const key = randomBytes(32);
  return encodeBase64(key);
}

export const encryptText = (text, key) => {
  const keyBytes = decodeBase64(key);
  const nonce = randomBytes(24);
  const textBytes = new TextEncoder().encode(text);
  const encryptedMessage = secretbox(textBytes, nonce, keyBytes);
  const fullMessage = new Uint8Array(nonce.length + encryptedMessage.length);
  fullMessage.set(nonce);
  fullMessage.set(encryptedMessage, nonce.length);
  return encodeBase64(fullMessage);
}

export const decryptText = (encryptedText, key) => {
  const messageBytes = decodeBase64(encryptedText);
  const keyBytes = decodeBase64(key);
  const nonce = messageBytes.slice(0, 24);
  const encryptedMessage = messageBytes.slice(24);
  const decryptedMessage = secretbox.open(encryptedMessage, nonce, keyBytes);
  return new TextDecoder().decode(decryptedMessage);
}