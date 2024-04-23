const req = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model.js');
const Course = require('../models/course.model.js');

jest.mock('../utils/verifyUser', () => ({
    verifyToken: jest.fn((req, res, next) => {
        req.user = { id: 'mockUserId', isAdmin: false, isFaculty: 'mockUserRole' }
        next();
    })
}))

describe('PUT /api/course/updatecourse/:id', () => {
    
    let studentId, adminId, facultyId, courseId;

    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const student = await User.create({
            username: 'testStudent',
            email: 'testStudent@test.com',
            password: hashedPassword,
        });

        const admin = await User.create({
            username: 'testAdmin',
            email: 'testAdmin@test.com',
            password: hashedPassword,
            isAdmin: true,
        });

        const faculty = await User.create({
            username: 'testFaculty',
            email: 'testFaculty@test.com',
            password: hashedPassword,
            isFaculty: true,
        });

        const course = await Course.create({
            courseCode: "Test-01",
	        courseName: "Test001 ",
	        courseDescription: "This is Test Module",
            slug:"test1"
        });

        adminId = admin._id.toString();
        facultyId = faculty._id.toString();
        studentId = student._id.toString();
        courseId = course._id.toString();
    }, 20000);

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await User.findByIdAndDelete(studentId);
        await User.findByIdAndDelete(adminId);
        await User.findByIdAndDelete(facultyId);
        await Course.findByIdAndDelete(courseId);
        await mongoose.disconnect();
    }, 20000);


    //Update Only Course Name By Admin.
    it('Should return 200 Update Course Name By Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/course/updatecourse/${courseId}`)
            .send({ courseName: 'Course Name Updated' })
        expect(res.statusCode).toBe(200)
    },20000)

    //Update Only Course Description By Admin.
    it('Should return 200 Update Course Description By Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/course/updatecourse/${courseId}`)
            .send({ courseDescription: 'Course Description Updated' })
        expect(res.statusCode).toBe(200)
    },20000)

    
    //Update Only Course Code By Admin.
    it('Should return 200 Update Course Code By Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/course/updatecourse/${courseId}`)
            .send({ courseCode: 'Course Code Updated' })
        expect(res.statusCode).toBe(200)
    },20000)


     //Update Only Course Name By Faculty.
     it('Should return 200 Update Course Name By Faculty', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isFaculty: true }
            next()
        })

        const res = await req(app)
            .put(`/api/course/updatecourse/${courseId}`)
            .send({ courseName: 'Course Name Updated' })
        expect(res.statusCode).toBe(200)
    },20000)

    //Update Only Course Description By Faculty.
    it('Should return 200 Update Course Description By Faculty', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/course/updatecourse/${courseId}`)
            .send({ courseDescription: 'Course Description Updated' })
        expect(res.statusCode).toBe(200)
    },20000)

    
    //Update Only Course Code By Faculty.
    it('Should return 200 Update Course Code By Faculty', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/course/updatecourse/${courseId}`)
            .send({ courseCode: 'Course Code Updated' })
        expect(res.statusCode).toBe(200)
    },20000)


    //Update Course Not By Admin.
    it('Should return 403 Update Course Not By Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false }
            next()
        })

        const res = await req(app)
            .put(`/api/course/updatecourse/${courseId}`)
            .send({ courseCode: 'Course Code Updated' })
        expect(res.statusCode).toBe(403)
    },20000)


    //Update Course Not By Faculty.
    it('Should return 403 Update Course Not By Faculty', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false }
            next()
        })

        const res = await req(app)
            .put(`/api/course/updatecourse/${courseId}`)
            .send({ courseCode: 'Course Code Updated' })
        expect(res.statusCode).toBe(403)
    },20000)


    //Update Invalid Course.
    it('Should return 403 Course Not Found', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false }
            next()
        })
        const invalidCourseId = 'invalid_course_id'; // Assuming this is an invalid course ID
        const res = await req(app)
            .put(`/api/course/updatecourse/${invalidCourseId}`)
            .send({ courseCode: 'Course Code Updated' })
    
        expect(res.statusCode).toBe(403);
    }, 20000);
    

})