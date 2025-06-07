# Inventory Tracker - MERN Stack Application

A full-stack inventory management system built with MongoDB, Express.js, React, and Node.js. Features hierarchical navigation through Games → Storage Systems → Items with complete CRUD operations.

## Features

- **Hierarchical Navigation**: Game → Storage System → Item structure
- **Complete CRUD Operations**: Create, Read, Update, Delete for all entities
- **React Router Navigation**: URL-based routing with breadcrumb navigation
- **Responsive UI**: Modern, clean interface with proper error handling
- **Real-time Updates**: Automatic UI updates after operations
- **Confirmation Dialogs**: Safety confirmations for delete operations

## Project Structure

```
inventory-tracker/
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB schemas
│   │   ├── Game.js
│   │   ├── StorageSystem.js
│   │   └── Item.js
│   ├── routes/             # API endpoints
│   │   ├── games.js
│   │   ├── storage.js
│   │   └── items.js
│   ├── package.json
│   └── server.js           # Express server
├── frontend/               # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Game.js     # Game management
│   │   │   ├── StorageSystem.js # Storage management
│   │   │   └── Item.js     # Item management
│   │   ├── App.js          # Main app with routing
│   │   └── index.js
│   └── package.json
└── package.json            # Root package with scripts
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd inventory-tracker
   npm run install-all
   ```

2. **Set up environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/inventory_tracker
   PORT=5000
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

   This will start both servers:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3001

### Manual Setup

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Games
- `GET /api/games` - Get all games
- `POST /api/games` - Create a new game
- `GET /api/games/:id` - Get specific game
- `PUT /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game

### Storage Systems
- `GET /api/storage` - Get all storage systems
- `GET /api/storage/game/:gameId` - Get storage systems for a game
- `POST /api/storage` - Create a new storage system
- `PUT /api/storage/:id` - Update storage system
- `DELETE /api/storage/:id` - Delete storage system

### Items
- `GET /api/items/storage/:storageId` - Get items for a storage system
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

## Usage

### Navigation Flow

1. **Games Page** (`/`)
   - Add new games
   - Select a game to manage its storage systems
   - Delete games (with confirmation)

2. **Storage Systems Page** (`/game/:gameId/storage`)
   - Add new storage systems for the selected game
   - Select a storage system to manage its items
   - Delete storage systems (with confirmation)

3. **Items Page** (`/game/:gameId/storage/:storageId/items`)
   - Add new items to the selected storage system
   - Select items to view details and modify quantities
   - Adjust item quantities with +/- buttons
   - Delete items

### Key Features

- **Add New Entries**: Use the form at the top of each page
- **Select & Manage**: Use dropdowns to select existing entries
- **Quantity Controls**: +/- buttons for item quantities
- **Delete Operations**: Red delete buttons with confirmation dialogs
- **Navigation**: Back buttons and URL-based navigation

## UI Components

- **Clean, Modern Design**: Centered layouts with card-style components
- **Responsive Interface**: Works on desktop and mobile devices
- **Color-coded Actions**: 
  - Blue buttons for primary actions
  - Gray buttons for navigation
  - Red buttons for delete operations
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages

## Development

### Adding New Features

1. **Backend**: Add routes in `/backend/routes/` and models in `/backend/models/`
2. **Frontend**: Add components in `/frontend/src/components/`
3. **Styling**: Update CSS files for visual changes

### Database Schema

```javascript
// Game
{
  _id: ObjectId,
  name: String,
  __v: Number
}

// StorageSystem
{
  _id: ObjectId,
  name: String,
  game: ObjectId (ref: 'Game'),
  __v: Number
}

// Item
{
  _id: ObjectId,
  name: String,
  quantity: Number,
  storageSystem: ObjectId (ref: 'StorageSystem'),
  __v: Number
}
```

## Safety Features

- **Confirmation Dialogs**: All delete operations require user confirmation
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Prevent multiple simultaneous operations
- **Data Validation**: Required fields and proper data types

## License

ISC License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using the MERN Stack**
