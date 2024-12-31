import { useEffect, useState } from 'react';
import { decryptText } from '../utils/crypto';
import { API_URL } from '../config';
import DOMPurify from 'dompurify';
import { FaClipboard, FaShareAlt } from 'react-icons/fa';

function ViewNote() {
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Извлекаем параметры из URL после знака ?
  const urlParams = new URLSearchParams(window.location.search);
  const fullParam = urlParams.get('note'); // Изменено с 'id' на 'note'
  const [id, key] = fullParam ? fullParam.split('_') : [];

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) {
        setNoteText('Invalid note ID.');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching note with ID:', id);
        const response = await fetch(`${API_URL}/read?note=${id}`); // Изменено с 'id' на 'note'
        const data = await response.json();
        console.log('Response:', data);

        if (data.error) {
          setNoteText(data.error);
        } else if (key) {
          try {
            const decryptedText = decryptText(data.text, key);
            setNoteText(DOMPurify.sanitize(decryptedText));
          } catch (error) {
            setNoteText('Error decrypting note.');
          }
        } else {
          setNoteText('Decryption key is required.');
        }
      } catch (error) {
        setNoteText('Error fetching note.');
      }
      setIsLoading(false);
    };

    fetchNote();
  }, [id, key]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(noteText);
  };

  const currentUrl = window.location.href;
  const isError = noteText === 'Note not found or already read';

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="view-note">
      <h2 style={isError ? { color: '#f1c40f', fontSize: '28px' } : {}}>
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