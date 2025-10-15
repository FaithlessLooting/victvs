import axios from 'axios';

const api = axios.create({
    baseURL: '/', 
});

export const fetchExams = () => api.get('/api/exams').then(res => res.data);
export const fetchExamById = (id) => api.get(`/api/exams/${id}`).then(res => res.data);
export const fetchCandidates = () => api.get('/api/candidates').then(res => res.data);
export const fetchLocations = () => api.get('/api/locations').then(res => res.data);