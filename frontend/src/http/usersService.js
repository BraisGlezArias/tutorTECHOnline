import axios from 'axios';

export function getUsers() {
    return axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users`);
}

export function getUser(id) {
    return axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${id}`);
}

export function uploadAvatar(file) {
    return axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/avatar`, file);
}

export function changePassword() {
    return axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/accounts/password`);
}
