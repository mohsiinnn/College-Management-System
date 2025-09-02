# College Management System

A full-stack web application built to manage core academic and administrative tasks in a college. This system supports role-based dashboards and CRUD operations for students, classes, attendance, and more, with a focus on scalability and modern web development practices.

---

## Features

- **Role-Based Access**: Admin, Super Admin, Teacher, and Student dashboards
- **User Authentication & Authorization**: Secure login, registration, and role checks
- **Student Management**: 
  - Add, view, edit, or remove student profiles
  - Assign students to classes
  - View detailed student information
- **Class Management**: 
  - Create and manage classes
  - Assign students to classes
- **Attendance Management**: 
  - Mark and view attendance for students (individually and in batches)
  - Attendance records linked to subjects and dates
- **Subject Management**: 
  - Manage subjects for classes
- **Notifications System**: In-app notifications on dashboards
- **Search and Filtering**: Quickly find students and classes

---

## Tech Stack

- **Frontend**: React.js, Redux, JavaScript, CSS/HTML, Tailwind
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Other**: JWT authentication, RESTful API, CORS, Middleware for role checks

---

## Project Structure

```
root/
│
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/           # Admin, Student, and other role-based pages
│   │   ├── redux/           # Redux actions, reducers, services
│   │   └── components/      # Reusable UI components
│   └── public/
│
├── server/          # Node/Express backend
│   ├── config/             # Database and other configs
│   ├── controller/         # Business logic for entities
│   ├── middleware/         # Auth, role checks
│   ├── models/             # Mongoose schemas (User, Student, Class, Subject, etc.)
│   ├── routes/             # API route definitions
│   └── server.js           # Entry point
│
└── README.md
```

---

## Acknowledgements

- Inspired by needs of academic institutions seeking digital transformation.
- Built with the JavaScript ecosystem.