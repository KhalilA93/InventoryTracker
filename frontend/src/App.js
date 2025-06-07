import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import Game from './components/Game';
import StorageSystem from './components/StorageSystem';
import Item from './components/Item';
import './App.css';

// Wrapper component for Game page
function GamePage() {
  const navigate = useNavigate();
  
  const handleGameSelect = (game) => {
    navigate(`/game/${game._id}/storage`, { 
      state: { selectedGame: game } 
    });
  };

  return <Game onGameSelect={handleGameSelect} />;
}

// Wrapper component for StorageSystem page
function StorageSystemPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId } = useParams();
  
  // Get game data from navigation state or localStorage
  const selectedGame = 
    location.state?.selectedGame || 
    JSON.parse(localStorage.getItem(`game_${gameId}`)) || 
    null;

  // Save game to localStorage for page refreshes
  useEffect(() => {
    if (selectedGame && gameId) {
      localStorage.setItem(`game_${gameId}`, JSON.stringify(selectedGame));
    }
  }, [selectedGame, gameId]);

  const handleBackToGames = () => {
    navigate('/');
  };

  const handleStorageSelect = (storage) => {
    navigate(`/game/${gameId}/storage/${storage._id}/items`, {
      state: { 
        selectedGame: selectedGame,
        selectedStorage: storage 
      }
    });
  };

  return (
    <StorageSystem 
      selectedGame={selectedGame}
      onBackToGames={handleBackToGames}
      onStorageSelect={handleStorageSelect}
    />
  );
}

// Wrapper component for Item page
function ItemPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId, storageId } = useParams();
  
  // Get data from navigation state or localStorage
  const selectedGame = 
    location.state?.selectedGame || 
    JSON.parse(localStorage.getItem(`game_${gameId}`)) || 
    null;
  
  const selectedStorage = 
    location.state?.selectedStorage || 
    JSON.parse(localStorage.getItem(`storage_${storageId}`)) || 
    null;

  // Save storage to localStorage for page refreshes
  useEffect(() => {
    if (selectedStorage && storageId) {
      localStorage.setItem(`storage_${storageId}`, JSON.stringify(selectedStorage));
    }
  }, [selectedStorage, storageId]);

  const handleBackToStorage = () => {
    navigate(`/game/${gameId}/storage`, {
      state: { selectedGame: selectedGame }
    });
  };

  return (
    <Item 
      selectedStorage={selectedStorage}
      onBackToStorage={handleBackToStorage}
    />
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/game/:gameId/storage" element={<StorageSystemPage />} />
          <Route path="/game/:gameId/storage/:storageId/items" element={<ItemPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
