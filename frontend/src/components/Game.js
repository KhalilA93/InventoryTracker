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

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game? This will also delete all associated storage systems and items.')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/games/${gameId}`);
      
      setGames(games.filter(game => game._id !== gameId));
      if (selectedGameId === gameId) {
        setSelectedGameId('');
      }
      setError('');
    } catch (err) {
      setError('Failed to delete game');
      console.error('Error deleting game:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-container">      <div className="game-content fade-in">
        <h1>Inventory Tracker</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="add-game-form">
          <form onSubmit={handleAddGame}>
            <div className="input-group">
              <input
                type="text"
                className="game-input focus-ring"
                placeholder="Enter game name..."
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
                disabled={loading}
              />              <button 
                type="submit" 
                className="add-game-btn pulse-effect focus-ring"
                disabled={loading || !newGameName.trim()}
              >
                {loading ? 'Adding...' : 'Add Game'}
              </button>
            </div>
          </form>
        </div>        <div className="games-list">
          <h2>Your Games</h2>
          {loading && games.length === 0 ? (
            <div className="loading loading-shimmer">Loading games...</div>
          ) : games.length === 0 ? (
            <div className="no-games">No games yet. Add your first game above!</div>
          ) : (
            <>
              {games.map((game) => (
                <div key={game._id} className="game-item fade-in">
                  <div className="game-info">
                    <span className="game-name">{game.name}</span>                    <button 
                      className="select-game-btn pulse-effect"
                      onClick={() => handleGameSelect(game._id)}
                      disabled={loading}
                    >
                      {selectedGameId === game._id ? 'Selected' : 'Select Game'}
                    </button>
                  </div>
                  <div className="game-actions">                    <button 
                      className="delete-game-btn pulse-effect"
                      onClick={() => handleDeleteGame(game._id)}
                      disabled={loading}
                    >
                      {loading ? 'Deleting...' : 'Delete Game'}
                    </button>
                  </div>
                </div>
              ))}
              
              {selectedGameId && (
                <div className="proceed-section fade-in">                  <button 
                    className="proceed-btn pulse-effect focus-ring"
                    onClick={handleProceed}
                    disabled={loading}
                  >
                    Proceed to Storage Systems
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
