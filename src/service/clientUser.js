import axios from "axios";
import JwtService from "./jwtservice";

const USER_MS_URL = "http://localhost:8080/videoplatform/api/account";

const defaultConfig = {
  headers: { Authorization: JwtService.addAuthorization() },
};

const login = async (userData) => {
  try {
    return axios.post(`${USER_MS_URL}/login`, userData);
  } catch (e) {
    throw e;
  }
};

const createAccount = async (userData) => {
  try {
    return axios.post(`${USER_MS_URL}/register`, userData);
  } catch (e) {
    throw e;
  }
};

const getPlaylistByEmailFromToken = async () => {
  try {
    return await axios.get(
      `${USER_MS_URL}/playlistsByEmailFromToken`,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const createNewPlayList = async (body) => {
  const config = {
    headers: { Authorization: JwtService.addAuthorization() },
    "Content-Type": "application/json",
  };
  try {
    return await axios.post(`${USER_MS_URL}/createNewPlayList`, body, config);
  } catch (e) {
    throw e;
  }
};

const editPlaylist = async (formData, playlistId) => {
  try {
    return await axios.put(
      `${USER_MS_URL}/editPlaylistTitle/${playlistId}`,
      formData,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const getChannelName = async () => {
  try {
    return await axios.get(`${USER_MS_URL}/channelName`, defaultConfig);
  } catch (e) {
    throw e;
  }
};

const updateAccount = async (body) => {
  try {
    return await axios.put(`${USER_MS_URL}/updateAccount`, body, defaultConfig);
  } catch (e) {
    throw e;
  }
};

const getPlaylistsByEmailFromToken = async () => {
  try {
    return await axios.get(
      `${USER_MS_URL}/playlistsByEmailFromToken`,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const deletePlaylistById = async (playlistId) => {
  try {
    return await axios.delete(
      `${USER_MS_URL}/deletePlaylistById/${playlistId}`,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const getCommenter = async () => {
  try {
    return await axios.get(`${USER_MS_URL}/channelName`, defaultConfig);
  } catch (e) {
    throw e;
  }
};

const getPLaylistTitleByPlaylistId = async (playlistId) => {
  try {
    return await axios.get(
      `${USER_MS_URL}/playlistTitleByPlaylistId/${playlistId}`,
      defaultConfig
    );
  } catch (e) {
    throw e;
  }
};

const ClientUser = {
  login,
  createAccount,
  getPlaylistByEmailFromToken,
  createNewPlayList,
  editPlaylist,
  getChannelName,
  updateAccount,
  getPlaylistsByEmailFromToken,
  deletePlaylistById,
  getCommenter,
  getPLaylistTitleByPlaylistId,
};

export default ClientUser;
