import axios from 'axios';

export function getQuestions() {
    return axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/questions`);
}

export function getQuestion(id) {
    return axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/questions/${id}`);
}

export function addQuestion(question) {
    return axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/questions`, question);
}

export function updateQuestion(id, question) {
    return axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/questions/${id}`, question);
}

export function deleteQuestion(id) {
    return axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/questions/${id}`);
}


export function deleteTagsFromQuestion(id) {
    return axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/questions/${id}/tags`);
}