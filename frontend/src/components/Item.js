import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Item.css';

const API_BASE_URL = 'http://localhost:5000/api';

function Item({ selectedStorage, onBackToStorage }) {  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [updateQuantities, setUpdateQuantities] = useState({});
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
      const response = await axios.get(`${API_BASE_URL}/items/storage/${selectedStorage._id}`);
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
      setLoading(true);      const response = await axios.post(`${API_BASE_URL}/items`, {
        name: newItemName,
        quantity: newItemQuantity,
        storageSystem: selectedStorage._id
      });
      
      console.log('Item added:', response.data);
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

  const handleDeleteItem = async (itemId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
      if (selectedItemId === itemId) {
        setSelectedItemId('');
      }
      setError('');
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (itemId, newQuantity) => {
    const item = items.find(item => item._id === itemId);
    if (!item || newQuantity < 1) return;

    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/items/${itemId}`, {
        ...item,
        quantity: newQuantity
      });
      
      setItems(items.map(item => 
        item._id === itemId ? response.data : item
      ));
      setError('');
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item');
    } finally {
      setLoading(false);
    }  };

  if (!selectedStorage) {
    return (
      <div className="item-container">
        <div className="item-header">
          <h2>Items</h2>
          <button onClick={onBackToStorage} className="back-button">Back to Storage Systems</button>
        </div>
        <p>No storage system selected</p>
      </div>
    );
  }

  return (
    <div className="item-container">
      <div className="item-content fade-in">        <div className="item-header">
          <button onClick={onBackToStorage} className="back-button focus-ring">
            Back to Storage
          </button>
          <h1>Item Manager</h1>
          {selectedStorage && <p className="storage-title">in {selectedStorage.name}</p>}
        </div>

        {error && <div className="error-message">{error}</div>}        <div className="add-item-section glass-morphism">
          <h2>Add New Item</h2>
          <form onSubmit={handleAddItem} className="add-item-form">
            <div className="form-group">
              <label htmlFor="itemName">Item Name</label>
              <input
                id="itemName"
                type="text"
                className="item-input focus-ring"
                placeholder="Enter item name..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="itemQuantity">Quantity</label>
              <input
                id="itemQuantity"
                type="number"
                className="item-input quantity-input focus-ring"
                placeholder="1"
                min="1"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                disabled={loading}
              />
            </div>            <button 
              type="submit" 
              className="add-item-btn pulse-effect focus-ring"
              disabled={loading || !newItemName.trim()}
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </form>
        </div>        <div className="items-section">
          <h2>Your Items</h2>
          {loading && items.length === 0 ? (
            <div className="loading loading-shimmer">Loading items...</div>
          ) : items.length === 0 ? (
            <div className="no-items">No items in this storage system yet. Add your first item above!</div>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item._id} className="item-card fade-in">
                  <div className="item-header-row">
                    <h3 className="item-name">{item.name}</h3>
                    <span className="item-quantity">×{item.quantity}</span>
                  </div>                  <div className="item-actions">
                    <div className="update-section">
                      <input
                        type="number"
                        className="update-input focus-ring"
                        min="1"
                        value={updateQuantities[item._id] || item.quantity}
                        onChange={(e) => setUpdateQuantities({
                          ...updateQuantities,
                          [item._id]: parseInt(e.target.value) || 1
                        })}
                      />                      <button 
                        onClick={() => handleUpdateItem(item._id, updateQuantities[item._id] || item.quantity)}
                        className="update-btn focus-ring"
                      >
                        Update
                      </button>
                    </div>
                    <button 
                      onClick={() => handleDeleteItem(item._id)}
                      className="delete-item-btn focus-ring"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Item;
