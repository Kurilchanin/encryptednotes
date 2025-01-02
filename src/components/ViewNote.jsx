import { useEffect, useState, useCallback } from 'react';
import { decryptText } from '../utils/crypto';
import { API_URL } from '../config';
import DOMPurify from 'dompurify';
import { FaClipboard, FaShareAlt } from 'react-icons/fa';

function ViewNote({ noteId, encryptionKey, onCreateNewNote }) {
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [warning, setWarning] = useState('');

  const fetchNote = useCallback(async () => {
    setIsLoading(true);
    setWarning('');

    try {
      const response = await fetch(`${API_URL}/read?note=${noteId}`);

      if (response.status === 404) {
        setWarning('Note not found or already read');
      } else if (response.ok) {
        const data = await response.json();
        const decryptedText = decryptText(data.text, encryptionKey);
        setNoteText(DOMPurify.sanitize(decryptedText));
      }
    } catch (err) {
      // Здесь можно оставить пустым, если не нужно показывать ошибку
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
      {warning && <h2 className="warning">{warning}</h2>}
      {!warning && <h2 className="secure-note">Secure Note</h2>}
      <div className={`note-content ${warning ? 'error-message' : ''}`}>
        {warning ? '' : noteText}
      </div>
      {!warning && (
        <div className="button-group">
          <button 
            className="button create-button" 
            onClick={onCreateNewNote}
          >
            Create New Note
          </button>
          <button className="button share-button" onClick={copyToClipboard}>
            <FaClipboard /> Copy
          </button>
          <button 
            className="button share-button" 
            onClick={() => {
              const message = encodeURIComponent(noteText);
              window.open(`https://t.me/share/url?url=${message}`, '_blank');
            }}
          >
            <FaShareAlt /> Share
          </button>
        </div>
      )}
    </div>
  );
}

export default ViewNote;