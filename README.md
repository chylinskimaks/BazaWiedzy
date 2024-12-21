
# Knowledge Base App

A simple React-based application to manage notes with tags. It allows users to create, edit, delete, and search for notes. Users can also sign up, log in.

## Features

- **Authentication**: Sign Up and Login functionality for users.
- **Notes Management**: Add, edit, and delete notes with a title, content, and tags.
- **Search Functionality**: Search notes by keywords.
- **Responsive UI**: Designed to be responsive and mobile-friendly.

## Technologies

- **Frontend**: React, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **State Management**: React's useState and useEffect
- **Authentication**: JWT Tokens
- **UI**: Tailwind CSS

## Installation

### 1. Clone the repository

Clone the project to your local machine.

```bash
git clone https://github.com/chylinskimaks/BazaWiedzy.git
```

### 2. Install Dependencies

Navigate into the project directory and install the dependencies.

```bash
cd knowledge-base-app
npm install
```

### 3. Set up Backend (if not already set up)

You need to set up the backend API for user authentication, notes management, and other server-side operations. This may involve setting up a Node.js server with endpoints for login, registration, and note operations (`/login`, `/create-account`, `/add-note`, `/edit-note`, etc.).

Ensure your backend API is configured to work with the frontend.

### 4. Configure the Environment

Create a `.env` file and configure the necessary environment variables, such as:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 5. Run the Application

To run the application locally, use the following command:

```bash
backend:
npm start

frontend:
npm run dev
```

Navigate to `http://localhost:5173/login` to view the app.

## Features Walkthrough

### 1. **Login and Registration**
- Users can sign up and log in using an email and password.
- JWT tokens are stored in `localStorage` to manage user authentication.

### 2. **Dashboard (Home Page)**
- Displays a list of all notes.
- Users can search for notes by keywords using the search bar.
- Users can add, edit, or delete notes.
- Notes include a title, content, and tags.

### 3. **Add/Edit Note**
- Users can create new notes or edit existing ones.
- Tags can be dynamically added or removed while creating or editing notes.

### 4. **Profile**
- Displays the logged-in user's profile information.
- Users can log out from the profile section.

### 5. **Tags**
- Users can add tags to notes to organize and categorize them.
- Tags are managed while creating or editing notes.


## API Endpoints (Backend)

- **POST `/login`**: Log in with email and password.
- **POST `/create-account`**: Register a new user.
- **GET `/get-user`**: Get the current user information.
- **GET `/get-all-notes`**: Get all notes for the logged-in user.
- **POST `/add-note`**: Add a new note.
- **PUT `/edit-note/:id`**: Edit an existing note by ID.
- **DELETE `/delete-note/:id`**: Delete a note by ID.
- **GET `/search-notes`**: Search for notes by a query.

## Contributors

- Maksymilian Chyliński
- Paweł Tyc
- Mikołaj Gulczyński

