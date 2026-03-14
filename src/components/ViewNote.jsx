import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { decryptText } from '../utils/crypto';
import DOMPurify from 'dompurify';
import { FaClipboard, FaShareAlt } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;
const AUTO_DESTROY_SECONDS = 60;
const CLIPBOARD_CLEAR_SECONDS = 30;

function ViewNote({ noteId, encryptionKey, onCreateNewNote }) {
  const { t } = useTranslation();
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [warning, setWarning] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(AUTO_DESTROY_SECONDS);
  const [isBlurred, setIsBlurred] = useState(false);
  const [clipboardMsg, setClipboardMsg] = useState('');
  const [destroyed, setDestroyed] = useState(false);
  const timerRef = useRef(null);

  const fetchNote = useCallback(async () => {
    setIsLoading(true);
    setWarning('');

    try {
      const response = await fetch(`${API_URL}/read?note=${noteId}`);

      if (response.status === 404) {
        setWarning(t('note_not_found'));
      } else if (response.ok) {
        const data = await response.json();
        const decrypted = await decryptText(data.text, encryptionKey);
        setNoteText(DOMPurify.sanitize(decrypted));
        startAutoDestroy();
      }
    } catch {
      setWarning(t('note_not_found'));
    } finally {
      setIsLoading(false);
    }
  }, [noteId, encryptionKey]);

  const startAutoDestroy = () => {
    setSecondsLeft(AUTO_DESTROY_SECONDS);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setNoteText('');
          setDestroyed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    fetchNote();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchNote]);

  // Blur on tab switch
  useEffect(() => {
    const handleVisibility = () => {
      setIsBlurred(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (noteText) {
      await navigator.clipboard.writeText(noteText);
      setClipboardMsg(t('clipboard_copied'));

      setTimeout(async () => {
        try {
          await navigator.clipboard.writeText('');
        } catch {}
        setClipboardMsg(t('clipboard_cleared'));
        setTimeout(() => setClipboardMsg(''), 3000);
      }, CLIPBOARD_CLEAR_SECONDS * 1000);
    }
  }, [noteText, t]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (destroyed) {
    return (
      <div className="view-note">
        <h2 className="warning">{t('note_destroyed')}</h2>
        <div className="note-content error-message">{t('note_auto_destroyed')}</div>
        <div className="button-group">
          <button className="button" onClick={onCreateNewNote}>
            {t('create_new_note')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-note">
      {warning && <h2 className="warning">{t('warning')}</h2>}
      {!warning && <h2 className="secure-note">{t('secure_note')}</h2>}

      {noteText && (
        <div className="auto-destroy-timer">
          {t('auto_destroy_in', { seconds: secondsLeft })}
        </div>
      )}

      <div className={`note-content ${warning ? 'error-message' : ''} ${isBlurred ? 'blurred' : ''}`}>
        {warning || noteText}
      </div>

      {clipboardMsg && <div className="clipboard-msg">{clipboardMsg}</div>}

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
        <button className="button" onClick={onCreateNewNote}>
          {t('create_new_note')}
        </button>
      </div>
    </div>
  );
}

export default ViewNote;
