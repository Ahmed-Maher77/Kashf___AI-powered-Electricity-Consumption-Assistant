const allowedOrigins = ["https://kashf-ai-electricity-assistant.vercel.app"];
const corsOptions = {
    origin: (origin, callback) => {
        if (process.env.NODE_ENV === "development") {
            callback(null, true);
        } else {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Access denied! Not allowed by CORS"));
            }
        }
    },
    credentials: true, // Allow cookies/authorization headers
};

export default corsOptions;
