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

describe('DELETE /api/user/delete/:id', () => {
    let studentId, adminId, userId;

    beforeAll(async () => {
        const hashedPassword = await bcrypt.hashSync('password123', 10);
        const student = await User.create({
            username: 'testStudent',
            email: 'testStudent@test.com',
            password: hashedPassword,
            isAdmin: false
        });

        const admin = await User.create({
            username: 'testAdmin',
            email: 'testAdmin@test.com',
            password: hashedPassword,
            isAdmin: true
        });

        adminId = admin._id.toString();
        studentId = student._id.toString();
        userId = student._id.toString(); 
    }, 20000);

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await User.findByIdAndDelete(studentId);
        await User.findByIdAndDelete(adminId);
        await mongoose.disconnect();
    }, 20000);


    //Delete User For Admin.
    it('Should Return 200 If User Deleted', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: studentId, isAdmin: true };
            next();
        });

        const res = await req(app)
            .delete(`/api/user/delete/${userId}`);
        expect(res.statusCode).toBe(200);
    },20000);


    //Delete User For Faculty.
    it('Should Return 403 If Faculty User Not Allowd To Delete', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: studentId, isFaculty: true };
            next();
        });

        const res = await req(app)
            .delete(`/api/user/delete/${userId}`);
        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to Delete This User.')
    },20000);


    //Delete User For Student.
    it('Should Return 403 If Student User Not Allowd To Delete', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: studentId, isFaculty: false, isAdmin: false };
            next();
        });

        const res = await req(app)
            .delete(`/api/user/delete/${userId}`);
        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('message', 'You Are Not Allowed to Delete This User.')
    },20000);

});
