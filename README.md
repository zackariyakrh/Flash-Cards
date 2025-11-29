# Flashcard Learning Application

A full-stack web application for learning German through interactive flashcards. Features user authentication, collection management, practice sessions with instant feedback, and comprehensive progress tracking.

## Features

✨ **User Authentication**
- Secure registration and login with JWT
- Password hashing with bcrypt
- Session persistence

📚 **Collection Management**
- Create multiple flashcard collections
- Organize flashcards by topic
- Easy collection selection

🎯 **Flashcard Creation**
- Three-language support: German, English, Arabic
- Simple and intuitive creation interface
- Edit and delete flashcards

🚀 **Practice Mode**
- Interactive flashcard sessions
- GOOD/BAD feedback buttons
- Real-time progress tracking
- Randomized card presentation

📊 **Statistics & Progress**
- Session completion statistics
- Success rate calculation
- Historical performance tracking
- Visual progress indicators

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: CSS Modules with modern design system
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # macOS/Linux
  sudo systemctl start mongod
  ```

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Create a new cluster
- Get your connection string

### 3. Configure Environment Variables

The `.env.local` file is already created with default values:

```env
MONGODB_URI=mongodb://localhost:27017/flashcard-app
JWT_SECRET=flashcard-super-secret-jwt-key-2024
```

**If using MongoDB Atlas**, update `MONGODB_URI`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flashcard-app
```

**For production**, change `JWT_SECRET` to a secure random string.

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Usage Guide

### 1. Register/Login
- Open the application in your browser
- Create a new account or login with existing credentials
- You'll be redirected to the dashboard

### 2. Create a Collection
- Enter a collection name (e.g., "Basic Greetings", "Food Vocabulary")
- Click "Create"

### 3. Add Flashcards
- Click "📚 Create Flashcards"
- Select a collection from the list
- Fill in the three fields:
  - German text
  - English translation
  - Arabic translation
- Click "Save Flashcard"
- Repeat to add more cards

### 4. Practice
- Select a collection from the list
- Click "🎯 Start Practice"
- Read the German word
- Click "Show Answer" to reveal translations
- Click "✅ GOOD" if you knew it, "❌ BAD" if you didn't
- Complete all cards to see your statistics

### 5. View Statistics
- After completing a session, view your results
- See total cards, good/bad counts, and success rate
- Historical sessions are displayed on the dashboard

## Project Structure

```
flashcard-app/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── collections/  # Collection CRUD
│   │   │   ├── flashcards/   # Flashcard CRUD
│   │   │   └── sessions/     # Statistics tracking
│   │   ├── dashboard/        # Dashboard page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Login/Register page
│   ├── components/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── lib/
│   │   ├── auth.ts           # Auth utilities
│   │   └── mongodb.ts        # Database connection
│   └── models/               # Mongoose models
│       ├── User.ts
│       ├── Collection.ts
│       ├── Flashcard.ts
│       └── Session.ts
├── package.json
├── tsconfig.json
└── next.config.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Collections
- `GET /api/collections` - Get all collections
- `POST /api/collections` - Create collection
- `DELETE /api/collections?id={id}` - Delete collection

### Flashcards
- `GET /api/flashcards?collectionId={id}` - Get flashcards
- `POST /api/flashcards` - Create flashcard
- `DELETE /api/flashcards?id={id}` - Delete flashcard

### Sessions
- `GET /api/sessions` - Get practice sessions
- `POST /api/sessions` - Save session statistics

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env.local`
- For Atlas, verify IP whitelist and credentials

### Port Already in Use
```bash
# Change port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## Future Enhancements

- Spaced repetition algorithm
- Image support for flashcards
- Audio pronunciation
- Export/import collections
- Mobile app version
- Collaborative collections

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues or questions, please create an issue in the repository.

---

**Happy Learning! 🎓**
