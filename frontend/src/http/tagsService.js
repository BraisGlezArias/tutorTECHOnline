import axios from 'axios';

export function getTags() {
    return axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tags`);
}

export function getTag(tag) {
    return axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tags/${tag}`)
}