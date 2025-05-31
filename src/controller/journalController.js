const Journal = require('../models/journalSchema');
const User = require('../models/userSchema'); 

// POST /api/journal
const createJournal = async (req, res) => {
  try {
    const { content, email } = req.body;

    if (!content || !email) {
      return res.status(400).json({ message: 'Content and email are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found for the given email' });
    }

    const newEntry = new Journal({
      content,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      createdAt: new Date()
    });

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    console.error('Error saving journal:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

  const getTodayJournal = async (req, res) => {
    const { firstName, lastName } = req.query;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    try {
      const journal = await Journal.findOne({
        firstName,
        lastName,
        createdAt: { $gte: todayStart, $lte: todayEnd },
      });

      if (!journal) {
        return res.status(200).json({
          exists: false,
          message: "No journal found for today",
        });
      }

      res.status(200).json({
        exists: true,
        content: journal.content,
        journal,
      });
    } catch (err) {
      console.error("Error fetching journal:", err);
      res.status(500).json({ message: "Server error while fetching journal" });
    }
  };


  const getJournalsByCompany = async (req, res) => {
  const { email } = req.query;

    try {
      const user = await User.findOne({ email });
      if (!user || !user.company) {
        return res.status(404).json({ message: 'User or company not found' });
      }

      const journals = await Journal.find({ company: user.company }).sort({ createdAt: -1 });
      res.status(200).json(journals);
    } catch (err) {
      console.error('Error fetching journals by company:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  };

  const getUserByEmail = async (req, res) => {
    const email = req.query.email;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user); // <-- this is what your frontend expects
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  const getAllJournals = async (req, res) => {
    try {
      const journals = await Journal.find();
      res.status(200).json(journals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journals" });
    }
  };

  // PATCH /journal/:id/viewed
  const markJournalAsViewed = async (req, res) => {
    const { id } = req.params;
    const { viewed } = req.body;

    try {
      const updated = await Journal.findByIdAndUpdate(
        id,
        { viewed },
        { new: true }
      );

      if (!updated) return res.status(404).json({ message: 'Journal not found.' });
      res.json(updated);
    } catch (err) {
      console.error('Error updating viewed status:', err);
      res.status(500).json({ message: 'Failed to update viewed status.' });
    }
  };

  // PATCH /journal/:id/remove
  const markJournalAsRemoved = async (req, res) => {
    try {
      const { id } = req.params;
      await Journal.findByIdAndUpdate(id, { removed: true });
      res.status(200).json({ message: "Journal marked as removed" });
    } catch (err) {
      console.error("Error removing journal:", err);
      res.status(500).json({ message: "Failed to mark as removed" });
    }
  };

  const getJournalById = async (req, res) => {
    const { id } = req.params;

    try {
      const journal = await Journal.findById(id);
      if (!journal) {
        return res.status(404).json({ message: "Journal not found" });
      } 
      res.status(200).json(journal);
    } catch (error) {
      console.error("Error fetching journal by ID:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

module.exports = {
  createJournal,
  getTodayJournal,
  getJournalsByCompany,
  getUserByEmail,
  getAllJournals,
  markJournalAsViewed,
  markJournalAsRemoved,
  getJournalById,
};
