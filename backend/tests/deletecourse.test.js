const req = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model.js');
const Notification = require('../models/notification.model.js');
const Course = require('../models/course.model.js');

jest.mock('../utils/verifyUser', () => ({
    verifyToken: jest.fn((req, res, next) => {
        req.user = { id: 'mockUserId', isAdmin: false, isFaculty: 'mockUserRole' }
        next();
    })
}))

describe('DELETE /api/course/deletecourse/:id', () => {
    let studentId, adminId, courseId

    beforeAll(async () => {
        const hashedPassword = await bcrypt.hashSync('password123', 10)
        const student = await User.create({
            username: 'testStudent',
            email: 'testStudent@test.com',
            password: hashedPassword,
            isAdmin: false
        })

        const admin = await User.create({
            username: 'testAdmin',
            email: 'testAdmin@test.com',
            password: hashedPassword,
            isAdmin: true
        })

        const course = await Course.create({
            courseCode: "Test-01",
	        courseName: "Test001 ",
	        courseDescription: "This is Test Module",
            slug: "test-01" 
        })

        courseId = course._id.toString()
        adminId = admin._id.toString()
        studentId = student._id.toString()

    },20000)

    afterEach(() => {
        jest.resetAllMocks()
    })

    afterAll(async () => {
        await User.findByIdAndDelete(studentId)
        await User.findByIdAndDelete(adminId)
        await Course.findByIdAndDelete(courseId)
        await mongoose.disconnect()
    },20000)


    //Delete Not Allowd Course.
    it('Should Return 403 If User Not Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: studentId, isAdmin: false }
            next()
        })

        const res = await req(app)
            .delete(`/api/course/deleteCourse/${courseId}`)
        expect(res.statusCode).toBe(403)
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to Delete This Course.')
    })


    //Delete Course.
    it('Should Return 200 If Admin Remove Course Successfully', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .delete(`/api/course/deleteCourse/${courseId}`)
        expect(res.statusCode).toBe(200)
    })


})
