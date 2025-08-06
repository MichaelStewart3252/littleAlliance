const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },           // Event name/title
  description: { type: String, required: true },    // Event description
  location: { type: String, required: true },       // Event location
  date: { type: Date, required: true },             // Event date
  time: { type: String, required: true },           // Event time (e.g., "2:00 PM")
  fee: { type: Number, required: true },            // Entry fee
  prize: { type: String, required: true },          // Prize description
  results: { type: String, default: "" },           // Results (can be empty initially)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  registrations: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String, // optional: store user name at time of registration
    email: String // optional: store user email at time of registration
  }]
});

module.exports = mongoose.model('Event', eventSchema, 'Events');
