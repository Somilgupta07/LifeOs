import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date
}, { timestamps: true });

const goalSchema = new mongoose.Schema({
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
  category: {
    type: String,
    enum: ['personal', 'professional', 'health', 'finance', 'learning', 'other'],
    default: 'personal'
  },
  type: {
    type: String,
    enum: ['short-term', 'long-term'],
    default: 'short-term'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  targetDate: {
    type: Date,
    required: true
  },
  milestones: [milestoneSchema],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'abandoned'],
    default: 'active'
  }
}, {
  timestamps: true
});

goalSchema.index({ user: 1, status: 1 });

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
