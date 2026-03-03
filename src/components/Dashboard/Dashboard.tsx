import { useEffect, useState } from "react";
import {
  CheckSquare,
  Target,
  Calendar,
  TrendingUp,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { tasksAPI, goalsAPI, eventsAPI } from "../../services/api";

interface DashboardProps {
  setCurrentPage: (page: string) => void;
}

export default function Dashboard({ setCurrentPage }: DashboardProps) {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    urgentTasks: 0,
    activeGoals: 0,
    completedGoals: 0,
    upcomingEvents: 0,
  });

  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tasks, goals, events] = await Promise.all([
        tasksAPI.getAll(),
        goalsAPI.getAll(),
        eventsAPI.getAll(),
      ]);

      setStats({
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t: any) => t.status === "completed")
          .length,
        activeTasks: tasks.filter((t: any) => t.status !== "completed").length,
        urgentTasks: tasks.filter((t: any) => t.priority === "urgent").length,
        activeGoals: goals.filter((g: any) => g.status === "active").length,
        completedGoals: goals.filter((g: any) => g.status === "completed")
          .length,
        upcomingEvents: events.filter(
          (e: any) => new Date(e.startDate) > new Date(),
        ).length,
      });

      setRecentTasks(tasks.slice(0, 5));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  const statCards = [
    {
      title: "Active Tasks",
      value: stats.activeTasks,
      icon: CheckSquare,
      color: "blue",
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Active Goals",
      value: stats.activeGoals,
      icon: Target,
      color: "purple",
    },
    {
      title: "Urgent",
      value: stats.urgentTasks,
      icon: AlertCircle,
      color: "red",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          System Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Everything looks nominal. You have{" "}
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            {stats.urgentTasks}
          </span>{" "}
          urgent items.
        </p>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center 
              ${
                card.color === "blue"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                  : card.color === "green"
                    ? "bg-green-50 text-green-600 dark:bg-green-900/20"
                    : card.color === "purple"
                      ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20"
                      : "bg-red-50 text-red-600 dark:bg-red-900/20"
              }`}
            >
              <card.icon size={22} />
            </div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {card.title}
            </p>
            <p className="text-2xl md:text-3xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Recent Tasks</h2>
            <button
              onClick={() => setCurrentPage("tasks")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === "urgent" ? "bg-red-500" : "bg-blue-500"}`}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{task.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:block text-[10px] font-bold uppercase px-2 py-1 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                No recent activity
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-lg font-bold mb-6">Productivity</h2>
            <div className="space-y-4">
              <StatRow
                icon={Calendar}
                label="Upcoming Events"
                value={stats.upcomingEvents}
                color="text-blue-600"
              />
              <StatRow
                icon={Target}
                label="Goals Achieved"
                value={stats.completedGoals}
                color="text-green-600"
              />
              <StatRow
                icon={CheckSquare}
                label="Lifetime Tasks"
                value={stats.totalTasks}
                color="text-purple-600"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
            <Bot size={28} className="mb-4" />
            <h3 className="font-bold text-lg mb-1">AI Assistant</h3>
            <p className="text-blue-100 text-sm mb-4">
              Analyze your current workload and get priority suggestions.
            </p>

            <button
              onClick={() => {
                localStorage.setItem("ai_action", "run_audit");
                setCurrentPage("ai");
              }}
              className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-sm font-semibold transition-colors"
            >
              Get Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon size={18} className={color} />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    </div>
  );
}

const Bot = ({ size, className }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);
