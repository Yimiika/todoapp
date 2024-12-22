# Todo Application

This is a simple Todo Application built with Node.js, Express, and MongoDB. Users can add, view, and delete tasks while managing the state of each task (Pending or Completed). The app also features user authentication, allowing users to log in and view their personal tasks.

## Features

- **User Authentication**: Users can log in to access their tasks.
- **Task Management**: Users can add, update, and delete tasks.
- **Task States**: Tasks can be marked as 'Pending' or 'Completed'.
- **Responsive Design**: The app is responsive and works on both desktop and mobile devices.
- **Error Handling**: Provides basic error messages when necessary.

## Technologies Used

- **Node.js**: JavaScript runtime used to build the application.
- **Express.js**: Web framework for building the API and handling routes.
- **MongoDB**: NoSQL database to store user and task data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Passport.js**: Authentication middleware for handling user login.
- **EJS**: Templating engine for rendering HTML views.
- **CSS**: For styling the frontend, with a focus on mobile responsiveness.
  
## Installation

To run this application locally, follow the steps below:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/Yimiika/todoapp.git
    cd todoapp
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Create a `.env` file** in the root directory with the following variables:

    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/todoapp
    SESSION_SECRET=your-session-secret
    ```

    - `MONGO_URI`: Your MongoDB connection string (you can use a local instance or a cloud MongoDB service like MongoDB Atlas).
    - `SESSION_SECRET`: Secret for managing session cookies.

4. **Run the application**:

    ```bash
    npm start
    ```

    The application should now be running on `http://localhost:3000`.

## Usage

- **Home Page**: Users will be redirected to the login page if not logged in.
- **Login Page**: Users can log in using their credentials.
- **Tasks Page**: After logging in, users can view their tasks, add new ones, and delete tasks. Tasks can be marked as "Pending" or "Completed".
  
## Routes

- **GET** `/login` - Render login page.
- **POST** `/login` - Authenticate user and redirect to tasks page.
- **GET** `/tasks` - View user's tasks.
- **POST** `/tasks/add` - Add a new task.
- **POST** `/tasks/:id` - Update a task (mark as completed).
- **DELETE** `/tasks/:id` - Delete a task.
- **POST** `/logout` - Log out the current user.

