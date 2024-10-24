 
## Overview

This application is a Course Management System developed using the MERN stack (MongoDB, Express, React, Node.js). It allows users to create courses, organize them into chapters and topics, and engage in discussions through a forum module.

 
## Features

1. **User Authentication**
   - JWT-based authentication with email/password.
   - Future implementation of social media sign-in/signup (Google, GitHub).
   - Login from multiple devices with session management.

2. **Course Management**
   - Create and manage courses with title, description, duration, and category.
   - Implement CRUD operations for courses, chapters, and topics.

3. **Chapter and Topic Management**
   - Create chapters within courses.
   - Dynamic addition of topics within chapters with attachments.

4. **Forum Module**
   - Create discussions and comment on them.
   - Like/unlike functionality for discussions, comments, and replies.

5. **Data Management**
   - Pagination for listing courses, chapters, topics, and discussions.
   - Server-side data table for viewing and editing data with search and export options.

6. **User Interface**
   - Responsive design with a user-friendly interface.

## Tech Stack

- **Frontend:** React, Redux Toolkit (RTK Query), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Pradeep-Prady/course.git
   ```

2. **Navigate into the project directory:**

   ```bash
   cd course 
   ```

3. **Install dependencies:**

   For the backend:
   ```bash
   cd backend
   npm install
   ```

   For the client:
   ```bash
   cd client
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env` file in the backend directory with the following variables:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. **Run the application:**

   In the backend directory, run:

   ```bash
   npm run dev
   ```

   In the client directory, run:

   ```bash
   npm start
   ```

## Usage

- Register and log in to the application.
- Create new courses, chapters, and topics.
- Engage in discussions through the forum module.
- Access your dashboard to view statistics and manage your courses.

## API Documentation

Refer to the API documentation for details on available endpoints and usage.

- **Authentication**
- **Courses**
- **Chapters**
- **Topics**
- **Discussions**

 