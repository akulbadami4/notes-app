
# Node.js Express Notes App

This is a simple and secure Node.js Express application for managing notes. Users can perform CRUD operations on their notes, along with functionality such as searching and sharing notes with other users.

## Tech Stack
Node,Express,MongoDB
Express is an open-source web appliation framework that is lightweight which privides a simple routing for requests and middleware to extend the functionality of the application.
Authentication is implemented with the help of bcrypt to salt and hash the password and jsonwebtoken is used to generate a jwt token once the user is authenticated, making the application secure.
Simple rate limiting is implemented using express-rate-limit,a package that simplifies the procedure for adding rate limiting based on user IP.



## Getting Started

1. Clone this repository:

   ```
   git clone https://github.com/akulbadami4/notes-app.git
   cd notes-app
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root of the project and add these necessary environment variables:

   ```.env
   PORT = 3000
   MONGODB_CONNECTION=mongodb://127.0.0.1:27017/notesApp
   SECRET_KEY="12345678"
   ```

4. Run the application:

   ```
   node index.js
   ```

   The server will start at http://localhost:3000 (or the port specified in your `.env` file).

## Usage

### API Endpoints

- `POST/api/auth/signup`: New user sign up
- `POST/api/auth/login`: User login

- `GET/api/notes`: Retrieve all notes for the user
- `GET/api/notes/:id`: Retrieve a specific note by ID.
- `POST/api/notes`: Create a new note.
- `PUT/api/notes/:id`: Update a note by ID.
- `DELETE/api/notes/:id`: Delete a note by ID.
- `POST/api/notes/:id/share`: Share the note with another user.
- `POST/api/search?q=query`: Search for notes based on a query.


### Authentication

- The application uses JSON Web Tokens (JWT) for user authentication.
- Users need to include a valid JWT in the headers of their requests to access protected routes that can be obtained after logging in

### Rate limiter
 - The application has a simple rate limiter implemented that limits requests to not more than 15 requests per minute for testing purposes.

## Dependencies

- **bcrypt** (v5.1.1): Library for hashing passwords.
- **dotenv** (v16.3.1): Module to load environment variables from a .env file.
- **express** (v4.18.2): Web application framework for Node.js.
- **express-rate-limit** (v7.1.5): Middleware to rate limit requests.
- **jsonwebtoken** (v9.0.2): Library for generating and verifying JSON Web Tokens (JWT).
- **mongoose** (v8.0.3): MongoDB object modeling for Node.js.
- **node** (v21.2.0): JavaScript runtime for executing JavaScript code server-side.
- **nodemon** (v3.0.2): Utility to monitor for changes in your source code and automatically restart the server.






