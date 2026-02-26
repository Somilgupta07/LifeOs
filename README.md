# LifeOS - Personal Productivity Management System

A comprehensive MERN stack productivity platform with AI-powered assistance for managing tasks, goals, events, and personal analytics.

## Features

- **Task Management**: Create, organize, and track tasks with priorities, due dates, and tags
- **Goal Planning**: Set and monitor long-term goals with milestones and progress tracking
- **Calendar & Events**: Schedule and manage events with a visual calendar interface
- **AI Assistant**: Powered by Groq API for intelligent task prioritization and productivity insights
- **Analytics Dashboard**: Visual reports and trends for productivity tracking
- **User Authentication**: Secure JWT-based authentication system

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT authentication
- Groq SDK for AI features

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Groq API key

## Installation

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup

Create `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

Create `server/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lifeos
JWT_SECRET=your_jwt_secret_key_here_change_in_production
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service: `mongod`

**Option B: MongoDB Atlas**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string and update `MONGODB_URI` in `server/.env`

### 4. Get Groq API Key

1. Sign up at [Groq Console](https://console.groq.com)
2. Generate an API key
3. Add it to `server/.env` as `GROQ_API_KEY`

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Building for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create task (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `GET /api/tasks/stats` - Get task statistics (protected)

### Goals
- `GET /api/goals` - Get all goals (protected)
- `POST /api/goals` - Create goal (protected)
- `GET /api/goals/:id` - Get goal by ID (protected)
- `PUT /api/goals/:id` - Update goal (protected)
- `DELETE /api/goals/:id` - Delete goal (protected)
- `PUT /api/goals/:id/milestones/:milestoneId` - Update milestone (protected)

### Events
- `GET /api/events` - Get all events (protected)
- `POST /api/events` - Create event (protected)
- `GET /api/events/:id` - Get event by ID (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)

### AI Assistant
- `POST /api/ai/chat` - Chat with AI (protected)
- `POST /api/ai/insights` - Get productivity insights (protected)
- `POST /api/ai/parse` - Parse natural language input (protected)

## Project Structure

```
lifeos/
├── src/
│   ├── components/
│   │   ├── AI/
│   │   ├── Auth/
│   │   ├── Calendar/
│   │   ├── Dashboard/
│   │   ├── Goals/
│   │   ├── Layout/
│   │   └── Tasks/
│   ├── contexts/
│   ├── services/
│   ├── App.tsx
│   └── main.tsx
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── package.json
```

## Features Overview

### Dashboard
- Quick stats overview
- Recent tasks
- Active goals count
- Upcoming events

### Tasks
- CRUD operations
- Priority levels (low, medium, high, urgent)
- Status tracking (todo, in-progress, completed)
- Tags and filtering
- Due dates

### Goals
- Short-term and long-term goals
- Category organization
- Milestone tracking
- Progress visualization
- Status management

### Calendar
- Monthly view
- Event creation and management
- Color-coded events
- Category filtering

### AI Assistant
- Natural language interaction
- Task prioritization suggestions
- Productivity insights
- Goal planning assistance

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- CORS configuration
- Input validation

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.
