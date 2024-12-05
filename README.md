# AI Worker API on Cloudflare

Welcome to the AI Worker API project! This project is designed to provide a serverless API for interacting with AI models using Cloudflare Workers. It leverages the Hono framework for building web applications and integrates with a D1 database for data storage.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Usage Flow](#usage-flow)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and authentication
- API key management
- Chat completions using AI models
- CORS support for cross-origin requests
- Built with TypeScript for type safety

## Getting Started

To get started with the project, follow these steps:

### Prerequisites

- Node.js (version >= 16.9.0)
- Wrangler CLI for deploying Cloudflare Workers
- A Cloudflare account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/gifflet/ai-worker-api-cloudflare.git
   cd ai-worker-api-cloudflare
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables. Create a `.env` file in the root directory and add your configuration:

   ```plaintext
   JWT_SECRET=your-secret-key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

## API Endpoints

### User Registration

- **POST** `/register`
  - Request body: `{ "email": "user@example.com", "password": "yourpassword" }`
  - Response: `{ "message": "User created", "token": "your_jwt_token" }`

### User Login

- **POST** `/login`
  - Request body: `{ "email": "user@example.com", "password": "yourpassword" }`
  - Response: `{ "token": "your_jwt_token" }`

### Create API Key

- **POST** `/api-keys/create`
  - Request body: `{ "name": "API Key Name" }`
  - Response: `{ "key": "your_api_key", "message": "API key created successfully. Save this key as it won't be shown again." }`
  - **Authorization**: Bearer token required in the `Authorization` header.

### List API Keys

- **GET** `/api-keys/list`
  - Response: `[ { "id": "key_id", "name": "API Key Name", "active": true, "created_at": "timestamp" } ]`
  - **Authorization**: Bearer token required in the `Authorization` header.

### Revoking API Key

- **POST** `/api-keys/revoke/:keyId`
  - Response: `{ "message": "API key revoked successfully" }`
  - **Authorization**: Bearer token required in the `Authorization` header.

### Chat Completions

- **POST** `/chat/completions`
  - Request body: `{ "messages": [ { "role": "user", "content": "Hello!" } ] }`
  - Response: `{ "response": "AI response here" }`

## Authentication

This API uses JWT for authentication. You need to include the token in the `Authorization` header as a Bearer token for protected routes.

Example:

```http
Authorization: Bearer your_jwt_token
```

## Database Schema

The project uses a D1 database with the following schema:

- **Users Table**
  - `id`: TEXT PRIMARY KEY
  - `email`: TEXT UNIQUE NOT NULL
  - `password`: TEXT NOT NULL
  - `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP

- **API Keys Table**
  - `id`: TEXT PRIMARY KEY
  - `user_id`: TEXT NOT NULL
  - `key`: TEXT UNIQUE NOT NULL
  - `name`: TEXT NOT NULL
  - `active`: BOOLEAN DEFAULT true
  - `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP

## Usage Flow

This section outlines the typical flow of using the AI Worker API, from user registration to making chat requests.

### 1. User Registration

To start using the API, a user must first register. Send a POST request to the `/register` endpoint with the user's email and password.

**Request:**
```bash
curl -X POST http://localhost:8787/register \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "yourpassword"
}'
```

**Response:**
```json
{
  "message": "User created",
  "token": "your_jwt_token"
}
```

### 2. User Login

After registration, the user can log in to obtain a JWT token. Send a POST request to the `/login` endpoint with the user's credentials.

**Request:**
```bash
curl -X POST http://localhost:8787/login \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "yourpassword"
}'
```

**Response:**
```json
{
  "token": "your_jwt_token"
}
```

### 3. Create API Key

Once logged in, the user can create an API key. Send a POST request to the `/api-keys/create` endpoint with a name for the key.

**Request:**
```bash
curl -X POST http://localhost:8787/api-keys/create \
-H "Authorization: Bearer your_jwt_token" \
-H "Content-Type: application/json" \
-d '{
  "name": "API Key Name"
}'
```

**Response:**
```json
{
  "key": "your_api_key",
  "message": "API key created successfully. Save this key as it won't be shown again."
}
```

### 4. Making Chat Completions

With the API key, the user can now make chat requests. Send a POST request to the `/chat/completions` endpoint with the messages to be processed.

**Request:**
```bash
curl -X POST http://localhost:8787/chat/completions \
-H "Authorization: Bearer your_jwt_token" \
-H "Content-Type: application/json" \
-d '{
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ]
}'
```

**Response:**
```json
{
  "response": "AI response here"
}
```

### 5. Revoking API Key

If the user wants to revoke an API key, they can send a POST request to the `/api-keys/revoke/:keyId` endpoint.

**Request:**
```bash
curl -X POST http://localhost:8787/api-keys/revoke/keyId \
-H "Authorization: Bearer your_jwt_token"
```

**Response:**
```json
{
  "message": "API key revoked successfully"
}
```

### Conclusion

This flow provides a comprehensive guide to using the AI Worker API, from user registration to making chat requests and managing API keys.

## Testing

To run the tests, use the following command:

```bash
npm run test
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
