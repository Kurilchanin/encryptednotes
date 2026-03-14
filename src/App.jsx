import { useEffect, useState } from 'react';
import CreateNote from './components/CreateNote';
import ViewNote from './components/ViewNote';
import './App.css';

function App() {
  const [noteParams, setNoteParams] = useState(null);
  const [showCreateNote, setShowCreateNote] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get('note');
    const encryptionKey = window.location.hash.slice(1);

    if (noteId && encryptionKey) {
      setNoteParams({ noteId, encryptionKey });
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
