import { useEffect, useState } from 'react';
import CreateNote from './components/CreateNote';
import ViewNote from './components/ViewNote';
import './App.css';

function App() {
  const [hasUrlParams, setHasUrlParams] = useState(false);
  const [noteId, setNoteId] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const noteParam = params.get('note');

    console.log('URL Parameters:', noteParam);

    if (noteParam) {
      const [id, key] = noteParam.split('_');
      console.log('Extracted ID:', id, 'Key:', key);

      if (id && key) {
        setNoteId(id);
        setEncryptionKey(key);
        setHasUrlParams(true);
      } else {
        setHasUrlParams(false);
      }
    } else {
      setHasUrlParams(false);
    }
  }, []);

  return (
    <div className="app">
      <div className="container">
        {hasUrlParams ? (
          <ViewNote noteId={noteId} encryptionKey={encryptionKey} />
        ) : (
          <CreateNote />
        )}
      </div>
    </div>
  );
}

export default App;