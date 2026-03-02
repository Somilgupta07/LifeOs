import { useEffect, useState } from "react";
import {
  Plus,
  CheckCircle, // For completed tasks
  Circle, // For incomplete tasks
  CheckSquare, // Added this for the empty state icon 🔥
  Filter,
  Calendar as CalendarIcon,
  Tag,
  Trash2,
  Edit3,
} from "lucide-react";
import { tasksAPI } from "../../services/api";
import TaskModal from "./TaskModal";

// Add this interface to satisfy TypeScript
interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  tags?: string[];
}

export default function Tasks() {
  // Define state with the Task type
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filterStatus, filterPriority]);

  const loadTasks = async () => {
    try {
      const data = await tasksAPI.getAll();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];
    if (filterStatus !== "all")
      filtered = filtered.filter((t) => t.status === filterStatus);
    if (filterPriority !== "all")
      filtered = filtered.filter((t) => t.priority === filterPriority);
    setFilteredTasks(filtered);
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const newStatus = task.status === "completed" ? "todo" : "completed";
      await tasksAPI.update(task._id, { status: newStatus });
      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"
          />
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">
            Tasks
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            You have {tasks.filter((t) => t.status !== "completed").length}{" "}
            pending items
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedTask(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 px-3 text-gray-400 border-r border-gray-100 dark:border-gray-800 mr-2">
          <Filter size={18} />
          <span className="text-xs font-bold uppercase hidden sm:block">
            Filter
          </span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-transparent text-sm font-semibold focus:outline-none dark:text-gray-300"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-transparent text-sm font-semibold focus:outline-none dark:text-gray-300"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Task List */}
      <div className="grid gap-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="group flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all shadow-sm"
            >
              <button
                onClick={() => handleToggleComplete(task)}
                className="mt-1 transition-transform active:scale-90"
              >
                {task.status === "completed" ? (
                  <CheckCircle
                    className="text-green-500 fill-green-500/10"
                    size={24}
                  />
                ) : (
                  <Circle
                    className="text-gray-300 dark:text-gray-600"
                    size={24}
                  />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`font-bold truncate ${task.status === "completed" ? "line-through text-gray-400 dark:text-gray-600" : "text-gray-800 dark:text-gray-100"}`}
                  >
                    {task.title}
                  </h3>
                  <PriorityBadge priority={task.priority} />
                </div>

                {task.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                    {task.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                  {task.dueDate && (
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                      <CalendarIcon size={12} />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {task.tags?.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md"
                    >
                      <Tag size={12} />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Menu */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setShowModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Delete?")) {
                      await tasksAPI.delete(task._id);
                      loadTasks();
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <CheckSquare size={32} />
            </div>
            <h3 className="font-bold text-gray-400">No tasks found</h3>
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => setShowModal(false)}
          onSave={loadTasks}
        />
      )}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: any = {
    urgent: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    high: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    medium: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    low: "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  };
  return (
    <span
      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${styles[priority] || styles.low}`}
    >
      {priority}
    </span>
  );
}
