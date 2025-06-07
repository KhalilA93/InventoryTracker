import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './StorageSystem.css';

const API_BASE_URL = 'http://localhost:5000/api';

const StorageSystem = ({ selectedGame, onBackToGames, onStorageSelect }) => {
  const [storageSystems, setStorageSystems] = useState([]);
  const [newStorageName, setNewStorageName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Debug logging
  console.log('StorageSystem render - loading:', loading, 'selectedGame:', selectedGame);// Fetch storage systems for the selected game
  const fetchStorageSystems = useCallback(async () => {
    if (!selectedGame || !selectedGame._id) {
      console.log('No selected game, skipping fetch');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching storage systems for game:', selectedGame._id);
      const response = await axios.get(`${API_BASE_URL}/storage/game/${selectedGame._id}`);
      console.log('Storage systems response:', response.data);
      setStorageSystems(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching storage systems:', err);
      setError('Failed to fetch storage systems');
    } finally {
      setLoading(false);
      console.log('Loading set to false');
    }
  }, [selectedGame]);

  // Fetch storage systems for the selected game
  useEffect(() => {
    if (selectedGame) {
      fetchStorageSystems();
    }
  }, [selectedGame, fetchStorageSystems]);
  const handleAddStorage = async (e) => {
    e.preventDefault();
    if (!newStorageName.trim()) {
      setError('Storage system name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/storage`, {
        name: newStorageName.trim(),
        game: selectedGame._id
      });
      
      setStorageSystems([...storageSystems, response.data]);
      setNewStorageName('');
      setError('');
    } catch (err) {
      setError('Failed to add storage system');
      console.error('Error adding storage system:', err);
    } finally {
      setLoading(false);
    }  };

  const handleDeleteGame = async () => {
    if (!window.confirm(`Are you sure you want to delete the game "${selectedGame?.name}"? This will also delete all associated storage systems and items.`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/games/${selectedGame._id}`);
      
      // Navigate back to games page after successful deletion
      onBackToGames();
    } catch (err) {
      setError('Failed to delete game');
      console.error('Error deleting game:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="storage-container">
      <div className="storage-content fade-in">        <div className="storage-header">
          <button onClick={onBackToGames} className="back-btn focus-ring">
            Back to Games
          </button>
          <div className="storage-title">
            <h1>Storage</h1>
            {selectedGame && <p className="game-title">for {selectedGame.name}</p>}
          </div>
          {selectedGame && (
            <button onClick={handleDeleteGame} className="delete-game-btn focus-ring">
              Delete Game
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="add-storage-form">
          <form onSubmit={handleAddStorage}>
            <div className="input-group">
              <input
                type="text"
                className="storage-input focus-ring"
                placeholder="Enter storage system name..."
                value={newStorageName}
                onChange={(e) => setNewStorageName(e.target.value)}
                disabled={loading}
              />              <button 
                type="submit" 
                className="add-storage-btn pulse-effect focus-ring"
                disabled={loading || !newStorageName.trim()}
              >
                {loading ? 'Adding...' : 'Add Storage'}
              </button>
            </div>
          </form>
        </div>        <div className="storage-list">
          <h2>Storage Systems</h2>
          {loading && storageSystems.length === 0 ? (
            <div className="loading loading-shimmer">Loading storage systems...</div>
          ) : storageSystems.length === 0 ? (
            <div className="no-storage">No storage systems yet. Add your first storage system above!</div>
          ) : (
            storageSystems.map((storage) => (
              <div key={storage._id} className="storage-item fade-in">
                <div className="storage-info">
                  <h3 className="storage-name">{storage.name}</h3>
                  <span className="storage-meta">Storage System</span>
                </div>
                <div className="storage-actions">
                  <button 
                    className="select-storage-btn pulse-effect focus-ring"
                    onClick={() => onStorageSelect(storage)}
                    disabled={loading}
                  >
                    View Items
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageSystem;
