# Role Based Access Control Authentication System

A secore backend authentication service built with Node.js + Express, featuring user registration, login, and role-based access control using JWT tokens.

-----

## Features

  * User Registration & Login
  * Password encryption using bcrypt
  * JWT-based authentication (access tokens)
  * Role-based route protection (e.g., Admin, Legal, PM, Sales, etc.)
  * Middleware to validate and authorize user access
  * Fetch logged-in user profile
  * Admin only endpoints to fetch all users data or make any changes to them
  * Pre-seeded database with some sample users and roles

-----

## Tech Stack

  * **Node.js:** JavaScript runtime environment.
  * **Express.js:** Web application framework for Node.js.
  * **SQLite:** Local file-based relational database.
  * **JWT (JSON Web Tokens):** For secure user authentication.
  * **BCRYPT:** For secure password encryption.

-----

## Setup Instructions

To get this project up and running on your local machine, follow these steps:

### Prerequisites

  * Node.js

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/sanyamgoel10/Role-Based-Authentication-System.git
    cd Role-Based-Authentication-System
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the root directory of the project with the following variables:

    ```
    PORT=3000
    BCRYPT_ENCRYPTION_ROUNDS=12
    JWT_SECRET_KEY"your_jwt_secret_key"
    ```

      * `PORT`: The port on which the server will run (e.g., 3000).
      * `BCRYPT_ENCRYPTION_ROUNDS`: The bcrypt algorithm encryption rounds.
      * `JWT_SECRET_KEY`: A strong, random string used for signing JWTs. **Generate a secure one\!**

### Running the Application

1.  **Start the server:**

    ```bash
    node app
    ```

    The server will start on the port specified in your `.env` file (default: `http://localhost:3000`).

-----

## API Endpoints

  * **`POST /api/register`**

      * **Description:** Registers a new user.
      * **Request Body:**
        ```json
        {
          "email": "sample_user@gmail.com",
          "name": "Sample User",
          "password": "sample_password",
          "role": "Sales"   // Default allowed values are -> Admin, Legal, PM, Sales, HR, Support, Operations
        }
        ```
      * **Response:**
        ```json
        {
            "status": 1,
            "msg": "User registered successfully",
            "userId": 1,
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGUiOiJBZG1pbiIsInRpbWUiOiJUaHUgQXVnIDIxIDIwMjUgMDk6NTI6MDYgR01UKzA1MzAgKEluZGlhIFN0YW5kYXJkIFRpbWUpIiwiaWF0IjoxNzU1NzUwMTI2LCJleHAiOjE3NTU3NTM3MjZ9.-qZWH0lsxc4RGgmB0TOnQ_X67XdjNXZTnMYV20r1J1M"
        }
        ```

  * **`POST /api/login`**

      * **Description:** Logs in an existing user.
      * **Request Body:**
        ```json
        {
          "email": "sample_user@gmail.com",
          "password": "sample_password"
        }
        ```
      * **Response:**
        ```json
        {
          "status": 1,
          "msg": "User logged in successfully",
          "userId": 1,
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGUiOiJBZG1pbiIsInRpbWUiOiJUaHUgQXVnIDIxIDIwMjUgMDk6NTI6MDYgR01UKzA1MzAgKEluZGlhIFN0YW5kYXJkIFRpbWUpIiwiaWF0IjoxNzU1NzUwMTI2LCJleHAiOjE3NTU3NTM3MjZ9.-qZWH0lsxc4RGgmB0TOnQ_X67XdjNXZTnMYV20r1J1M"
        }
        ```

  * **`GET /api/profile`**

      * **Description:** Fetches the logged-in user profile
      * **Authentication:** Requires a valid JWT generated while register/login in the `Authorization` header (`Bearer <token>`).
      * **Response:**
        ```json
        {
            "status": 1,
            "msg": "User profile fetched successfully",
            "data": {
                "userId": 1,
                "email": "sample_user@gmail.com",
                "name": "Sample User",
                "role": "Sales"
            }
        }
        ```

  * **`GET /api/admin/users`**

      * **Description:** Admin only API to list all users and their profile
      * **Authentication:** Requires a valid JWT generated while register/login in the `Authorization` header (`Bearer <token>`).
      * **Response:**
        ```json
        {
            "status": 1,
            "msg": "All users data fetched successfully",
            "data": [
                {
                    "userId": 1,
                    "email": "admin@gmail.com",
                    "name": "Administrator",
                    "role": "Admin"
                },
                {
                    "userId": 2,
                    "email": "test@gmail.com",
                    "name": "Test User",
                    "role": "Admin"
                },
                {
                    "userId": 3,
                    "email": "legal_user@gmail.com",
                    "name": "Legal User",
                    "role": "Legal"
                },
                {
                    "userId": 4,
                    "email": "pm_user@gmail.com",
                    "name": "Product Manager User",
                    "role": "PM"
                },
                {
                    "userId": 5,
                    "email": "sales_manager@gmail.com",
                    "name": "Sales Manager",
                    "role": "Sales"
                },
                {
                    "userId": 6,
                    "email": "sango@gmail.com",
                    "name": "Legal",
                    "role": "Admin"
                }
            ]
        }
        ```
    
  * **`PUT /api/admin/updateUserProfile/:id`**
      * **Description:** Admin only API to edit any user profile
      * **Authentication:** Requires a valid JWT generated while register/login in the `Authorization` header (`Bearer <token>`).
      * **Request Body:**
        ```json
        {
            "email": "sango@gmail.com",
            "name": "Legal",
            "role": "Admin"
        }
        ```
        All the params in body are optional. Any field can be updated.
      * **Response:**
        ```json
        {
            "status": 1,
            "msg": "Profile updated successfully"
        }
        ```
---

## Roles
The system supports multiple roles which can be extended as needed from the `/config/config.js` file.
  * **Admin ->** Full access including managing users
  * **Legal/PM/Sales/Others ->** Access to only few routes.
Route validation happens via a middleware.

---

## Pre-Seeded Users
Some of the users data has been pre-seeded in the database using some insert queries at the starting of the server. The user details are below:-

| Role | Email | Password |
|----- |-------|----------|
| Admin | admin@gmail.com | password123 |
| Admin | test@gmail.com | password123 |
| Legal | legal_user@gmail.com | password123 |
| PM | pm_user@gmail.com | password123 |
| Sales | sales_manager@gmail.com | password123 |

---

## Design Decision & Assumptions
  * Used SQLite for easy local setup (lightweight & file-based DB). Can be swapped with PostgreSQL/MySQL by changinf config.
  * Passwords are never stored in plaintext. They should be stored in encrypted form using bcrypt hashing.
  * JWT token-based system chosen over sessions for stateless scalability.
  * Middleware based system that ensures minimal duplication of access control logic and reduces load on database.