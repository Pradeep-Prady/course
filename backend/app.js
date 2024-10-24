import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";
import globalResponseController from "./src/utils/response-handlers/global-response-controller.js";
import userRoute from "./src/routes/userRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import chapterRoutes from "./src/routes/chapterRoutes.js";
import discussionRoutes from "./src/routes/discussionRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:3000"];

app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads and public assets
app.use("/src/uploads", express.static(path.join(__dirname, "src/uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/users", userRoute);
app.use("/api/courses", courseRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/discussions", discussionRoutes);
app.use(globalResponseController);

export default app;
