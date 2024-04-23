const req = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model.js');
const Notification = require('../models/notification.model.js');
const Classroom = require('../models/classroom.model.js');

jest.mock('../utils/verifyUser', () => ({
    verifyToken: jest.fn((req, res, next) => {
        req.user = { id: 'mockUserId', isAdmin: false, isFaculty: 'mockUserRole' }
        next();
    })
}))

describe('DELETE /api/classroom/deleteclassroom/:id', () => {
    let studentId, adminId, classroomId

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

        const classroom = await Classroom.create({
            roomName: 'TEST109',
            capacity: 1000,
            facilities: ['projector', 'computer']
        })

        classroomId = classroom._id.toString()
        adminId = admin._id.toString()
        studentId = student._id.toString()

    },20000)

    afterEach(() => {
        jest.resetAllMocks()
    })

    afterAll(async () => {
        await User.findByIdAndDelete(studentId)
        await User.findByIdAndDelete(adminId)
        await Classroom.findByIdAndDelete(classroomId)
        // await mongoose.disconnect()
    },20000)


    //Delete Not Allowed Class Room.
    it('Should Return 403 If User Not Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: studentId, isAdmin: false }
            next()
        })

        const res = await req(app)
            .delete(`/api/classroom/deleteClassroom/${classroomId}`)
        expect(res.statusCode).toBe(403)
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to Delete Book class Rooms.')
    })


    //Delete Not Allowed Class Room.
    it('Should Return 200 If Admin Remove Class Successfully', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .delete(`/api/classroom/deleteClassroom/${classroomId}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('message', 'Classroom Deleted Successfully.')
    })

})
