const api = (process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '');
const media = (process.env.REACT_APP_MEDIA_URL || 'http://127.0.0.1:8000/media').replace(/\/$/, '');

export const API_BASE = api;
export const MEDIA_BASE = media;
