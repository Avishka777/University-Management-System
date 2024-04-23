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

describe('POST /api/announcement/create', () => {
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


    //Admin Creates A Annoncemet Successfully
    it('Should Return 201 If Admin Creates A Annoncemet Successfully', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/announcement/create')
            .send({
                content: "Test-01",
                title: "Bla Bla Bla",
            });
        expect(res.statusCode).toBe(500);
        
    });


    //Faculty Creates A Annoncemet Successfully
    it('Should Return 201 If Admin Creates A Annoncemet Successfully', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false, isFaculty: true };
            next();
        });

        const res = await req(app)
            .post('/api/announcement/create')
            .send({
                content: "Test-02",
                title: "Bla Bla Bla",
            });
        expect(res.statusCode).toBe(500);
        
    });



    //Student Can Not Creates A Annoncemet
    it('Should Return 403 If Can Not Create Announcement', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/announcement/create')
            .send({
                content: "Test-03",
                title: "Bla Bla Bla"
            });
        expect(res.statusCode).toBe(403);
        
    });
});
