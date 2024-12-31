import { useState } from 'react'
import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'
import { API_URL } from '../config'
import { FaClipboard, FaShareAlt } from 'react-icons/fa'
import DOMPurify from 'dompurify'
import { generateKey } from '../utils/crypto'

const MAX_CHARS = 500;

function CreateNote() {
  const [noteText, setNoteText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [noteLink, setNoteLink] = useState('')

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text)
  }

  const handleTextChange = (e) => {
    const text = e.target.value;
    
    const safePattern = /^[\p{L}\p{N}\s.,!?'"()\-:;]*$/u;
    
    if (text.length <= MAX_CHARS && safePattern.test(text)) {
      setNoteText(text);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const noteId = uuidv4();
      const encryptionKey = generateKey();
      const encryptedText = CryptoJS.AES.encrypt(
        DOMPurify.sanitize(noteText), 
        encryptionKey
      ).toString()

      console.log('Creating note with ID:', noteId);

      const response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: encryptedText, 
          id: noteId 
        }),
      })

      const data = await response.json()
      console.log('Create response:', data);
      
      if (data.success) {
        const noteLink = `https://encryptednotes.ton?note=${noteId}_${encryptionKey}`;
        console.log('Generated link:', noteLink);
        setNoteLink(noteLink);
        setNoteText('');
      }
    } catch (error) {
      console.error('Failed to create note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2>Create a Secure Note</h2>
      <form onSubmit={handleSubmit} className="note-form">
        <div>
          <textarea
            className="note-input"
            value={noteText}
            onChange={handleTextChange}
            placeholder="Enter the note text..."
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
          {isLoading ? 'Creating...' : 'Create Note'}
        </button>
      </form>
      
      {noteLink && (
        <div className="button-group">
          <button 
            className="button share-button" 
            onClick={() => copyToClipboard(noteLink)}
          >
            <FaClipboard /> Copy
          </button>
          <button 
            className="button share-button" 
            onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(noteLink)}`, '_blank')}
          >
            <FaShareAlt /> Share
          </button>
        </div>
      )}
    </div>
  )
}

export default CreateNote