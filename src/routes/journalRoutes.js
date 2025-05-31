const express = require('express');
const router = express.Router();
const {
  createJournal,
  getTodayJournal,
  getUserByEmail,
  getJournalsByCompany,
  getAllJournals,
  markJournalAsViewed,
  markJournalAsRemoved,
  getJournalById
} = require('../controller/journalController');

const authenticate = require("../middleware/authMiddleware");

router.get('/', authenticate, getAllJournals);
router.post('/', authenticate, createJournal); // If public, remove `authenticate`
router.get('/today', authenticate, getTodayJournal);
router.get('/company', authenticate, getJournalsByCompany);
router.get('/user', authenticate, getUserByEmail);
router.patch('/journal/:id/viewed', authenticate, markJournalAsViewed);
router.patch('/journal/:id/remove', authenticate, markJournalAsRemoved);
router.get('/journal/:id', authenticate, getJournalById);

module.exports = router;
