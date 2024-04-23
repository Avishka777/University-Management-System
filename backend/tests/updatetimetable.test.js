const req = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model.js');
const Timetable = require('../models/timetable.model.js');

jest.mock('../utils/verifyUser', () => ({
    verifyToken: jest.fn((req, res, next) => {
        req.user = { id: 'mockUserId', isAdmin: false, isFaculty: 'mockUserRole' }
        next();
    })
}))

describe('PUT /api/timetable/updatetimetable/:id', () => {
    
    let studentId, adminId, facultyId, timetableId;

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

        const timetable = await Timetable.create({
            classSession: "JAVA Update",
            course: "65efdb4af3d07fbbd13c9d5c",
            day: "2025-03-17",
            startTime: "17:30",
            endTime: "18:30",
            faculty: "65f26090c6748a8abf589611",
            location: "Room 117"
        });

        adminId = admin._id.toString();
        facultyId = faculty._id.toString();
        studentId = student._id.toString();
        timetableId = timetable._id.toString();
    }, 20000);

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await User.findByIdAndDelete(studentId);
        await User.findByIdAndDelete(adminId);
        await User.findByIdAndDelete(facultyId);
        await Timetable.findByIdAndDelete(timetableId);
        await mongoose.disconnect();
    }, 20000);


    //Update Time Table Name By Admin.
    it('Should return 200 Update Time Table Name By Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/timetable/updatetimetable/${timetableId}`)
            .send({ classSession: "JAVA Update",
                    course: "65efdb4af3d07fbbd13c9d5c",
                    day: "2025-03-18",
                    startTime: "17:30",
                    endTime: "18:30",
                    faculty: "65f26090c6748a8abf589611",
                    location: "Room 117" 
            })
        expect(res.statusCode).toBe(200)
    },20000)


     //Update Only Time Table Name By Faculty.
     it('Should return 200 Update Time Table Name By Faculty', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isFaculty: true }
            next()
        })

        const res = await req(app)
            .put(`/api/timetable/updatetimetable/${timetableId}`)
            .send({ classSession: "JAVA Update",
                    course: "65efdb4af3d07fbbd13c9d5c",
                    day: "2025-03-19",
                    startTime: "17:30",
                    endTime: "18:30",
                    faculty: "65f26090c6748a8abf589611",
                    location: "Room 117" 
            })
        expect(res.statusCode).toBe(200)
    },20000)

   
    //Update Time Table Not By Admin.
    it('Should return 403 Update Course Not By Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false }
            next()
        })

        const res = await req(app)
            .put(`/api/timetable/updatetimetable/${timetableId}`)
            .send({ classSession: "JAVA Update",
                    course: "65efdb4af3d07fbbd13c9d5c",
                    day: "2025-03-20",
                    startTime: "17:30",
                    endTime: "18:30",
                    faculty: "65f26090c6748a8abf589611",
                    location: "Room 117" 
            })
        expect(res.statusCode).toBe(403)
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to Update a Time Table.')
    },20000)


    //Update Time Table Not By Faculty.
    it('Should return 403 Update Course Not By Faculty', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: false }
            next()
        })

        const res = await req(app)
            .put(`/api/timetable/updatetimetable/${timetableId}`)
            .send({ classSession: "JAVA Update",
                    course: "65efdb4af3d07fbbd13c9d5c",
                    day: "2025-03-22",
                    startTime: "17:30",
                    endTime: "18:30",
                    faculty: "65f26090c6748a8abf589611",
                    location: "Room 117"
            })
        expect(res.statusCode).toBe(403)
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to Update a Time Table.')
    },20000)  
    

})