import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';
import { customAlphabet } from 'nanoid';
import { FaClipboard, FaShareAlt } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import { generateKey } from '../utils/crypto';

const MAX_CHARS = 500;
const API_URL = import.meta.env.VITE_API_URL;

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // Только цифры и буквы
const nanoid = customAlphabet(alphabet, 10);

function CreateNote() {
  const { t } = useTranslation();
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [noteLink, setNoteLink] = useState('');

  const handleTextChange = (e) => {
    const text = e.target.value;
    const safePattern = /^[\s\S]*$/;
    if (text.length <= MAX_CHARS) {
      setNoteText(text.split('').filter(char => safePattern.test(char)).join(''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const noteId = nanoid();
    const encryptionKey = generateKey();
    const encryptedText = CryptoJS.AES.encrypt(
      DOMPurify.sanitize(noteText),
      encryptionKey
    ).toString();

    await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: encryptedText,
        id: noteId
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const generatedLink = `${window.location.origin}?note=${noteId}_${encryptionKey}`;
          setNoteLink(generatedLink);
          setNoteText('');
        }
      });

    setIsLoading(false);
  }

  const copyToClipboard = useCallback(() => {
    if (noteLink) {
      const textArea = document.createElement('textarea');
      textArea.value = noteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, [noteLink]);

  return (
    <div>
      <div className="notice">{t('note_stored')}</div>
      <h2>{t('secure_note_title')}</h2>
      <form onSubmit={handleSubmit} className="note-form">
        <div>
          <textarea
            className="note-input"
            value={noteText}
            onChange={handleTextChange}
            placeholder={t('enter_note_text')}
            required
          />
          <div className="char-counter">
            {noteText.length}/{MAX_CHARS} characters
          </div>
        </div>
        <button
          className="button"
          type="submit"
          disabled={isLoading || !noteText.trim()}
        >
          {isLoading ? 'Creating...' : t('create_note')}
        </button>
      </form>

      {noteLink && (
        <div className="button-group">
          <button
            className="button share-button"
            onClick={copyToClipboard}
          >
            <FaClipboard /> {t('copy')}
          </button>
          <button
            className="button share-button"
            onClick={() => {
              const shareLink = `${window.location.origin}?note=${encodeURIComponent(noteLink.split('?note=')[1])}`;
              window.open(`https://t.me/share/url?url=${encodeURIComponent(shareLink)}`, '_blank');
            }}
          >
            <FaShareAlt /> {t('share')}
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateNote;