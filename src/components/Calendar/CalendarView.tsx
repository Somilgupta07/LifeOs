import { useEffect, useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
} from "lucide-react";
import { eventsAPI } from "../../services/api";
import EventModal from "./EventModal";

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  const loadEvents = async () => {
    try {
      const data = await eventsAPI.getAll();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const { daysInMonth, startingDayOfWeek } = (() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return {
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      startingDayOfWeek: new Date(year, month, 1).getDay(),
    };
  })();

  const getEventsForDate = (date: Date) => {
    return events.filter((event: any) => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  if (loading) return <CalendarSkeleton />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Schedule your life and sync your goals.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedEvent(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} /> New Event
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Calendar Grid Section */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-black">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              <span className="text-gray-400 font-medium">
                {currentDate.getFullYear()}
              </span>
            </h2>
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                    ),
                  )
                }
                className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 text-xs font-bold uppercase tracking-wider"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                    ),
                  )
                }
                className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-4">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div
                key={d}
                className="text-[10px] font-black text-gray-400 uppercase"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`b-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day,
              );
              const dayEvents = getEventsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected =
                selectedDate?.toDateString() === date.toDateString();

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all duration-200 
                    ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : isToday
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-600"
                          : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  <span
                    className={`text-sm font-bold ${isSelected ? "scale-110" : ""}`}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div
                      className={`mt-1 flex gap-0.5 justify-center flex-wrap px-1`}
                    >
                      {dayEvents.slice(0, 3).map((e: any, idx) => (
                        <div
                          key={idx}
                          className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : ""}`}
                          style={{
                            backgroundColor: isSelected ? undefined : e.color,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Agenda Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-[32px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm min-h-[400px]">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              {selectedDate?.toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
              })}{" "}
              Agenda
            </h2>

            <div className="space-y-4">
              {getEventsForDate(selectedDate || new Date()).map(
                (event: any) => (
                  <div
                    key={event._id}
                    className="group p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border-l-4 transition-all hover:translate-x-1"
                    style={{ borderLeftColor: event.color }}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 dark:text-white leading-tight">
                        {event.title}
                      </h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowModal(true);
                          }}
                          className="p-1 hover:text-blue-500"
                        >
                          <Plus size={14} className="rotate-45" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />{" "}
                        {new Date(event.startDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                ),
              )}
              {getEventsForDate(selectedDate || new Date()).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 text-gray-300">
                    <CalendarIcon size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-400">
                    Clear schedule for today.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <EventModal
          event={selectedEvent}
          defaultDate={selectedDate}
          onClose={() => setShowModal(false)}
          onSave={loadEvents}
        />
      )}
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 h-[500px] bg-gray-200 dark:bg-gray-800 rounded-[32px]" />
        <div className="h-[500px] bg-gray-200 dark:bg-gray-800 rounded-[32px]" />
      </div>
    </div>
  );
}
