import "dotenv/config";
import express from "express";
import startServerWithDB from "./config/startServerWithDB.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import adminRoutes from "./src/modules/admin.routes.js";
import userRoutes from "./src/modules/user.routes.js";
import activityRoutes from "./src/modules/activity.routes.js";
import meterRoutes from "./src/modules/meter.routes.js";





// ======= Initialize Express app =======

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);





// ======= Middlewares =======

app.use(express.json());

app.use(cookieParser());

app.use(cors(corsOptions));





// ======= Routes =======

// Home

app.get("/", (req, res) => {

    res.sendFile(join(__dirname, "public/views/home.html"))

})



// Auth routes

app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/meters", meterRoutes);



// Not Found

app.use((req, res) => {

    res.status(404).sendFile(join(__dirname, "public/views/404.html"));

});





// ======= Global Error Handler =======

app.use((err, req, res, next) => {
    console.error("Global Error Handler caught:", err);
    const { statusCode, message } = err;
    res.status(statusCode || 500).json({
        error: message || "Internal Server Error",
    });
})







// ======= Start the server after connecting to the database =======

const PORT = process.env.PORT || 3000;

// Start the server after database connection

(async function () {

    await startServerWithDB(app, PORT);

})();

