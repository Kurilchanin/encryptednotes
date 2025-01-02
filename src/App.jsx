import { useEffect, useState } from 'react';
import CreateNote from './components/CreateNote';
import ViewNote from './components/ViewNote';
import './App.css';

function App() {
  const [noteParams, setNoteParams] = useState(null);
  const [showCreateNote, setShowCreateNote] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const noteParam = params.get('note');

    if (noteParam) {
      const [id, key] = noteParam.split('_');
      if (id && key) {
        setNoteParams({ noteId: id, encryptionKey: key });
      } else {
        setNoteParams(null);
      }
    } else {
      setNoteParams(null);
    }
  }, []);

  return (
    <div className="app">
      <div className="container">
        {showCreateNote ? (
          <CreateNote onClose={() => setShowCreateNote(false)} />
        ) : noteParams ? (
          <ViewNote 
            noteId={noteParams.noteId} 
            encryptionKey={noteParams.encryptionKey} 
            onCreateNewNote={() => setShowCreateNote(true)}
          />
        ) : (
          <CreateNote onClose={() => setShowCreateNote(false)} />
        )}
      </div>
    </div>
  );
}

export default App;