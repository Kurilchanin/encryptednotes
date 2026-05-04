import { useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
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
      <a
        className="github-link"
        href="https://github.com/Kurilchanin/encryptednotes"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
        title="GitHub"
      >
        <FaGithub />
      </a>
    </div>
  );
}

export default App;
