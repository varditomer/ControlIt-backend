# ControlIt Server

ControlIt is a server-side project built with TypeScript, Express.js, Node.js, MySQL and JWT Tokens.  
It provides a backend solution for managing pre-defined users control systems.

## Features

- Authentication and authorization for user access control
+ JWT tokens implementation for highly secure system
- Account API to view all related partners accounts of a specific user
- Integration with MySQL database for data persistence

## Prerequisites

To run ControlIt locally, you'll need to have the following software installed on your machine:

- Node.js (version 12 or higher)
- MySQL (version 5.7 or higher)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/varditomer/ControlIt-backend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd ControlIt-backend
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Configure application's parameters (.env file):
  Rename the .env.example file to .env.
  Update the .env file with your MySQL database credentials.
### example .env file needed
   ```bash
  PORT=3030
  DB_PORT=3306
  DB_HOST="example_host"
  DB_USER="example_user"
  DB_PWD="example_password"
  DB_NAME="example_database"
  JWT_SECRET="example_jwt_secret"
  JWT_EXPIRES_IN="15m"
   ```

5. Set up the MySQL database (create db, create db scheme, populate db with demo data):
   ```bash
   npm run setup-db
   ```  

6. Start the server:
   ```bash
   npm start
   ```
