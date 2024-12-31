import { useEffect } from 'react';
import CreateNote from './components/CreateNote';
import ViewNote from './components/ViewNote';
import './App.css';

function App() {
  // Проверяем наличие параметров в URL (всё что после знака ?)
  const hasUrlParams = window.location.search.substring(1).length > 0;

  return (
    <div className="app">
      <div className="container">
        {hasUrlParams ? <ViewNote /> : <CreateNote />}
      </div>
    </div>
  );
}

export default App;