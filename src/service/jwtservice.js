const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const checkJwt = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) return true;
  return false;
};

const getRole = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    const decodedJwt = parseJwt(token);
    return decodedJwt.role[0];
  }
};

const getUser = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    const decodedJwt = parseJwt(token);
    return decodedJwt.sub;
  }
  return null;
};

const addAuthorization = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    return "Bearer " + token;
  }
};

const JwtService = {
  getRole,
  addAuthorization,
  getUser,
  checkJwt,
};

export default JwtService;
