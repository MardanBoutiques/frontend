const API_BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/').replace(/\/$/, '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;

  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE}${path}`;
};
