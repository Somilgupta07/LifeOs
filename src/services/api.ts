const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthToken = () => localStorage.getItem("token");

const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  login: (credentials: { email: string; password: string }) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  getProfile: () => request("/auth/profile"),
  updateProfile: (userData: any) =>
    request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
};

export const tasksAPI = {
  getAll: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return request(`/tasks${query}`);
  },
  getById: (id: string) => request(`/tasks/${id}`),
  create: (taskData: any) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    }),
  update: (id: string, taskData: any) =>
    request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    }),
  delete: (id: string) =>
    request(`/tasks/${id}`, {
      method: "DELETE",
    }),
  getStats: () => request("/tasks/stats"),
};

export const goalsAPI = {
  getAll: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return request(`/goals${query}`);
  },
  getById: (id: string) => request(`/goals/${id}`),
  create: (goalData: any) =>
    request("/goals", {
      method: "POST",
      body: JSON.stringify(goalData),
    }),
  update: (id: string, goalData: any) =>
    request(`/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(goalData),
    }),
  delete: (id: string) =>
    request(`/goals/${id}`, {
      method: "DELETE",
    }),
  updateMilestone: (goalId: string, milestoneId: string, milestoneData: any) =>
    request(`/goals/${goalId}/milestones/${milestoneId}`, {
      method: "PUT",
      body: JSON.stringify(milestoneData),
    }),
};

export const eventsAPI = {
  getAll: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return request(`/events${query}`);
  },
  getById: (id: string) => request(`/events/${id}`),
  create: (eventData: any) =>
    request("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    }),
  update: (id: string, eventData: any) =>
    request(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    }),
  delete: (id: string) =>
    request(`/events/${id}`, {
      method: "DELETE",
    }),
};

export const aiAPI = {
  chat: (message: string, context?: any) =>
    request("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, context }),
    }),
  getInsights: (tasksData: any, goalsData: any) =>
    request("/ai/insights", {
      method: "POST",
      body: JSON.stringify({ tasksData, goalsData }),
    }),
  parseNaturalLanguage: (text: string, type: string) =>
    request("/ai/parse", {
      method: "POST",
      body: JSON.stringify({ text, type }),
    }),
};
