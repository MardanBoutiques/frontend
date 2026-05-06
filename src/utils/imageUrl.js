const CLOUD_NAME = 'dmwmkfv6w';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;

  const path = imagePath.startsWith('/media/')
    ? imagePath.replace('/media/', '')
    : imagePath;

  if (import.meta.env.VITE_API_URL) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${path}`;
  }

  return `http://127.0.0.1:8001/media/${path}`;
};
