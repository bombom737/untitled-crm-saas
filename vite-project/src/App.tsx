import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Authentication } from './views/Authentication';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Authentication />} />
      </Routes>
    </Router>
  );
}

export default App;