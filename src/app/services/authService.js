import axios from 'axios';

export const API_URL = 'http://127.0.0.1:8000/listing360/';

export const register = (username, password) => {
    return axios.post(`${API_URL}register/`, {
        username,
        password,
    });
};

export const login = (username, password) => {
    return axios.post(`${API_URL}login/`, {
        username,
        password,
    });
};