<<<<<<< HEAD
Emy's Store is a small-business inventory and point-of-sale system.

## MERN backend setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`, then set `MONGODB_URI` and `JWT_SECRET`.
   For local MongoDB, use `mongodb://127.0.0.1:27017/emy-store`.
   Generate a strong JWT secret for deployment.

3. Start MongoDB, then run both the React app and API:

   ```bash
   npm run dev:full
   ```

4. Open the Vite URL printed in the terminal (normally `http://localhost:5173`).

The API runs on `http://localhost:5000`. Authentication uses an HTTP-only cookie,
passwords are hashed with bcrypt, and store data is saved in MongoDB.
=======
This is CasaSync. A household inventory monitoring system.
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
