import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Item.css';

const API_BASE_URL = 'http://localhost:5000/api';

const Item = ({ selectedStorage, onBackToStorage }) => {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch items for the selected storage system
  const fetchItems = useCallback(async () => {
    if (!selectedStorage?._id) {
      console.log('No selected storage system, skipping fetch');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching items for storage system:', selectedStorage._id);
      const response = await axios.get(`${API_BASE_URL}/items?storageSystemId=${selectedStorage._id}`);
      console.log('Items fetched:', response.data);
      setItems(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [selectedStorage]);

  useEffect(() => {
    if (selectedStorage) {
      fetchItems();
    }
  }, [selectedStorage, fetchItems]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      setError('Item name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/items`, {
        name: newItemName.trim(),
        quantity: newItemQuantity,
        storageSystemId: selectedStorage._id
      });
      
      setItems([...items, response.data]);
      setNewItemName('');
      setNewItemQuantity(1);
      setError('');
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToItemDetails = () => {
    const selectedItem = items.find(item => item._id === selectedItemId);
    if (selectedItem) {
      alert(`Selected item: ${selectedItem.name} (Quantity: ${selectedItem.quantity})`);
    }
  };

  const adjustQuantity = async (itemId, adjustment) => {
    const item = items.find(item => item._id === itemId);
    if (!item) return;
    
    const newQuantity = Math.max(0, item.quantity + adjustment);
    
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/items/${itemId}`, {
        name: item.name,
        quantity: newQuantity
      });
      
      setItems(items.map(item => 
        item._id === itemId ? response.data : item
      ));
      setError('');
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
      setError('');
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedStorage) {
    return <div className="item-container">No storage system selected</div>;
  }

  return (
    <div className="item-container">
      <div className="item-content">
        {/* Header with back button */}
        <div className="item-header">
          <button onClick={onBackToStorage} className="back-button">
            ← Back to Storage Systems
          </button>
          <h1>Item Manager</h1>
          <p className="storage-info">Storage: {selectedStorage.name} | Game: {selectedStorage.game?.name}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="add-item-form">
          <div className="input-group">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter item name..."
              className="item-input"
              disabled={loading}
            />
            <input
              type="number"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
              min="1"
              placeholder="Quantity"
              className="quantity-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="add-item-btn"
              disabled={loading || !newItemName.trim()}
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>

        {/* Items Dropdown */}
        <div className="items-dropdown-section">
          <label htmlFor="items-select" className="dropdown-label">
            Select an Item:
          </label>
          <select
            id="items-select"
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="items-dropdown"
            disabled={loading || items.length === 0}
          >
            <option value="">
              {items.length === 0 ? 'No items available' : 'Choose an item...'}
            </option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} (Qty: {item.quantity})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Item Info */}
        {selectedItemId && (
          <div className="selected-item-info">
            <h3>Selected Item:</h3>
            <div className="item-details">
              <p><strong>Name:</strong> {items.find(item => item._id === selectedItemId)?.name}</p>
              <p><strong>Quantity:</strong> {items.find(item => item._id === selectedItemId)?.quantity}</p>
            </div>
            <div className="item-actions">
              <button 
                className="proceed-btn"
                onClick={handleProceedToItemDetails}
              >
                View Details →
              </button>
              <div className="quantity-controls">
                <button 
                  onClick={() => adjustQuantity(selectedItemId, -1)}
                  className="quantity-button"
                  disabled={loading || items.find(item => item._id === selectedItemId)?.quantity <= 0}
                >
                  -
                </button>
                <button 
                  onClick={() => adjustQuantity(selectedItemId, 1)}
                  className="quantity-button"
                  disabled={loading}
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => handleDeleteItem(selectedItemId)}
                className="delete-button"
                disabled={loading}
              >
                Delete Item
              </button>
            </div>
          </div>
        )}

        {/* Items Count */}
        <div className="items-count">
          Total Items: {items.length}
        </div>
      </div>
    </div>
  );
};

export default Item;
