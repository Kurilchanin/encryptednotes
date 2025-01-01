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

    console.log('URL Parameters:', window.location.search);

    if (noteParam) {
      console.log('Note parameter found:', noteParam);
      const [id, key] = noteParam.split('_');
      setNoteId(id);
      setEncryptionKey(key);
      setHasUrlParams(true);
      console.log('Extracted ID:', id, 'Extracted Key:', key);
    } else {
      console.log('No note parameter found.');
      setHasUrlParams(false);
    }
  }, []);

  console.log('Has URL Params:', hasUrlParams);

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