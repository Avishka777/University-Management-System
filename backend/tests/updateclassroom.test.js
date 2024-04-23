const req = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model.js');
const Classroom = require('../models/classroom.model.js');

jest.mock('../utils/verifyUser', () => ({
    verifyToken: jest.fn((req, res, next) => {
        req.user = { id: 'mockUserId', isAdmin: false, isFaculty: 'mockUserRole' }
        next();
    })
}))

describe('PUT /api/classroom/updateclassroom/:id', () => {
    
    let studentId, adminId, facultyId, classroomId;

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

        const classroom = await Classroom.create({
            roomName: "F 302",
            capacity: 80,
            facilities: "Whiteboard",
            lectureID: "65fab02a6a08c9c2d231e3dc",
            date: "2024-04-16",
            startTime: "2024-04-16T15:30:00Z",
            endTime: "2024-04-16T17:30:00Z"
        });

        adminId = admin._id.toString();
        facultyId = faculty._id.toString();
        studentId = student._id.toString();
        classroomId = classroom._id.toString();
    }, 20000);

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await User.findByIdAndDelete(studentId);
        await User.findByIdAndDelete(adminId);
        await User.findByIdAndDelete(facultyId);
        await Classroom.findByIdAndDelete(classroomId);
        await mongoose.disconnect();
    }, 20000);


    //Update Only Room Name Not Admin.
    it('Should Return 403 Update Class Room Not Allowed', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false }
            next()
        })

        const res = await req(app)
            .put(`/api/classroom/updateclassroom/${classroomId}`)
            .send({ roomName: 'Room Name Updated' })
        expect(res.statusCode).toBe(403)
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to Update Book class Rooms.')
    },20000)


    //Update Only Room Name Not Faculty.
    it('Should Return 403 Update Class Room Not Allowed', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isFaculty: false }
            next()
        })

        const res = await req(app)
            .put(`/api/classroom/updateclassroom/${classroomId}`)
            .send({ roomName: 'Room Name Updated' })
        expect(res.statusCode).toBe(403)
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to Update Book class Rooms.')
    },20000)


    //Update Class Room Details By Admin
    it('Should return 200 Update Class Room Name By Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/classroom/updateclassroom/${classroomId}`)
            .send({ roomName: "F-505",
                    capacity: 50000,
                    facilities: ["Projector update", "Whiteboard"],
                    lectureID: "65f25fbdc6748a8abf589600",
                    date: "2024-04-11",
                    startTime: "2022-05-15T11:11:00Z",
                    endTime: "2022-05-15T11:22:00Z" 
                })
        expect(res.statusCode).toBe(200)
    },20000)


    //Update Class Room Details By Faculty
    it('Should return 200 Update Class Room Name By Faculty', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isFaculty: true }
            next()
        })

        const res = await req(app)
            .put(`/api/classroom/updateclassroom/${classroomId}`)
            .send({ roomName: "F-505",
                    capacity: 50000,
                    facilities: ["Projector update", "Whiteboard"],
                    lectureID: "65f25fbdc6748a8abf589600",
                    date: "2024-04-11",
                    startTime: "2022-05-15T11:11:00Z",
                    endTime: "2022-05-15T11:22:00Z" 
                })
        expect(res.statusCode).toBe(200)
    },20000)


    //Update Invalid Class Room.
    it('Should return 403 Class Room Not Found', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false }
            next()
        })
        const invalidClassroomId = 'invalid_classroom_id'; // Assuming this is an invalid course ID
        const res = await req(app)
            .put(`/api/classroom/updateclassroom/${invalidClassroomId}`)
            .send({ roomName: 'Room Name Updated' })
    
        expect(res.statusCode).toBe(403);
    }, 20000);

})