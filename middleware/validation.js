const zod = require('zod');

const { User } = require('../db');

// Signup validation schema
const signupSchema = zod.object({
    username: zod.string().min(3).max(20),
    password: zod.string().min(8),
});

// Purchase course validation schema
const courseIdSchema = zod.string().regex(/^[a-f\d]{24}$/i);

// Middleware to validate signup data and check if username already exists
async function validateSignup(req, res, next) {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: 'Validation error', errors: result.error.errors
        });
    }

    const { username } = result.data;
    
    // Check if username already exists
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username is already taken" });
        }
    } catch (error) {
        console.error("Error checking existing username:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

    req.validatedData = result.data;
    next();
}

// Middleware for validating courseId
function validatePurchaseCourse(req, res, next) {
    const { courseId } = req.params;

    // Use safeParse to handle validation errors
    const validatedCourseId = courseIdSchema.safeParse(courseId);

    // Check if validation failed
    if (!validatedCourseId.success) {
        // If validation fails, send error response
        return res.status(400).json({
            message: "Invalid courseId"
        });
    }

    // Attach validated courseId to request object
    req.validatedData = {
        courseId: validatedCourseId.data
    };
    
    next();
}

module.exports = { validateSignup, validatePurchaseCourse };