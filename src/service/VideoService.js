import axios from "axios";

const BASE_URL = "http://localhost:8081/videoplatform/api/video/play"; // înlocuiți cu adresa URL a serverului backend-ului

class VideoService {
  playVideo(videoUrl) {
    return axios.get(`${BASE_URL}/${videoUrl}`);
  }
}
export default new VideoService();
