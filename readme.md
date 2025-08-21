# General

This app is course work for part 8 of the [Full Stack Open](https://fullstackopen.com) MOOC. It includes 24 of the 26 exercises; the last two are not included.

The application consists of both the front and backend code for a simple library app using GraphQL (Apollo Server and Client).

## Installation Instructions

## Backend Setup

1. **Navigate to the backend directory:**

```bash
cd library-backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env` file:**

```bash
touch .env
```

Add required environment variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PASSWORD=hardcoded_password_for_testing
```

4. **Start the backend server:**

```bash
npm run dev
```

## Frontend Setup

1. **Navigate to the frontend directory:**

Assuming you're still in the backend directory:

```bash
cd ../library-frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the frontend development server:**

```bash
npm run dev
```

## License

This project is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

You are free to share and adapt the material for any purpose, even commercially, as long as you provide appropriate credit.
