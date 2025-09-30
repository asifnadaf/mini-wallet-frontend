# Mini Wallet Frontend

A Vue.js Single Page Application (SPA) for the Mini Wallet application with Docker support and Tailwind CSS styling.

## 🚀 Features

- **Authentication System**
  - User registration and login
  - Password reset functionality
  - Email verification
  - Secure logout

- **Transaction Management**
  - View transaction history
  - Send Moneys
  - Real-time transaction updates (via Pusher)

- **User Profile Management**
  - Change password
  - Email verification status

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Clean and intuitive interface
  - Toast notifications
  - Loading states and error handling

## 🛠️ Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management library
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Pusher** - Real-time communication for live updates
- **Docker** - Containerization
- **Nginx** - Web server for production

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## 📥 Installation

### Clone the Repository

```bash
# Clone the repository
git clone https://github.com/asifnadaf/mini-wallet-frontend.git

# Navigate to the project directory
cd mini-wallet-frontend
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# App Configuration
VITE_APP_NAME="Mini Wallet"

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_URL=http://localhost:3000

# Pusher Configuration (Required for real-time features)
VITE_PUSHER_APP_KEY=your_pusher_app_key
VITE_PUSHER_APP_CLUSTER=your_pusher_cluster
```

**Note:** Pusher settings are required for real-time transaction updates and notifications to work properly.

## 🚀 Getting Started

### Option 1: Docker (Recommended for Production)

```bash
# Build and start the application
docker compose up --build

# Run in background
docker compose up -d --build
```

**Access the application at:** http://localhost:3000

### Option 2: Development Setup

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev
```

## 📡 API Integration

The frontend integrates with the Laravel backend API endpoints using Laravel Sanctum for authentication:

### Authentication Endpoints
- `POST /api/v1/register` - User registration
- `POST /api/v1/login` - User login
- `POST /api/v1/forgot-password/email/token` - Request password reset
- `POST /api/v1/forgot-password/verify/token` - Verify reset token
- `POST /api/v1/forgot-password/reset-password` - Reset password
- `POST /api/v1/logout` - User logout

### Email Verification
- `POST /api/v1/email/send-token` - Send verification token
- `POST /api/v1/email/verify-token` - Verify email token

### User Management
- `GET /api/v1/user` - Get user information
- `POST /api/v1/change-password` - Change password

### Transactions
- `GET /api/v1/transactions` - Get user transactions
- `POST /api/v1/transactions` - Create Send Money

## 🔒 Security Features

- Laravel Sanctum API token authentication
- Token-based authentication with secure headers
- Protected routes with authentication guards
- Email verification requirement for sensitive operations
- Secure password change functionality
- Auto-logout after 2 minutes of inactivity


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

