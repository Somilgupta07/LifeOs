import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { Menu, X, Sun, Moon } from "lucide-react";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Tasks from "./components/Tasks/Tasks";
import Goals from "./components/Goals/Goals";
import CalendarView from "./components/Calendar/CalendarView";
import AIAssistant from "./components/AI/AIAssistant";

/**
 * 🎨 Global Theme Toggle Component
 * Reusable button for both Auth and Main app views
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:ring-2 ring-blue-500 transition-all shadow-sm"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-slate-700" />
      )}
    </button>
  );
};

function AuthWrapper() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="relative min-h-screen">
      {/* 🚀 Floating toggle for Auth screens */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {showLogin ? (
        <Login onToggle={() => setShowLogin(false)} />
      ) : (
        <Register onToggle={() => setShowLogin(true)} />
      )}
    </div>
  );
}

function MainApp() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-pulse text-blue-600 dark:text-blue-400 font-medium text-xl tracking-tight">
          LifeOS initializing...
        </div>
      </div>
    );
  }

  if (!user) return <AuthWrapper />;

  const renderPage = () => {
    const pages: Record<string, JSX.Element> = {
      dashboard: <Dashboard />,
      tasks: <Tasks />,
      goals: <Goals />,
      calendar: <CalendarView />,
      ai: <AIAssistant />,
    };
    return pages[currentPage] || <Dashboard />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar - Desktop & Mobile */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={(page) => {
            setCurrentPage(page);
            setSidebarOpen(false);
          }}
        />
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400"
        >
          <X size={20} />
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-4 md:px-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-400 italic">
              LifeOS
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle /> {/* 🚀 Toggle in Main Header */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Active Session
              </span>
              <span className="text-sm font-medium truncate max-w-[150px]">
                {user.email?.split("@")[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar scrollbar-gutter-stable">
          <div className="max-w-7xl mx-auto">{renderPage()}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
