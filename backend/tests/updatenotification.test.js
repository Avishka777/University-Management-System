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

describe('PUT /api/notification/updatenotification/:id', () => {
    
    let studentId, adminId, facultyId, notificationId;

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

        const notification = await Notification.create({
            notificationTitle: 'Test Notification',
            notificationBody: 'This is a test Notification',
        });

        adminId = admin._id.toString();
        studentId = student._id.toString();
        facultyId = faculty._id.toString();
        notificationId = notification._id.toString();
    }, 20000);

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await User.findByIdAndDelete(studentId);
        await User.findByIdAndDelete(adminId);
        await User.findByIdAndDelete(facultyId);
        await Notification.findByIdAndDelete(notificationId);
        await mongoose.disconnect();
    }, 20000);


    //Update Only Notification Body By Admin.
    it('Should return 200 Update Notification Body By Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/notification/updatenotification/${notificationId}`)
            .send({ notificationBody: 'Notification Body Updated' })
        expect(res.statusCode).toBe(200)
    },20000)

 
    //Update Only Notification Title By Admin.
    it('Should return 200 Update Notification Title By Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/notification/updatenotification/${notificationId}`)
            .send({ notificationTitle: 'Notification Title Updated' })
        expect(res.statusCode).toBe(200)
    },20000)
    
    //Update Only Notification Title And Body By Admin.
    it('Should return 200 Update Notification Body and Title By Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/notification/updatenotification/${notificationId}`)
            .send({ notificationBody: 'Notification Updated' ,
                    notificationTitle: 'Notification Title Updated'
                })
        expect(res.statusCode).toBe(200)
    },20000)


    //Update Only Notification Body By Faculty.
    it('Should return 200 Update Notification Body By Faculty', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isFaculty: true }
            next()
        })

        const res = await req(app)
            .put(`/api/notification/updatenotification/${notificationId}`)
            .send({ notificationBody: 'Notification Body Updated' })
        expect(res.statusCode).toBe(200)
    },20000)

 
    //Update Only Notification Title By Faculty.
    it('Should return 200 Update Notification Title By Faculty', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isFaculty: true }
            next()
        })

        const res = await req(app)
            .put(`/api/notification/updatenotification/${notificationId}`)
            .send({ notificationTitle: 'Notification Title Updated' })
        expect(res.statusCode).toBe(200)
    },20000)
    
    //Update Only Notification Title And Body By Faculty.
    it('Should return 200 Update Notification Body and Title By Faculty', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isFaculty: true }
            next()
        })

        const res = await req(app)
            .put(`/api/notification/updatenotification/${notificationId}`)
            .send({ notificationBody: 'Notification Updated' ,
                    notificationTitle: 'Notification Title Updated'
                })
        expect(res.statusCode).toBe(200)
    },20000)


    //Update Only Notification Title And Body Not By Admin.
    it('Should return 403 Update Notification Body and Title Not By Admin', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isFaculty: false }
            next()
        })

        const res = await req(app)
            .put(`/api/notification/updatenotification/${notificationId}`)
            .send({ notificationBody: 'Notification Updated' ,
                    notificationTitle: 'Notification Title Updated'
                })
        expect(res.statusCode).toBe(403)
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to Update a Announcement.')
    },20000)


    //Update Only Notification Title And Body Not By Faculty.
    it('Should return 403 Update Notification Body and Title Not By Faculty', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isFaculty: false }
            next()
        })

        const res = await req(app)
            .put(`/api/notification/updatenotification/${notificationId}`)
            .send({ notificationBody: 'Notification Updated' ,
                    notificationTitle: 'Notification Title Updated'
                })
        expect(res.statusCode).toBe(403)
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to Update a Announcement.')
    },20000)


})


// Always Getting Error
// thrown: "Exceeded timeout of 20000 ms for a test.
// Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."