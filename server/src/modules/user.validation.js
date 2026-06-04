import Joi from "joi";

const loginSchema = Joi.object({
    // username: Joi.string().pattern(/^[a-zA-Z0-9-]+( [a-zA-Z0-9-]+)?$/).min(3).max(200).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    role: Joi.string().valid("user", "admin").default("user"),
});


const signupSchema = Joi.object({
    username: Joi.string()
        .pattern(/^[a-zA-Z0-9-]+( [a-zA-Z0-9-]+)?$/)
        .min(3)
        .max(200)
        .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    repassword: Joi.ref("password"),
    role: Joi.string().valid("user", "admin").default("user"),
});



export {
    loginSchema,
    signupSchema
};
