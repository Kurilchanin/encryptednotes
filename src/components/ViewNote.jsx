import { useEffect, useState, useCallback } from 'react';
import { decryptText } from '../utils/crypto';
import { API_URL } from '../config';
import DOMPurify from 'dompurify';
import { FaClipboard, FaShareAlt } from 'react-icons/fa';

function ViewNote({ noteId, encryptionKey }) {
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchNote = useCallback(async () => {
    if (!noteId) {
      setNoteText('Invalid note ID.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/read?note=${noteId}`);
      const data = await response.json();

      if (data.error) {
        setNoteText(data.error);
      } else if (encryptionKey) {
        const decryptedText = decryptText(data.text, encryptionKey);
        setNoteText(DOMPurify.sanitize(decryptedText));
      } else {
        setNoteText('Decryption key is required.');
      }
    } catch {
      setNoteText('Error fetching note.');
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

  const isError = noteText === 'Note not found or already read';

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="view-note">
      <h2 className={isError ? 'warning' : ''}>
        {isError ? 'WARNING' : 'Secure Note'}
      </h2>
      <div className={`note-content ${isError ? 'error-message' : ''}`}>
        {noteText}
      </div>
      {!isError && (
        <div className="button-group">
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