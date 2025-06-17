import { secretbox, randomBytes } from 'tweetnacl';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';

const KEY_LENGTH = 32;
const NONCE_LENGTH = 24;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const clearSensitiveData = (data) => {
  if (data instanceof Uint8Array) {
    data.fill(0);
  }
};

export const generateKey = () => {
  const key = randomBytes(KEY_LENGTH);
  const encodedKey = encodeBase64(key);
  clearSensitiveData(key);
  return encodedKey;
}

export const encryptText = (text, key) => {
  let keyBytes = null;
  let nonce = null;
  let textBytes = null;
  let encryptedMessage = null;
  let fullMessage = null;

  try {
    keyBytes = decodeBase64(key);
    nonce = randomBytes(NONCE_LENGTH);
    textBytes = textEncoder.encode(text);
    encryptedMessage = secretbox(textBytes, nonce, keyBytes);
    fullMessage = new Uint8Array(nonce.length + encryptedMessage.length);
    fullMessage.set(nonce);
    fullMessage.set(encryptedMessage, nonce.length);
    return encodeBase64(fullMessage);
  } finally {
    clearSensitiveData(keyBytes);
    clearSensitiveData(nonce);
    clearSensitiveData(textBytes);
    clearSensitiveData(encryptedMessage);
    clearSensitiveData(fullMessage);
  }
}

export const decryptText = (encryptedText, key) => {
  let messageBytes = null;
  let keyBytes = null;
  let nonce = null;
  let encryptedMessage = null;
  let decryptedMessage = null;

  try {
    messageBytes = decodeBase64(encryptedText);
    keyBytes = decodeBase64(key);
    nonce = messageBytes.slice(0, NONCE_LENGTH);
    encryptedMessage = messageBytes.slice(NONCE_LENGTH);
    decryptedMessage = secretbox.open(encryptedMessage, nonce, keyBytes);
    return textDecoder.decode(decryptedMessage);
  } finally {
    clearSensitiveData(messageBytes);
    clearSensitiveData(keyBytes);
    clearSensitiveData(nonce);
    clearSensitiveData(encryptedMessage);
    clearSensitiveData(decryptedMessage);
  }
}