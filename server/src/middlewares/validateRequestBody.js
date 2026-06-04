import AppError from "../utils/AppError.js";

const validateRequestBody = (validationSchema) => {
    return (req, res, next) => {
        // Check if validation schema is provided
        if (!validationSchema) {
            throw new AppError(500, "Validation schema is required for this route.");
        }
        const requestData = req.body;

        // 1- Check the request body isn't empty
        if (!requestData || Object.keys(requestData).length === 0) {
            throw new AppError(400, "Please provide data in the request body.");
        }

        // 2- Ensure the body is a valid JSON object
        if (typeof requestData !== "object") {
            throw new AppError(400, "Invalid data format. Please send a JSON object.");
        }

        // 3- Validate data using Joi
        const { error } = validationSchema.validate(requestData, {
            abortEarly: false,
        });

        if (error) {
            return res.status(400).json({
                message: "Validation failed.",
                details: error.details.map((d) => ({
                    field: d.path[0],
                    message: d.message,
                })),
            });
        }

        // 4- Continue to next middleware/controller
        next();
    };
};


export default validateRequestBody;
