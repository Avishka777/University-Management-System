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

describe('POST /api/claaroom/create', () => {
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


    //Admin Can Create Class Room
    it('Should Return 201 If Admin Can Create Class Room', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/classroom/create')
            .send({
                roomName: "F-111",
                capacity: 80,
                facilities: "Whiteboard",
                lectureID: "65fab02a6a08c9c2d231e3dc",
                date: "2024-04-16",
                startTime: "2024-04-16T15:30:00Z",
                endTime: "2024-04-16T17:30:00Z"
            });
        expect(res.statusCode).toBe(201);
        
    });

    //Faculty Can Create Class Room
    it('Should Return 201 If Faculty Can Create Class Room', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false, isFaculty: true };
            next();
        });

        const res = await req(app)
            .post('/api/classroom/create')
            .send({
                roomName: "F-112",
                capacity: 80,
                facilities: "Whiteboard",
                lectureID: "65fab02a6a08c9c2d231e3dc",
                date: "2024-04-17",
                startTime: "2024-04-16T15:30:00Z",
                endTime: "2024-04-16T17:30:00Z"
            });
        expect(res.statusCode).toBe(201);
        
    });


    //Admin Can Not Create Class Room If Already Booked Same Times
    it('Should Return 400 Admin Can Not Create Class Room If Already Booked Same Times', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/classroom/create')
            .send({
                roomName: "F-111",
                capacity: 80,
                facilities: "Whiteboard",
                lectureID: "65fab02a6a08c9c2d231e3dc",
                date: "2024-04-16",
                startTime: "2024-04-16T15:30:00Z",
                endTime: "2024-04-16T17:30:00Z"
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'The Room is Not Available At the Specified Time.')
        
    });

    //Student Can Not Creates Class Room
    it('Should Return 403 If Can Not Create Class Room', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/classroom/create')
            .send({
                roomName: "Test-3",
                capacity: 45,
                facilities: "Bla Bla Bla"
            });
        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to Book class Rooms.')
        
    });
});
