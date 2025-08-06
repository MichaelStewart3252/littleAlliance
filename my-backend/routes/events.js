const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
// Middleware to check admin
function requireAdmin(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.userId).then(user => {
      if (!user || !user.isAdmin) return res.status(403).json({ message: 'Admins only' });
      req.user = user;
      next();
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
// CREATE an event (admin only)
router.post('/', requireAdmin, async (req, res) => {
  const { name, description, location, date, time, fee, prize, results } = req.body;
  try {
    const event = new Event({
      name,
      description,
      location,
      date,
      time,
      fee,
      prize,
      results,
      createdBy: req.user._id
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email')
      .populate('registrations.user', '_id name email'); // <-- ADD THIS LINE
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ single event (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE an event (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Update fields
    event.name = req.body.name ?? event.name;
    event.description = req.body.description ?? event.description;
    event.location = req.body.location ?? event.location;
    event.date = req.body.date ?? event.date;
    event.time = req.body.time ?? event.time;
    event.fee = req.body.fee ?? event.fee;
    event.prize = req.body.prize ?? event.prize;
    event.results = req.body.results ?? event.results;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE an event (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function requireAuth(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.userId).then(user => {
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user = user;
      next();
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Register for an event
router.post('/:id/register', requireAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Prevent duplicate registration
    if (event.registrations.some(r => r.user.equals(req.user._id))) {
      return res.status(400).json({ message: 'Already registered' });
    }

    event.registrations.push({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
    await event.save();
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
