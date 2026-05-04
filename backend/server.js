import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { MongoMemoryServer } from "mongodb-memory-server";
import Admin from "./models/adminModel.js";
import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import { swaggerUi, swaggerDocs } from "./openapi/index.js"

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both ports
  credentials: true,
}));

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🧩 Routes

app.use("/api/auth", authRoutes);


app.use("/api/donor", donorRoutes);

app.use("/api/facility", facilityRoutes);

app.use("/api/admin", adminRoutes);



import bloodLabRoutes from "./routes/bloodLabRoutes.js";
app.use("/api/blood-lab", bloodLabRoutes);


import hospitalRoutes from "./routes/hospitalRoutes.js";
app.use("/api/hospital", hospitalRoutes);


// 🗄️ DB Connection
let mongod = null;
let mongoUri = process.env.MONGO_URI;

const startServer = async () => {
  if (!mongoUri) {
    console.log("No MONGO_URI provided, starting in-memory MongoDB...");
    mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
  }

  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log("MongoDB Connected ✅");
      if (!process.env.MONGO_URI) {
        try {
          const adminExists = await Admin.findOne({ email: "suraj@admin.com" });
          if (!adminExists) {
            const admin = new Admin({
              name: "Suraj Savle",
              email: "suraj@admin.com",
              password: "bbms@admin",
              role: "admin",
            });
            await admin.save();
            console.log("Admin seeded automatically in memory DB ✅");
          }
        } catch (e) {
          console.error("Failed to seed admin", e);
        }
      }

      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
    })
    .catch((err) => console.log("MongoDB Error ❌", err));
};

startServer();
