const jwtMiddleware = require('../middleware/user');
const { validateSignup, validatePurchaseCourse } = require('../middleware/validation');
const { Admin, User, Course } = require('../db');
const { JWT_SECRET } = require("../config");
const zod = require("zod");

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// User Routes
router.post('/signup', validateSignup, async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    await User.create({
        username: username,
        password: password
    });

    res.json({
        message: 'User created successfully'
    })
});

router.post('/signin', async (req, res) => {
    // Implement user signin logic
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.find({
        username,
        password
    })

    if (user) {
        const token = jwt.sign({
            username
        }, JWT_SECRET);

        res.json({
            token
        })
    } else {
        res.status(411).json({
            message: "Incorrect email and password"
        })
    }
})

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const allCourses = await Course.find({});

    res.json({
        courses: allCourses
    })
})

router.post('/courses/:courseId', jwtMiddleware, validatePurchaseCourse, async (req, res) => {
    const courseId = req.params.courseId;
    try {
        await User.updateOne(
            { username: req.username },
            { "$push": { purchasedCourses: courseId } }
        );
    } catch(e) {
        console.log(e);
    }

    res.json({
        message: "Purchase complete!"
    })
})

router.get('/purchasedCourses', jwtMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.username
    });

    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })

    res.json({
        courses: courses
    })
})

module.exports = router;