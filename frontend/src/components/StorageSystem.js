import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './StorageSystem.css';

const API_BASE_URL = 'http://localhost:5000/api';

const StorageSystem = ({ selectedGame, onBackToGames, onStorageSelect }) => {
  const [storageSystems, setStorageSystems] = useState([]);
  const [newStorageName, setNewStorageName] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');  const [loading, setLoading] = useState(false);
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
    }
  };
  const handleStorageSelect = (storageId) => {
    setSelectedStorage(storageId);
  };

  const handleProceed = () => {
    if (selectedStorage) {
      const selectedStorageData = storageSystems.find(storage => storage._id === selectedStorage);
      onStorageSelect(selectedStorageData);
    }
  };

  const handleDeleteStorage = async (storageId) => {
    if (!window.confirm('Are you sure you want to delete this storage system? This will also delete all associated items.')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/storage/${storageId}`);
      
      setStorageSystems(storageSystems.filter(storage => storage._id !== storageId));
      if (selectedStorage === storageId) {
        setSelectedStorage('');
      }
      setError('');
    } catch (err) {
      setError('Failed to delete storage system');
      console.error('Error deleting storage system:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="storage-container">
      <div className="storage-content">
        {/* Header with back button */}
        <div className="storage-header">
          <button onClick={onBackToGames} className="back-btn">
            ← Back to Games
          </button>
          <h1>Storage Systems</h1>
        </div>

        {/* Selected Game Info */}
        <div className="selected-game-display">
          <h2>Game: {selectedGame.name}</h2>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Add Storage System Form */}
        <form onSubmit={handleAddStorage} className="add-storage-form">
          <div className="input-group">
            <input
              type="text"
              value={newStorageName}
              onChange={(e) => setNewStorageName(e.target.value)}
              placeholder="Enter storage system name..."
              className="storage-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="add-storage-btn"
              disabled={loading || !newStorageName.trim()}
            >
              {loading ? 'Adding...' : 'Add Storage System'}
            </button>
          </div>
        </form>

        {/* Storage Systems Dropdown */}
        <div className="storage-dropdown-section">
          <label htmlFor="storage-select" className="dropdown-label">
            Select a Storage System:
          </label>
          <select
            id="storage-select"
            value={selectedStorage}
            onChange={(e) => handleStorageSelect(e.target.value)}
            className="storage-dropdown"
            disabled={loading || storageSystems.length === 0}
          >
            <option value="">
              {storageSystems.length === 0 ? 'No storage systems available' : 'Choose a storage system...'}
            </option>
            {storageSystems.map((storage) => (
              <option key={storage._id} value={storage._id}>
                {storage.name}
              </option>
            ))}
          </select>
        </div>        {/* Selected Storage Info */}
        {selectedStorage && (
          <div className="selected-storage-info">
            <h3>Selected Storage System:</h3>
            <p>{storageSystems.find(storage => storage._id === selectedStorage)?.name}</p>
            <button 
              className="proceed-btn"
              onClick={handleProceed}
            >
              Manage Items →
            </button>
            <button 
              className="delete-btn"
              onClick={() => handleDeleteStorage(selectedStorage)}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Storage System'}
            </button>
          </div>
        )}

        {/* Storage Systems Count */}
        <div className="storage-count">
          Total Storage Systems: {storageSystems.length}
        </div>
      </div>
    </div>
  );
};

export default StorageSystem;
