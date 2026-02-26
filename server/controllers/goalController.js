import Goal from '../models/Goal.js';

export const getGoals = async (req, res) => {
  try {
    const { status, category, type } = req.query;
    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (type) filter.type = type;

    const goals = await Goal.find(filter).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (goal) {
      res.json(goal);
    } else {
      res.status(404).json({ message: 'Goal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({
      user: req.user._id,
      ...req.body
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (goal) {
      Object.assign(goal, req.body);

      if (goal.milestones && goal.milestones.length > 0) {
        const completedMilestones = goal.milestones.filter(m => m.completed).length;
        goal.progress = Math.round((completedMilestones / goal.milestones.length) * 100);
      }

      const updatedGoal = await goal.save();
      res.json(updatedGoal);
    } else {
      res.status(404).json({ message: 'Goal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (goal) {
      await goal.deleteOne();
      res.json({ message: 'Goal removed' });
    } else {
      res.status(404).json({ message: 'Goal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMilestone = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (goal) {
      const milestone = goal.milestones.id(req.params.milestoneId);
      if (milestone) {
        Object.assign(milestone, req.body);

        if (req.body.completed && !milestone.completedAt) {
          milestone.completedAt = new Date();
        } else if (!req.body.completed) {
          milestone.completedAt = null;
        }

        const completedMilestones = goal.milestones.filter(m => m.completed).length;
        goal.progress = Math.round((completedMilestones / goal.milestones.length) * 100);

        await goal.save();
        res.json(goal);
      } else {
        res.status(404).json({ message: 'Milestone not found' });
      }
    } else {
      res.status(404).json({ message: 'Goal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
