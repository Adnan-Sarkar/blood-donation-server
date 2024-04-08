# Blood Donation Server

![](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white) ![](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

The Blood Donation Application Server is a robust server-side application designed to facilitate blood donation processes efficiently. It provides user authentication and authorization features using JSON Web Tokens (JWT) to ensure secure access to its functionalities.

The main purpose of the application is to connect blood donors with those in need by enabling users to find blood donors and request blood donations. Users can register an account, update their profiles, and participate in blood donation requests seamlessly.

## Table of Contents

- [Key Features](#key-features)
- [Technology Used](#technology-used)
- [API Documentation](#api-documentation)
- [Live Server Test](#live-server-test)
  - [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation locally](#installation-locally)
  - [Running the Application](#running-the-application)

## Key Features

Every route within the system is safeguarded through JWT token verification and role based authorization, guaranteeing secure access and protection against unauthorized usage.

Database Tables:

1. **user:**
   Responsible for storing user information securely, facilitating a reliable authentication system.

2. **request:**
   Manages blood donation requests, tracking donor and requester information, as well as request status.

3. **profile:**
   Stores user profile information, including bio, age, and last donation date.

## Technology Used

- **Express.js**
- **Prisma**
- **JWT (JSON Web Tokens)**
- **Bcrypt**
- **Zod**
- **Dev Tools**
  - **TypeScript**
  - **ts-node-dev**

## API Documentation

This documentation, generated with Postman.

```bash
  https://documenter.getpostman.com/view/15069256/2sA35MzzC9
```

Or,

[Click API Documentation](https://documenter.getpostman.com/view/15069256/2sA35MzzC9)

## Live Server Test

To test the live API endpoints, I prefer using [Postman](https://www.postman.com/) for testing with better user experience.

### Live API

```bash
https://blood-donation-server-by-adnan-sarkar.vercel.app/
```

## API Endpoints

for `user`

- **POST** /api/register
- **POST** /api/login

for `profile`

- **GET** /api/my-profile
- **PUT** /api/my-profile

for `request`

- **POST** /api/donation-request
- **GET** /api/donation-request
- **GET** /api/donor-list
- **PUT** /api/donation-request/:requestId

## Getting Started

These instructions will help you set up and run the application on your local machine.

### Prerequisites

- Node.js and npm installed on your machine.

### Installation locally

1. Clone the repository:

```bash
https://github.com/Porgramming-Hero-web-course/l2-b2-fullstack-track-assignment-8-Adnan-Sarkar.git
```

2. Navigate to the project directory:

```bash
cd blood-donation-server
```

3. Install dependencies:

```bash
npm install
```

4. Create a .env file in the root directory and configure environment variables:

```bash
DATABASE_URL=...
PORT=...
JWT_ACCESS_SECRET=...
JWT_ACCESS_EXPIRES_IN=...
SALT_ROUNDS=...
```

### Running the Application

1. Convert the typescript file to javascript file

```bash
npm run build
```

2. Running typescript in development environment

```bash
npm run start
```

3. Running javascript in production environment

```bash
node ./dist/server.js
```

<br><br>

Thank you for exploring the `Blood Donation Server` backend application! Feel free to provide feedback, report issues.

## 📢 Social Links

- [![](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/adnan-sarkar-8b54341a0/)
- [![](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/AdnanSarkar14)
- [![](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/adnansarkaraduvai/)
- [![](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/_a_d_u_v_a_i_/)
- [![](https://img.shields.io/badge/Hashnode-2962FF?style=for-the-badge&logo=hashnode&logoColor=white)](https://adnansarkar.hashnode.dev/)
