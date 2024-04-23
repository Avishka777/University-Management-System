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

describe('POST /api/auth/signup', () => {
    
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
    }, 20000);

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await User.findByIdAndDelete(studentId);
        await User.findByIdAndDelete(adminId);
        await mongoose.disconnect();
    }, 20000);


    //Create User Successfully
    it('Should Return 200 If Creates A User Successfully', async () => {
        
        const res = await req(app)
            .post('/api/auth/signup')
            .send({
                username: "Test001",
                email: "test01@gmail.com",
                password: "testtest",
            });
        expect(res.statusCode).toBe(200);
    },20000);


    //Create User Password Less Than 6 Characters
    it('Should Return 400 Password Must Be At Least 6 Characters.', async () => {
        
        const res = await req(app)
            .post('/api/auth/signup')
            .send({
                username: "Test002",
                email: "test01@gmail.com",
                password: "te",
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Password Must Be At Least 6 Characters.')
    },20000);


    //Create User Invalid Email
    it('Should Return 400 Invalid email address.', async () => {
        
        const res = await req(app)
            .post('/api/auth/signup')
            .send({
                username: "Test003",
                email: "test03gmail.com",
                password: "testtest",
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid email address.')
    },20000);


    //Create User Name Less Than 7 Characters
    it('Should Return 400 User Name Less Than 7 Characters.', async () => {
        
        const res = await req(app)
            .post('/api/auth/signup')
            .send({
                username: "Tes",
                email: "test@gmail.com",
                password: "testtest",
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'User Name Must Be Between 7 and 20 Characters')
    },20000);



    //Create User Name Above Than 20 Characters
    it('Should Return 400 User Name Above Than 20 Characters.', async () => {
        
        const res = await req(app)
            .post('/api/auth/signup')
            .send({
                username: "TestTestTestTestTestTestTest",
                email: "test@gmail.com",
                password: "testtest",
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'User Name Must Be Between 7 and 20 Characters')
    },20000);



    //Create User Name Can Not Contain Spaces
    it('Should Return 400 User Name Can Not Contain Spaces', async () => {
        
        const res = await req(app)
            .post('/api/auth/signup')
            .send({
                username: "Test T e s t",
                email: "test@gmail.com",
                password: "testtest",
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'User Name Can Not Contain Spaces')
    },20000);


    //Create User Name Can Only Contain Letters and Numbers
    it('Should Return 400 User Name Can Only Contain Letters and Numbers', async () => {
        
        const res = await req(app)
            .post('/api/auth/signup')
            .send({
                username: "Test@Test",
                email: "test@gmail.com",
                password: "testtest",
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'User Name Can Only Contain Letters and Numbers')
    },20000);

    //Create User Without Email
    it('Should Return 400 User Email is Required', async () => {
        
        const res = await req(app)
            .post('/api/auth/signup')
            .send({
                username: "Test@00",
                password: "Bla Bla Bla",
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'All Fields Are Required.')
    },20000);


    //Create User Without User Name
    it('Should Return 400 User Name is Required', async () => {
        
        const res = await req(app)
            .post('/api/auth/signup')
            .send({
                email: "test01@gmail.com",
                password: "Bla Bla Bla",
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'All Fields Are Required.')
    },20000);
   
});
