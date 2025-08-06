// READ all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email')
      .populate('registrations.user', '_id name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
