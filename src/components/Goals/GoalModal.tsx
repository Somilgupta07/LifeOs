import { useState, useEffect } from "react";
import { X, Plus, Trash2, Target, CheckCircle2, Circle } from "lucide-react";
import { goalsAPI } from "../../services/api";

interface GoalModalProps {
  goal: any;
  onClose: () => void;
  onSave: () => void;
}

export default function GoalModal({ goal, onClose, onSave }: GoalModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "personal",
    type: "short-term",
    targetDate: "",
    status: "active",
  });
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || "",
        description: goal.description || "",
        category: goal.category || "personal",
        type: goal.type || "short-term",
        targetDate: goal.targetDate
          ? new Date(goal.targetDate).toISOString().split("T")[0]
          : "",
        status: goal.status || "active",
      });
      setMilestones(goal.milestones || []);
    }
  }, [goal]);

  const addMilestone = () =>
    setMilestones([
      ...milestones,
      { title: "", description: "", completed: false },
    ]);
  const removeMilestone = (index: number) =>
    setMilestones(milestones.filter((_, i) => i !== index));
  const updateMilestone = (index: number, field: string, value: any) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const goalData = {
        ...formData,
        milestones: milestones.filter((m) => m.title.trim()),
      };
      goal
        ? await goalsAPI.update(goal._id, goalData)
        : await goalsAPI.create(goalData);
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 dark:text-blue-400">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-bold dark:text-white">
              {goal ? "Edit Goal" : "New Goal"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                required
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                placeholder="e.g., Master Full Stack Development"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white appearance-none"
                >
                  <option value="personal">Personal</option>
                  <option value="professional">Professional</option>
                  <option value="health">Health</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  Target Date
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, targetDate: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Milestones
              </label>
              <button
                type="button"
                onClick={addMilestone}
                className="text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
              >
                + Add Milestone
              </button>
            </div>

            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateMilestone(
                          index,
                          "completed",
                          !milestone.completed,
                        )
                      }
                      className="transition-transform active:scale-90"
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="text-green-500" size={20} />
                      ) : (
                        <Circle className="text-gray-300" size={20} />
                      )}
                    </button>
                    <input
                      value={milestone.title}
                      onChange={(e) =>
                        updateMilestone(index, "title", e.target.value)
                      }
                      className="flex-1 bg-transparent border-none p-0 focus:ring-0 font-semibold dark:text-white"
                      placeholder="What's the next step?"
                    />
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input
                    value={milestone.description}
                    onChange={(e) =>
                      updateMilestone(index, "description", e.target.value)
                    }
                    className="text-xs bg-transparent border-none p-0 focus:ring-0 text-gray-500"
                    placeholder="Add a small detail..."
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-700"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? "Saving..." : goal ? "Update Goal" : "Launch Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
