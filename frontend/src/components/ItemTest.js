import React from 'react';

const ItemTest = ({ selectedStorage, onBackToStorage }) => {
  return (
    <div>
      <h1>Item Test Component</h1>
      <p>Selected Storage: {selectedStorage?.name || 'None'}</p>
      <button onClick={onBackToStorage}>Back to Storage</button>
    </div>
  );
};

export default ItemTest;
