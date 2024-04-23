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

describe('PUT /api/user/update/:id', () => {
    
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


    //Update Only User Name 
    it('Should Return 200 Only Update User Name', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/user/update/${adminId}`)
            .send({ username: 'testusername' })
        expect(res.statusCode).toBe(200)
    },20000)


    //Update Only User Password
    it('Should Return 200 Only Update User Password ', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/user/update/${adminId}`)
            .send({ password: 'testpassword12' })
        expect(res.statusCode).toBe(200)
    },20000)


    //Update Only User Email
    it('Should Return 200 Only Update User Email ', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/user/update/${adminId}`)
            .send({ email: 'test@gmail.com' })
        expect(res.statusCode).toBe(200)
    },20000)


    //Update Only User Email Incorrect
    it('Should Return 400 Update User Email Incorrec', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/user/update/${adminId}`)
            .send({ email: 'testpassword12' })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message', 'Invalid email address.')
    },20000)


    //Update User Email And Password
    it('Should Return 200 Update User Email And Password', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/user/update/${adminId}`)
            .send({ email: 'test2@gmail.com', 
                    password: 'testpassword12'
            })
        expect(res.statusCode).toBe(200)
    },20000)


    //Update User Name And Password
    it('Should Return 200 Update User Name And Password', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/user/update/${adminId}`)
            .send({ name: 'testname', 
                    password: 'testpassword12'
            })
        expect(res.statusCode).toBe(200)
    },20000)


    //Update User Name, Email And Password
    it('Should Return 200 Update User Name, Email And Password', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/user/update/${adminId}`)
            .send({ name: 'testname', 
                    email: 'test2@gmail.com',
                    password: 'testpassword12'
            })
        expect(res.statusCode).toBe(200)
    },20000)
    

    //Update Only User Name Less Than 7
    it('Should Return 400 User Name Must Be Above 7 Characters', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/user/update/${adminId}`)
            .send({ username: 'test' })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message', 'User Name Must Be Between 7 and 20 Characters')
    },20000)

 
   //Update Only User Name Above 20 Characters
    it('Should Return 400 User Name Must Be Less Than 20 Characters', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/user/update/${adminId}`)
            .send({ username: 'testtesttesttesttesttesttesttest' })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message', 'User Name Must Be Between 7 and 20 Characters')
    },20000)


    //Update Only User Password Less Than 6 Character
    it('Should Return 400 Password Must Be At Least 6 Characters.', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/user/update/${adminId}`)
            .send({ password: 'test' })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message', 'Password Must Be At Least 6 Characters.')
    },20000)


    //Update Only User Name Can Not Contain Spaces
    it('Should Return 400 User Name Can Not Contain Spaces.', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/user/update/${adminId}`)
            .send({ username: 'test test' })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message', 'User Name Can Not Contain Spaces')
    },20000)


    //Update Only User Name Can Only Contain Letters and Numbers.
    it('Should Return 400 User Name Can Only Contain Letters and Numbers.', async () => {
        require('../utils/verifyUser').verifyToken.mockImplementation((req, res, next) => {
            req.user = { id: adminId, isAdmin: true }
            next()
        })

        const res = await req(app)
            .put(`/api/user/update/${adminId}`)
            .send({ username: 't3rree@e' })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('message', 'User Name Can Only Contain Letters and Numbers')
    },20000)
    

})