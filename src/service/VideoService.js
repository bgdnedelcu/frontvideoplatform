import axios from "axios";

const BASE_URL = "http://localhost:8081/videoplatform/api/video";
class VideoService {
  playVideo(videoUrl) {
    return axios.get(`${BASE_URL}/play/${videoUrl}`);
  }

  getVideoDetailsById(videoId) {
    return axios.get(`${BASE_URL}/videoById/${videoId}`);
  }
}
export default new VideoService();
