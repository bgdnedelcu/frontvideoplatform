import axios from "axios";

const BASE_URL = "http://localhost:8080/videoplatform/api/account";

class UserService {
  createAccount(user) {
    return axios.post(`${BASE_URL}/register`, user);
  }
}

export default new UserService();
