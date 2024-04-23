const req = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model.js');

jest.mock('../utils/verifyUser', () => ({
    verifyToken: jest.fn((req, res, next) => {
        req.user = { id: 'mockUserId', isAdmin: false, isFaculty: 'mockUserRole' }
        next();
    })
}))

describe('POST', () => {
    let studentId, adminId;

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

        adminId = admin._id.toString();
        studentId = student._id.toString();
    }, 30000);

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await User.findByIdAndDelete(studentId);
        await User.findByIdAndDelete(adminId);
        await mongoose.disconnect();
    }, 30000);


    //Admin Creates A Course
    it('Should Return 201 If Admin Creates A Course Successfully', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/course/create')
            .send({
                courseName: "Test-1",
                courseCode: "T1010",
                courseDescription: "Bla Bla Bla"
            });
        expect(res.statusCode).toBe(201);
        
    });


    //Admin Creates A Course Without Course Code
    it('Should Return 400 If Admin Creates Course Without Course Code', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/course/create')
            .send({
                courseName: "Test-1",
                courseDescription: "Bla Bla Bla"
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Please Provide All Required Fields.')
        
    });


    //Admin Creates A Course Without Course Name
    it('Should Return 400 If Admin Creates Course Without Course Name', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/course/create')
            .send({
                courseCode: "T2020",
                courseDescription: "Bla Bla Bla"
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Please Provide All Required Fields.')
        
    });


    //Faculty Creates A Course
    it('Should Return 201 If Faculty Creates A Course Successfully', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false, isFaculty: true };
            next();
        });

        const res = await req(app)
            .post('/api/course/create')
            .send({
                courseName: "Test-2",
                courseCode: "T2020",
                courseDescription: "Bla Bla Bla"
            });
        expect(res.statusCode).toBe(201);
        
    });


    //Student Can Not Creates A Course
    it('Should Return 403 If Can Not Create Course', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/course/create')
            .send({
                courseName: "Test",
                courseCode: "T3030",
                courseDescription: "Bla Bla Bla"
            });
        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to Create a Course.')
        
    });
});
