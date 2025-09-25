import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import GamePage from './pages/GamePage/GamePage';
import { NotificationContainer } from './components/NotificationManager';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Home page with game selection */}
                    <Route path="/" element={<HomePage />} />
                    
                    {/* Game pages */}
                    <Route path="/game/:gameId" element={<GamePage />} />
                    
                    {/* Redirect any unknown routes to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                
                {/* Global notification manager */}
                <NotificationContainer />
            </div>
        </Router>
    );
}

export default App;