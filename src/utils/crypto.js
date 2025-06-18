import CryptoJS from 'crypto-js';

// Генерация ключа длиной 256 бит (32 байта)
export const generateKey = () => {
  return CryptoJS.lib.WordArray.random(32).toString();
}

export const encryptText = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString();
}

export const decryptText = (encryptedText, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
}