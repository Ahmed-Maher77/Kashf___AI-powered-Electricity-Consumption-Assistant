import express from "express";
import dotenv from "dotenv";
import startServerWithDB from "./config/startServerWithDB.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import userRoutes from "./src/modules/user.routes.js";


// ======= Initialize Express app =======
const app = express();
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// ======= Middlewares =======
app.use(express.json());     // Parse JSON request bodies
app.use(cors(corsOptions));  // Apply CORS


// ======= Routes =======
// Home
app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "public/views/home.html"))
})

// Auth routes
app.use("/api/auth", userRoutes);

// Not Found
app.use((req, res) => {
    res.status(404).sendFile(join(__dirname, "public/views/404.html"));
});


// ======= Global Error Handler =======
app.use((err, req, res, next) => {
    const { statusCode, message } = err;
    res.status(statusCode || 500).json({
        error: message || "Internal Server Error"
    });
})



// ======= Start the server after connecting to the database =======
const PORT = process.env.PORT || 3000;
// Start the server after database connection
(async function () {
    await startServerWithDB(app, PORT);
})();