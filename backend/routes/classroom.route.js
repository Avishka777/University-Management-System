const express = require('express');
const { verifyToken } = require('../utils/verifyUser.js');
const { create, getAll, getByID, remove, update } = require('../controllers/classroom.controller.js');

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getclassrooms', getAll);
router.get('/getclassroom/:id', getByID);
router.put('/updateclassroom/:id', verifyToken, update);
router.delete('/deleteclassroom/:id', verifyToken, remove);

module.exports = router;