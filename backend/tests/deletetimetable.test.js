const req = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model.js');
const Notification = require('../models/notification.model.js');
const Timetable = require('../models/timetable.model.js');

jest.mock('../utils/verifyUser', () => ({
    verifyToken: jest.fn((req, res, next) => {
        req.user = { id: 'mockUserId', isAdmin: false, isFaculty: 'mockUserRole' }
        next();
    })
}))

describe('DELETE /api/timetable/deletetimetable/:id', () => {
    let studentId, adminId, timetableId

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

        const timetable = await Timetable.create({
            classSession: "122",
            course: "65fa98425e8a62d5e954e25f",
            day: "2025-04-19",
            startTime: "2024-03-19T10:30:00.323Z",
            endTime: "2024-03-19T11:20:00.323Z",
            faculty: "65f26090c6748a8abf589611",
            location: "Room 11"
        })

        timetableId = timetable._id.toString()
        adminId = admin._id.toString()
        studentId = student._id.toString()

    },20000)

    afterEach(() => {
        jest.resetAllMocks()
    })

    afterAll(async () => {
        await User.findByIdAndDelete(studentId)
        await User.findByIdAndDelete(adminId)
        await Timetable.findByIdAndDelete(timetableId)
        await mongoose.disconnect()
    },20000)


    //Delete Time Table For Faculty.
    it('Should Return 200 If User Is Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: studentId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .delete(`/api/timetable/deleteTimetable/${timetableId}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('message', 'Timetable Deleted Successfully.')
    })


    //Delete Time Table For Studnet.
    it('Should Return 404 If Time Table Not Found', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: studentId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .delete(`/api/timetable/deleteTimetable/${timetableId}`)
        expect(res.statusCode).toBe(404)
        expect(res.body).toHaveProperty('message', 'Timetable Not Found.')
    })

})
