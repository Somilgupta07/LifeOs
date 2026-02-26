import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: ['meeting', 'reminder', 'appointment', 'deadline', 'personal', 'other'],
    default: 'other'
  },
  reminder: {
    enabled: { type: Boolean, default: false },
    time: { type: Number, default: 30 }
  },
  color: {
    type: String,
    default: '#3b82f6'
  }
}, {
  timestamps: true
});

eventSchema.index({ user: 1, startDate: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;
