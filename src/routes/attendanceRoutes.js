const express = require('express');
const router = express.Router();
const { 
    getTodayAttendance, 
    timeIn, 
    timeOut, 
    submitAttendance, 
    getCompanyAttendances, 
    approveAttendance, 
    denyAttendance,
    getAllAttendance
} = require('../controller/attendanceController');

const authenticate = require("../middleware/authMiddleware");

router.get('/today', authenticate, getTodayAttendance);
router.post('/timein', authenticate, timeIn);
router.put('/timeout/:id', authenticate, timeOut);
router.put('/submit/:id', authenticate, submitAttendance);
router.get('/company', authenticate, getCompanyAttendances);
router.put('/approve/:id', authenticate, approveAttendance);
router.put('/deny/:id', authenticate, denyAttendance);
router.get('/', authenticate, getAllAttendance);

module.exports = router;
