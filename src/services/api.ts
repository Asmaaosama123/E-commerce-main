import axios from 'axios';

const api = axios.create({
  // Use relative paths so Vite dev server can proxy /api to the backend
  baseURL: '/api',
});

// هذا هو الجزء الأهم: يقوم بإرفاق التوكن مع كل طلب تلقائيًا
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // <-- يبحث عن التوكن بالاسم الصحيح
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;