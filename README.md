
# Description

Todo-API is a backend API application built with Node.js and Express.js. It provides endpoints for managing Todos, user authentication, and other functionalities.

# Features
User authentication with JWT token
CRUD operations for Todos
Error handling with jsend format
Swagger documentation for API endpoints

# Application Installation and Usage Instructions
Clone the repository: git clone <repository-url>
Install dependencies: npm install

 # Usage
Start the server: npm start
Access the API endpoints using a tool like Postman or Swagger UI.

# Testing
<Run tests using Jest>:
npm test

# Environment Variables

TOKEN_SECRET=<your-secret-key>
HOST = "localhost"
ADMIN_USERNAME = ""
ADMIN_PASSWORD = ""
DATABASE_NAME = "myTodo"
DIALECT = "mysql"
PORT = "3000"


# Additional Libraries/Packages

<cookie-parser>: Middleware for parsing cookies in Express.js applications.
<debug>: A debugging utility module for Node.js applications.
<dotenv>: Loads environment variables from a .env file into process.env.
<ejs>: Embedded JavaScript templates for server-side rendering in Express.js applications.
<http-errors>: Creates HTTP error objects with additional properties for Express.js applications.
<morgan>: HTTP request logger middleware for Express.js applications.
<mysql>: MySQL client for Node.js. Allows interaction with MySQL databases.
<mysql2>: A fast MySQL client library for Node.js, compatible with MySQL's binary protocol.
<sequelize>: A promise-based Node.js ORM for MySQL, PostgreSQL, SQLite, and other databases.
<swagger-autogen>: Generates Swagger documentation for your Express.js routes automatically.
<swagger-ui-express>: Middleware to serve Swagger UI for Express.js applications, allowing users to visualize and interact with the API documentation.


# NodeJS Version Used

Node.js v18.16.0


# Swagger Documentation link

http://localhost:3000/doc/





