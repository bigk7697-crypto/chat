# Secure Chat

A secure real-time messaging web application for developers and ethical hackers to collaborate safely.

## Features

- Google OAuth login
- Email + password registration
- End-to-end encryption (E2EE) for messages
- Real-time private and group chats
- Voice messages and audio calls (WebRTC)
- File sharing with code snippet display
- Dark mode UI inspired by Telegram Web
- Comprehensive security measures

## Project Structure

```
chat/
├── frontend/           # Next.js frontend
├── backend/            # Node.js/Express backend
└── docker/             # Docker configuration
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Docker (optional)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/securechat
   JWT_SECRET=your_jwt_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Security Features

- End-to-end encryption for messages
- HTTPS enforcement
- Rate limiting
- Secure password hashing (bcrypt)
- JWT-based authentication
- Helmet.js for security headers
- CORS protection
- Input validation and sanitization

## Deployment

The application is designed to be deployed using Docker. See the `docker/` directory for configuration files.

## License

MIT