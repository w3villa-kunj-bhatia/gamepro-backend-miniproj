# GamePro Backend

This is the backend server for the GamePro application, a platform for gamers to manage profiles, view game data (via IGDB), and interact with other users. It is built with Node.js, Express, and MongoDB.

## Features

- **Authentication:** User signup/login with JWT and Social Login (Google & Facebook) using Passport.js.
- **Database:** MongoDB connection using Mongoose for data modeling.
- **Game Data:** Integration with the IGDB API to fetch game details.
- **Payments:** Stripe integration for membership plan upgrades (Silver/Gold).
- **Media:** Cloudinary integration for image uploads.
- **Email:** Automated emails using Nodemailer.
- **Security:** CORS configuration and secure HTTP headers.

## Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- Passport.js (OAuth 2.0)
- Stripe API
- Cloudinary
- Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas Account (or local MongoDB instance)
- Cloudinary Account
- Stripe Account (for payment testing)
- IGDB (Twitch Developer) Account

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd gamepro-backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and configure the following variables (reference `.env.example`):

    ```env
    # Server Configuration
    PORT=5000
    MONGO_URI=your_mongodb_connection_string

    # Authentication
    JWT_SECRET=your_super_secret_key
    JWT_EXPIRES_IN=7d

    # Frontend URL (for CORS and Redirects)
    CLIENT_URL=http://localhost:5173

    # Social Login (Google)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_CALLBACK_URL=/api/auth/google/callback

    # Social Login (Facebook)
    FACEBOOK_APP_ID=your_facebook_app_id
    FACEBOOK_APP_SECRET=your_facebook_app_secret
    FACEBOOK_CALLBACK_URL=your_production_url/api/auth/facebook/callback

    # IGDB (Game Data)
    IGDB_CLIENT_ID=your_twitch_client_id
    IGDB_CLIENT_SECRET=your_twitch_client_secret

    # Payments (Stripe)
    STRIPE_SECRET_KEY=your_stripe_secret_key

    # Image Uploads (Cloudinary)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Email Service (Nodemailer)
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_email_app_password
    EMAIL_FROM="GamePro Support <no-reply@gamepro.com>"
    ```

## Running the Server

- **Development Mode (with Nodemon):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```

The server will typically run on `http://localhost:5000`.

## API Routes Overview

- `/api/auth` - Authentication (Login, Signup, Social Auth)
- `/api/profile` - User profile management
- `/api/games` - Game data interactions
- `/api/igdb` - Direct IGDB data fetching
- `/api/payment` - Stripe checkout sessions
- `/api/admin` - Admin dashboard routes
