import Axios from "axios";

export function addRating(id, rating) {
    console.log(id);
    return Axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/answers/${id}/ratings`, rating)
}