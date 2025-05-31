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

router.get('/', getAllJournals);
router.post('/', createJournal);
router.get('/today', getTodayJournal);
router.get('/company', getJournalsByCompany);
router.get('/user', getUserByEmail); 
router.patch('/journal/:id/viewed', markJournalAsViewed);
router.patch('/journal/:id/remove', markJournalAsRemoved);
router.get('/journal/:id', getJournalById); 

module.exports = router;
