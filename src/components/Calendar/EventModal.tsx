import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  AlignLeft,
  Calendar as CalendarIcon,
  Clock,
  Hash,
} from "lucide-react";
import { eventsAPI } from "../../services/api";

export default function EventModal({
  event,
  defaultDate,
  onClose,
  onSave,
}: any) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    category: "other",
    color: "#3b82f6",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      setFormData({
        title: event.title || "",
        description: event.description || "",
        startDate: start.toISOString().split("T")[0],
        startTime: start.toTimeString().slice(0, 5),
        endDate: end.toISOString().split("T")[0],
        endTime: end.toTimeString().slice(0, 5),
        location: event.location || "",
        category: event.category || "other",
        color: event.color || "#3b82f6",
      });
    } else if (defaultDate) {
      const dateStr = defaultDate.toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        startDate: dateStr,
        endDate: dateStr,
        startTime: "09:00",
        endTime: "10:00",
      }));
    }
  }, [event, defaultDate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        startDate: new Date(
          `${formData.startDate}T${formData.startTime}`,
        ).toISOString(),
        endDate: new Date(
          `${formData.endDate}T${formData.endTime}`,
        ).toISOString(),
      };
      event
        ? await eventsAPI.update(event._id, payload)
        : await eventsAPI.create(payload);
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white">
            {event ? "Modify Event" : "New Schedule"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block ml-1">
                Event Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white font-bold"
                placeholder="Design Sync / Team Lunch"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block ml-1">
                  Start
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm"
                  />
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block ml-1">
                  End
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm"
                  />
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block ml-1">
                Location
              </label>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm"
                  placeholder="Zoom / Meeting Room A"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block ml-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm"
                >
                  <option value="meeting">Meeting</option>
                  <option value="reminder">Reminder</option>
                  <option value="deadline">Deadline</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block ml-1">
                  Theme Color
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full h-[44px] p-1 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 font-bold text-gray-400 hover:text-gray-600 transition"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              {loading ? "Saving..." : "Confirm Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
