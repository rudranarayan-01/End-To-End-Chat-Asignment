// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        {/* Dashboard shows the user list */}
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/chat/:userId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;