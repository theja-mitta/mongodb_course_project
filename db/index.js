const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://taskapp:Taskapp%4012345@cluster0.kenmuzt.mongodb.net/mongodb_course_app');

// Define Schema
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username: String,
    password: String
})

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
    }]
})

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title: String,
    description: String,
    imageLink: String,
    price: Number
})

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}