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

describe('POST /api/timetable/create', () => {
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


    //Create Time Table For Admin
    it('Should Return 201 If Admin Creates A Time Table Successfully', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/timetable/create')
            .send({
                classSession: "Test-1",
                day: "2024-10-12",
                startTime: "10:00",
                endTime:"12:00",
                location:"G-110"
            });
        expect(res.statusCode).toBe(201);
        
    });


    //Create Time Table But Overlapped Same Start Time, End Time, Same Date And Same Hall 
    it('Should Return 400 Create Time Table But Overlapped Same Start Time, End Time, Same Date And Same Hall', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/timetable/create')
            .send({
                classSession: "Test-2",
                day: "2024-10-12",
                startTime: "09:00",
                endTime:"12:00",
                location:"G-110"
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'A session at the same time with the same location already exists.')
        
    });


    //Create Time Table But Overlapped  Same End-Time, Same Hall, Same Date, But Different Start-Time
    it('Should Return 400 Create Time Table But Overlapped  Same End-Time, Same Hall, Same Date, But Different Start-Time', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/timetable/create')
            .send({
                classSession: "Test-2",
                day: "2024-10-12",
                startTime: "08:00",
                endTime:"12:00",
                location:"G-110"
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'A session at the same time with the same location already exists.')
        
    });


    //Create Time Table But Overlapped Same Start-Time, Same Date, Same Hall But Different End-Time
    it('Should Return 400 Create Time Table But Overlapped Same Start-Time, Same Date, Same Hall But Different End-Time', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/timetable/create')
            .send({
                classSession: "Test-2",
                day: "2024-10-12",
                startTime: "09:00",
                endTime:"13:00",
                location:"G-110"
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'A session at the same time with the same location already exists.')
        
    });


    //Create Time Table But Overlapped Different Start-Time, Different End-Time, Same Hall And Same Date But Alreday Booked Time Range
    it('Should Return 400 Create Time Table But Overlapped Different Start-Time, Different End-Time, Same Hall And Same Date But Alreday Booked Time Range', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/timetable/create')
            .send({
                classSession: "Test-2",
                day: "2024-10-12",
                startTime: "08:00",
                endTime:"13:00",
                location:"G-110"
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'A session at the same time with the same location already exists.')
        
    });


    //Create Time Table Same Start-Time, Same End-Time, Same Date But Different Hall
    it('Should Return 201 Creates A Time Table Same Start-Time, Same End-Time, Same Date But Different Hall', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/timetable/create')
            .send({
                classSession: "Test-1",
                day: "2024-10-12",
                startTime: "10:00",
                endTime:"12:00",
                location:"G-111"
            });
        expect(res.statusCode).toBe(201);
        
    });


    //Create Time Table Same Start-Time, Same End-Time, Same Hall But Different Date
    it('Should Return 201 Create Time Table Same Start-Time, Same End-Time, Same Hall But Different Date', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/timetable/create')
            .send({
                classSession: "Test-1",
                day: "2024-11-12",
                startTime: "10:00",
                endTime:"12:00",
                location:"G-111"
            });
        expect(res.statusCode).toBe(201);
        
    });


    //Create Time Table For Faculty
    it('Should Return 201 If Faculty Creates A Time Table Successfully', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false, isFaculty: true };
            next();
        });

        const res = await req(app)
            .post('/api/timetable/create')
            .send({
                classSession: "Test-3",
                day: "2024-10-11",
                startTime: "12:00",
                endTime:"12:00",
                location:"G-111"
            });
        expect(res.statusCode).toBe(201);
        
    });


    //Can Not Create Time Table For Student
    it('Should Return 403 If Can Not Create Time Table', async () => {
        require('../utils/verifyUser.js').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false, isFaculty: false };
            next();
        });

        const res = await req(app)
            .post('/api/timetable/create')
            .send({
                classSession: "Test-4",
                day: "2024-10-10",
                startTime: "12:00",
                endTime:"12:00",
                location:"G-110"
            });
        expect(res.statusCode).toBe(403);
        
    });
});
