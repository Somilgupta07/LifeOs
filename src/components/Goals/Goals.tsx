import { useEffect, useState } from 'react';
import { Plus, Target, TrendingUp } from 'lucide-react';
import { goalsAPI } from '../../services/api';
import GoalModal from './GoalModal';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await goalsAPI.getAll();
      setGoals(data);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = () => {
    setSelectedGoal(null);
    setShowModal(true);
  };

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setShowModal(true);
  };

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalsAPI.delete(id);
        loadGoals();
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Goals</h1>
          <p className="text-gray-600">Set and track your long-term objectives</p>
        </div>
        <button
          onClick={handleCreateGoal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Goal</span>
        </button>
      </div>

      {goals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal: any) => (
            <div
              key={goal._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{goal.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 capitalize">{goal.category}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500 capitalize">{goal.type}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    goal.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : goal.status === 'active'
                      ? 'bg-blue-100 text-blue-700'
                      : goal.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {goal.status}
                </span>
              </div>

              {goal.description && (
                <p className="text-gray-600 mb-4">{goal.description}</p>
              )}

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-gray-800">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {goal.milestones && goal.milestones.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Milestones</p>
                  <div className="space-y-2">
                    {goal.milestones.slice(0, 3).map((milestone: any) => (
                      <div key={milestone._id} className="flex items-center space-x-2 text-sm">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        <span className={milestone.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                    {goal.milestones.length > 3 && (
                      <p className="text-xs text-gray-500">+{goal.milestones.length - 3} more</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEditGoal(goal)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => handleDeleteGoal(goal._id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-6">Create your first goal to get started</p>
          <button
            onClick={handleCreateGoal}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Goal</span>
          </button>
        </div>
      )}

      {showModal && (
        <GoalModal
          goal={selectedGoal}
          onClose={() => setShowModal(false)}
          onSave={loadGoals}
        />
      )}
    </div>
  );
}
