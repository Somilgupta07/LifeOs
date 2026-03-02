import { useEffect, useState } from "react";
import {
  Plus,
  Target,
  TrendingUp,
  Calendar,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { goalsAPI } from "../../services/api";
import GoalModal from "./GoalModal";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await goalsAPI.getAll();
      setGoals(data);
    } catch (error) {
      console.error("Failed to load goals:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 This function resolves the handleCreateGoal error
  const handleCreateGoal = () => {
    setSelectedGoal(null);
    setShowModal(true);
  };

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setShowModal(true);
  };

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl"
          />
        ))}
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">
            Objectives
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your long-term vision and daily progress.
          </p>
        </div>
        <button
          onClick={handleCreateGoal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} /> New Goal
        </button>
      </div>

      {goals.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {goals.map((goal: any) => (
            <div
              key={goal._id}
              className="group relative bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold dark:text-white truncate max-w-[200px]">
                      {goal.title}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md">
                        {goal.category}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-md">
                        {goal.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm("Delete goal?")) {
                        await goalsAPI.delete(goal._id);
                        loadGoals();
                      }
                    }}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                    Current Progress
                  </span>
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                    {goal.progress || 0}%
                  </span>
                </div>
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Milestones Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {goal.milestones?.slice(0, 4).map((m: any) => (
                  <div
                    key={m._id}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl"
                  >
                    {m.completed ? (
                      <CheckCircle2
                        className="text-green-500 flex-shrink-0"
                        size={14}
                      />
                    ) : (
                      <Circle
                        className="text-gray-300 flex-shrink-0"
                        size={14}
                      />
                    )}
                    <span
                      className={`text-xs truncate ${m.completed ? "line-through text-gray-400" : "font-medium"}`}
                    >
                      {m.title}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 border-t border-gray-50 dark:border-gray-800 pt-4">
                <Calendar size={14} />
                <span>
                  Deadline: {new Date(goal.targetDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-800">
          <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-3xl flex items-center justify-center shadow-xl mb-6 text-blue-600">
            <Target size={40} />
          </div>
          <h3 className="text-xl font-bold dark:text-white mb-2">
            No Vision Set Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs mb-8">
            Start by defining your long-term goals.
          </p>
          <button
            onClick={handleCreateGoal}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-transform active:scale-95"
          >
            Begin Journey
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
