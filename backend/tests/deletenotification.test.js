const req = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model.js');
const Notification = require('../models/notification.model.js');

jest.mock('../utils/verifyUser', () => ({
    verifyToken: jest.fn((req, res, next) => {
        req.user = { id: 'mockUserId', isAdmin: false, isFaculty: 'mockUserRole' }
        next();
    })
}))

describe('DELETE /api/notification/deletenotification/:id', () => {
    
    let studentId, adminId, notificationId;

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

        const notification = await Notification.create({
            notificationTitle: 'Test Notification',
            notificationBody: 'This is a test Notification',
        });

        adminId = admin._id.toString();
        studentId = student._id.toString();
        notificationId = notification._id.toString(); // Assigning the Notification ID
    }, 30000);

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await User.findByIdAndDelete(studentId);
        await User.findByIdAndDelete(adminId);
        await Notification.findByIdAndDelete(notificationId); // Deleting the created Notification
        await mongoose.disconnect();
    }, 30000);


    //Delete Notification.
    it('Should Return 200 If User Is Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: studentId, isAdmin: false }
            next()
        })

        const res = await req(app)
            .delete(`/api/notification/deletenotification/${notificationId}`)
        expect(res.statusCode).toBe(200)
    })


    //Delete Not Found Notification.
    it('Should Return 404 If Not Found', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: studentId, isAdmin: false }
            next()
        })

        const res = await req(app)
            .delete(`/api/notification/deletenotification/${notificationId}`)
        expect(res.statusCode).toBe(404)
    })

})
