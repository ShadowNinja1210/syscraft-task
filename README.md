
# Project: Syscraft Admin Portal

This is a full-stack project for managing users and movies with authentication and role-based access. The backend is built using **Express.js** and **MongoDB**, while the frontend is built using **React.js** with **Vite**.

---

## **Features**

### Backend (Server)
- User authentication with JWT.
- Role-based access control (Admin/User).
- CRUD operations for managing users and movies.
- Protected routes to secure API endpoints.

### Frontend (Client)
- User login.
- Admin dashboard to manage resources.
- Role-based routing for admins and regular users.
- Responsive design with a light theme.

---

## **Getting Started**

Follow these instructions to set up the project locally on your machine.

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

## **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone https://github.com/ShadowNinja1210/syscraft-task.git
cd syscraft-task
```

### **2. Install Dependencies**

#### Install server dependencies:
```bash
cd server
npm install
```

#### Install client dependencies:
```bash
cd client
npm install
```

---

### **3. Environment Configuration**

#### Backend (Server)
1. Create a `.env` file in the `server` directory:
   ```bash
   cd server
   touch .env
   ```

2. Add the following environment variables to the `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

3. Replace `mongodb_uri` with your MongoDB database cluster URI.



---

### **4. Running the Project**

#### Start the Server:
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`.

#### Start the Client:
```bash
cd client
npm run dev
```
The client will start on `http://localhost:5173`.

---


