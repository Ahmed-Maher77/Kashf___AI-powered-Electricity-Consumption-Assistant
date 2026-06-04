import dbConnect from "../database/dbConnect.js";

const MAX_RETRIES = 5;
let retryCount = 0;

// Function to start the server after connecting to the database with retry mechanism
const startServerWithDB = async (app, port) => {
    try {
        await dbConnect();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(() => {
                startServerWithDB(app, port);
            }, 5000); // Wait 5 seconds before retrying
        }
        console.error("Error starting the server:", error);
    }
};

export default startServerWithDB;
