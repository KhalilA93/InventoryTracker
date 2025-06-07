import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Item.css';

const API_BASE_URL = 'http://localhost:5000/api';

function Item({ selectedStorage, onBackToStorage }) {
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

  const adjustQuantity = async (itemId, adjustment) => {
    const item = items.find(item => item._id === itemId);
    if (!item) return;

    const newQuantity = Math.max(0, item.quantity + adjustment);
    
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
      console.error('Error updating item quantity:', err);
      setError('Failed to update item quantity');
    } finally {
      setLoading(false);
    }
  };

  const selectedItem = items.find(item => item._id === selectedItemId);

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
      <div className="item-header">
        <h2>Items in {selectedStorage.name}</h2>
        <button onClick={onBackToStorage} className="back-button">Back to Storage Systems</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Add new item form */}
      <div className="add-item-section">
        <h3>Add New Item</h3>
        <form onSubmit={handleAddItem} className="add-item-form">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name"
            disabled={loading}
            required
          />
          <input
            type="number"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(parseInt(e.target.value))}
            min="1"
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>

      {/* Select existing item */}
      <div className="select-item-section">
        <h3>Select Item</h3>
        <select 
          value={selectedItemId} 
          onChange={(e) => setSelectedItemId(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Select an item --</option>
          {items.map(item => (
            <option key={item._id} value={item._id}>
              {item.name} (Qty: {item.quantity})
            </option>
          ))}
        </select>
      </div>

      {/* Selected item details */}
      {selectedItem && (
        <div className="selected-item-details">
          <h3>Selected Item Details</h3>
          <div className="item-info">
            <p><strong>Name:</strong> {selectedItem.name}</p>
            <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
            <p><strong>Storage System:</strong> {selectedStorage.name}</p>
          </div>
          <div className="item-actions">
            <div className="quantity-controls">
              <button 
                onClick={() => adjustQuantity(selectedItemId, -1)}
                className="quantity-button"
                disabled={loading || selectedItem.quantity <= 0}
              >
                -
              </button>
              <span className="quantity-display">{selectedItem.quantity}</span>
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
  );
}

export default Item;
