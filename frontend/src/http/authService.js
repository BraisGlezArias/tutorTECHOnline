import axios from 'axios';


const storedUser = JSON.parse(localStorage.getItem('currentUser'));
let token = (storedUser && storedUser.accessToken) || null;


axios.interceptors.request.use(
  function(config) {
    if (
      token &&
      !(config.url.includes('/api/login') || config.url.includes('/api/accounts'))
    ) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);


axios.interceptors.response.use(
  function(response) {
    if (response.data.accessToken) {
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      token = response.data.accessToken;
    }
    return response;
  },
  function(error) {
    if (error.response.status === 401 && !error.config.url.includes('/api/login')) {
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export function logIn({email, password}) {
    return axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
        email,
        password
    });
}


export function signUp(registerData) {
    return axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/accounts`, registerData);
}

export function changePassword(newPassword) {
  return axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/accounts/password`, newPassword);
}
