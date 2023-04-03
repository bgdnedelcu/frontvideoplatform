import axios from "axios";

const BASE_URL = "http://localhost:8080/videoplatform/api/account";

class UserService {
  createAccount(user) {
    return axios.post(`${BASE_URL}/register`, user);
  }

  login(userData) {
    return axios.post(`${BASE_URL}/login`, userData);
  }

  getUserById(id) {
    return axios.get(`${BASE_URL}/getUserById/${id}`);
  }
}

export default new UserService();
