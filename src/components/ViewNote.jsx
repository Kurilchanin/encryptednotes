import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { decryptText } from '../utils/crypto';
import { API_URL } from '../config';
import DOMPurify from 'dompurify';
import { FaClipboard, FaShareAlt } from 'react-icons/fa';

function ViewNote({ noteId, encryptionKey, onCreateNewNote }) {
  const { t } = useTranslation();
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [warning, setWarning] = useState('');

  const fetchNote = useCallback(async () => {
    setIsLoading(true);
    setWarning('');

    try {
      const response = await fetch(`${API_URL}/read?note=${noteId}`);

      if (response.status === 404) {
        setWarning(t('note_not_found'));
      } else if (response.ok) {
        const data = await response.json();
        const decryptedText = decryptText(data.text, encryptionKey);
        setNoteText(DOMPurify.sanitize(decryptedText));
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [noteId, encryptionKey]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  const copyToClipboard = useCallback(async () => {
    if (noteText) {
      await navigator.clipboard.writeText(noteText);
    }
  }, [noteText]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="view-note">
      {warning && <h2 className="warning">{t('warning')}</h2>}
      {!warning && <h2 className="secure-note">{t('secure_note')}</h2>}
      <div className={`note-content ${warning ? 'error-message' : ''}`}>
        {warning || noteText}
      </div>
      {!warning ? (
        <div className="button-group">
          <button className="button share-button" onClick={copyToClipboard}>
            <FaClipboard /> {t('copy')}
          </button>
          <button 
            className="button share-button" 
            onClick={() => {
              const message = encodeURIComponent(noteText);
              window.open(`https://t.me/share/url?url=${message}`, '_blank');
            }}
          >
            <FaShareAlt /> {t('share')}
          </button>
        </div>
      ) : null}
      <div className="button-group">
        <button 
          className="button" 
          onClick={onCreateNewNote}
        >
          {t('create_new_note')}
        </button>
      </div>
    </div>
  );
}

export default ViewNote;