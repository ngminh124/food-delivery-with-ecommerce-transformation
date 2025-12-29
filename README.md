# Food Delivery with E-commerce Transformation

A Node.js + TypeScript + Express + MongoDB backend application for food delivery service.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Setup environment files
# Copy and configure your environment settings
cp src/environments/environment.dev.example.ts src/environments/environment.dev.ts
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts

# Edit the files above with your actual credentials
```

### Environment Configuration

Create your environment files in `src/environments/` with the following structure:

```typescript
export const DevEnvironment = {
  db_url: "your-mongodb-connection-string",
  jwt_secret_key: "your-secret-key",
  sendgrid_api_key: {
    api_key: "your-api-key",
    email_from: "your-email",
  },
  gmail_auth: {
    user: "your-email",
    pass: "your-app-password",
  },
};
```

**⚠️ Security Note:** Never commit environment files with actual credentials to git!

### Run Development Server

```bash
npm run start
```

Server will start with nodemon and auto-reload on file changes.

## 📁 Project Structure

```
src/
├── controllers/     # Request handlers
├── models/          # Database models
├── routers/         # API routes
├── validators/      # Input validation
├── middlewares/     # Custom middlewares
├── utils/           # Utility functions
└── environments/    # Environment configs (not tracked in git)
```

## 🛠️ Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Validation:** express-validator
- **Email:** NodeMailer, SendGrid
- **Authentication:** JWT

## 📝 Available Scripts

- `npm run start` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript

## 🔒 Security

- All sensitive data is stored in environment files (not tracked in git)
- JWT for authentication
- Input validation on all endpoints

## 📧 Contact

For questions or issues, please open an issue on GitHub.
