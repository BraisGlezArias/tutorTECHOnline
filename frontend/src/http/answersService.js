import axios from 'axios';

export function addAnswer(id, answer) {
    return axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/questions/${id.id}/answers`, answer)
}

export function updateAnswer(question, id, answer) {
    return axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/questions/${question}/answers/${id}`, answer)
}

export function deleteAnswer(question, answer) {
    return axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/questions/${question}/answers/${answer}`)
}