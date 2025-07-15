#  User Management API

A secure REST API for managing user accounts, roles, and JWT-based authentication.

>  Built with Node.js + Express, this project demonstrates role-based access control (RBAC) and stateless login via JSON Web Tokens.

---

##  Features

-  Create users with role: `user`, `moderator`, `admin`
-  Login endpoint returns JWT (24h TTL)
-  Secure endpoints with JWT middleware
-  Admin-only access to `edit` and `delete` any user
-  Users can edit their own profiles

---

##  Tech Stack

- Node.js + Express
- MongoDB (Mongoose)
- JWT (`jsonwebtoken`)
- pbkf2
- dotenv


## 📁 Project Structure
<img width="303" height="443" alt="image" src="https://github.com/user-attachments/assets/2cec3c34-441a-4cfd-bd16-8d7044bfbcc8" />

---

##  Authentication

### POST `/login`

```json
{
  "email": "user@example.com",
  "password": "123456"
}

 ```
 Response:
 {
  "token": "jwt_token_here"
}

| Route               | Role Required |
| ------------------- | ------------- |
| `GET /users/me`     | user / any    |
| `PUT /users/:id`    | self / admin  |
| `DELETE /users/:id` | admin only    |

JWT must be sent in the Authorization header:
Authorization: Bearer <token>

Example ENV
```env
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h
```
 Getting Started
- git clone https://github.com/SupBr1ght/user-management-api.git
- cd user-management-api
- npm install
- cp .env.example .env
- npm start



