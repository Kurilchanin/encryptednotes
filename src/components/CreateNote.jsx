import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaClipboard, FaShareAlt } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import { generateKey, encryptText } from '../utils/crypto';

const MAX_CHARS = 500;
const API_URL = import.meta.env.VITE_API_URL;

const TTL_OPTIONS = [
  { value: 300, labelKey: 'ttl_5min' },
  { value: 3600, labelKey: 'ttl_1hour' },
  { value: 86400, labelKey: 'ttl_24hours' },
];

function CreateNote() {
  const { t } = useTranslation();
  const [noteText, setNoteText] = useState('');
  const [ttl, setTtl] = useState(86400);
  const [isLoading, setIsLoading] = useState(false);
  const [noteLink, setNoteLink] = useState('');

  const handleTextChange = (e) => {
    const text = e.target.value;
    const safePattern = /^[\p{L}\p{N}\s.,!?'"()\-:;]*$/u;
    if (text.length <= MAX_CHARS) {
      setNoteText(text.split('').filter(char => safePattern.test(char)).join(''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const encryptionKey = await generateKey();
      const encryptedText = await encryptText(
        DOMPurify.sanitize(noteText),
        encryptionKey
      );

      const response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: encryptedText, ttl }),
      });

      const data = await response.json();
      if (data.success && data.id) {
        const generatedLink = `https://encryptednotes.vercel.app?note=${data.id}#${encryptionKey}`;
        setNoteLink(generatedLink);
        setNoteText('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = useCallback(() => {
    if (noteLink) {
      navigator.clipboard.writeText(noteLink);
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

        <div className="ttl-field">
          <label className="ttl-label">{t('ttl_label')}</label>
          <div className="ttl-options">
            {TTL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`ttl-button ${ttl === opt.value ? 'ttl-active' : ''}`}
                onClick={() => setTtl(opt.value)}
              >
                {t(opt.labelKey)}
              </button>
            ))}
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
          <button className="button share-button" onClick={copyToClipboard}>
            <FaClipboard /> {t('copy')}
          </button>
          <button
            className="button share-button"
            onClick={() => {
              window.open(`https://t.me/share/url?url=${encodeURIComponent(noteLink)}`, '_blank');
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
