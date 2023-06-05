import axios from "axios";
import JwtService from "./jwtservice";

const VIDEO_MS_URL = "http://192.168.1.240:8081/videoplatform/api/video";

const defaultConfig = {
  headers: { Authorization: JwtService.addAuthorization() },
};

const getCommentsByVideoId = async (videoId) => {
  try {
    return await axios.get(
      `${VIDEO_MS_URL}/commentsByVideoId/${videoId}`,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const getLogUserId = async () => {
  try {
    return await axios.get(`${VIDEO_MS_URL}/getLogUserId`, defaultConfig);
  } catch (e) {
    throw e;
  }
};

const deleteCommentById = async (commentId) => {
  try {
    return await axios.delete(
      `${VIDEO_MS_URL}/deleteCommentById/${commentId}`,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const addComment = async (content, videoId) => {
  const config = {
    headers: {
      Authorization: JwtService.addAuthorization(),
      "Content-Type": "text/plain",
    },
  };
  try {
    return await axios.post(
      `${VIDEO_MS_URL}/addComment?idVideo=${videoId}`,
      content,
      config
    );
  } catch (e) {
    throw e;
  }
};

const getVideosByChannelName = async (channel) => {
  try {
    return await axios.get(
      `${VIDEO_MS_URL}/getVideosByChannelName/${channel}`,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const insertToPlaylist = async (body) => {
  const config = {
    headers: {
      Authorization: JwtService.addAuthorization(),
      "Content-Type": "application/json",
    },
  };

  try {
    return await axios.post(`${VIDEO_MS_URL}/insertToPlaylist`, body, config);
  } catch (e) {
    throw e;
  }
};

const deleteAllVideosFromPlaylist = async (body) => {
  const config = {
    headers: { Authorization: JwtService.addAuthorization() },
    "Content-Type": "application/json",
  };
  try {
    return await axios.post(
      `${VIDEO_MS_URL}/deleteAllVideosFromPlaylist`,
      body,
      config
    );
  } catch (e) {
    throw e;
  }
};

const uploadVideo = async (formData) => {
  try {
    return await axios.post(`${VIDEO_MS_URL}/upload`, formData, defaultConfig);
  } catch (e) {
    throw e;
  }
};

const likeVideo = async (videoId) => {
  try {
    return await axios.post(
      `${VIDEO_MS_URL}/like/${videoId}`,
      {},
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const deleteLike = async (videoId) => {
  try {
    return await axios.post(
      `${VIDEO_MS_URL}/deleteLike/${videoId}`,
      {},
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const getVideoDetails = async (videoId) => {
  try {
    return await axios.get(
      `${VIDEO_MS_URL}/getVideoDetails/${videoId}`,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const getAllVideosFromPlaylistById = async (playlistId) => {
  try {
    return await axios.get(
      `${VIDEO_MS_URL}/playList/${playlistId}`,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const deleteVideoFromPlaylist = async (body) => {
  try {
    return await axios.post(
      `${VIDEO_MS_URL}/deleteVideoFromPlaylist`,
      body,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const loadVideosForHome = async (baseUrl, config) => {
  try {
    return await axios.get(baseUrl, config);
  } catch (e) {
    throw e;
  }
};

const deleteVideoById = async (videoId) => {
  try {
    return await axios.delete(
      `${VIDEO_MS_URL}/deleteVideoById/${videoId}`,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const checkIfVideoExists = async (videoId) => {
  try {
    return await axios.get(`${VIDEO_MS_URL}/checkVideoId/${videoId}`);
  } catch (e) {
    throw e;
  }
};

const getVideoDetailsForNonUsers = async (videoId) => {
  try {
    return await axios.get(
      `${VIDEO_MS_URL}/videoDetailsForNonUsers/${videoId}`
    );
  } catch (e) {
    throw e;
  }
};

const getVideosForChannel = async (channelName) => {
  try {
    return await axios.get(
      `${VIDEO_MS_URL}/videosForChannel/${channelName}`,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const ClientVideo = {
  VIDEO_MS_URL,
  defaultConfig,
  getCommentsByVideoId,
  getLogUserId,
  deleteCommentById,
  addComment,
  insertToPlaylist,
  getVideosByChannelName,
  deleteAllVideosFromPlaylist,
  uploadVideo,
  likeVideo,
  deleteLike,
  getVideoDetails,
  getAllVideosFromPlaylistById,
  deleteVideoFromPlaylist,
  loadVideosForHome,
  deleteVideoById,
  checkIfVideoExists,
  getVideoDetailsForNonUsers,
  getVideosForChannel,
};

export default ClientVideo;
