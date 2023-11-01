import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Room from './components/Room';
import Home from './components/Home';
import Lobby from './components/Lobby';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/:roomId" element={<Room />} />
        <Route path="/:roomId/lobby" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

export default App;