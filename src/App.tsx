import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Room from './components/Room';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Room />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
    </Router>
  );
};

export default App;
