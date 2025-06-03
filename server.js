import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
dotenv.config();
connectDB();
import authRoutes from "./routes/AuthRoutes.js"



const app = express();
// without express.json() body data will be undefined
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
});


