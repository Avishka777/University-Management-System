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

describe('GET /api/user/getusers', () => {
    
    let studentId, adminId, facultyId;

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

        adminId = admin._id.toString();
        facultyId = faculty._id.toString();
        studentId = student._id.toString();
    }, 20000);

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await User.findByIdAndDelete(studentId);
        await User.findByIdAndDelete(adminId);
        await User.findByIdAndDelete(facultyId);
        await mongoose.disconnect();
    }, 20000);


    //Get Users By Admin.
    it('Should return 200 Allowed To See User For Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })
        const res = await req(app).get('/api/user/getusers');
        expect(res.statusCode).toBe(200);
    }, 20000); 


    //Get Users By Faculty.
    it('Should return 403 Not Allowed To See User For Faculty', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isFaculty: true }
            next()
        })
        const res = await req(app).get('/api/user/getusers');
        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to See All Users.')
    }, 20000); 
    

    //Get Users By Student.
    it('Should return 403 Not Allowed To See User For Student', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isFaculty: false }
            next()
        })
        const res = await req(app).get('/api/user/getusers');
        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to See All Users.')
    }, 20000); 
});
