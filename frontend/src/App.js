import React, { useState } from 'react';
import Game from './components/Game';
import StorageSystem from './components/StorageSystem';
import Item from './components/Item';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('games');
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setCurrentView('storage');
  };

  const handleStorageSelect = (storage) => {
    setSelectedStorage(storage);
    setCurrentView('items');
  };

  const handleBackToGames = () => {
    setCurrentView('games');
    setSelectedGame(null);
    setSelectedStorage(null);
  };

  const handleBackToStorage = () => {
    setCurrentView('storage');
    setSelectedStorage(null);
  };

  return (
    <div className="App">
      {currentView === 'games' && (
        <Game onGameSelect={handleGameSelect} />
      )}
      {currentView === 'storage' && (
        <StorageSystem 
          selectedGame={selectedGame}
          onBackToGames={handleBackToGames}
          onStorageSelect={handleStorageSelect}
        />
      )}
      {currentView === 'items' && (
        <Item 
          selectedStorage={selectedStorage}
          onBackToStorage={handleBackToStorage}
        />
      )}
    </div>
  );
}

export default App;
