import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Game.css';

const API_BASE_URL = 'http://localhost:5000/api';

const Game = ({ onGameSelect }) => {
  const [games, setGames] = useState([]);
  const [newGameName, setNewGameName] = useState('');
  const [selectedGameId, setSelectedGameId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/games`);
      setGames(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch games');
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    if (!newGameName.trim()) {
      setError('Game name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/games`, {
        name: newGameName.trim()
      });
      
      setGames([...games, response.data]);
      setNewGameName('');
      setError('');
    } catch (err) {
      setError('Failed to add game');
      console.error('Error adding game:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = (gameId) => {
    setSelectedGameId(gameId);
  };

  const handleProceed = () => {
    if (selectedGameId) {
      const selectedGame = games.find(game => game._id === selectedGameId);
      onGameSelect(selectedGame);
    }
  };

  return (
    <div className="game-container">
      <div className="game-content">
        <h1>Game Manager</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Add Game Form */}
        <form onSubmit={handleAddGame} className="add-game-form">
          <div className="input-group">
            <input
              type="text"
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              placeholder="Enter game name..."
              className="game-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="add-game-btn"
              disabled={loading || !newGameName.trim()}
            >
              {loading ? 'Adding...' : 'Add Game'}
            </button>
          </div>
        </form>

        {/* Games Dropdown */}
        <div className="games-dropdown-section">
          <label htmlFor="games-select" className="dropdown-label">
            Select a Game:
          </label>
          <select
            id="games-select"
            value={selectedGameId}
            onChange={(e) => handleGameSelect(e.target.value)}
            className="games-dropdown"
            disabled={loading || games.length === 0}
          >
            <option value="">
              {games.length === 0 ? 'No games available' : 'Choose a game...'}
            </option>
            {games.map((game) => (
              <option key={game._id} value={game._id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Game Info */}
        {selectedGameId && (
          <div className="selected-game-info">
            <h3>Selected Game:</h3>
            <p>{games.find(game => game._id === selectedGameId)?.name}</p>
            <button 
              className="proceed-btn"
              onClick={handleProceed}
            >
              Manage Storage Systems →
            </button>
          </div>
        )}

        {/* Games Count */}
        <div className="games-count">
          Total Games: {games.length}
        </div>
      </div>
    </div>  );
};

export default Game;
