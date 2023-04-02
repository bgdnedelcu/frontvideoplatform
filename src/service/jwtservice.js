const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const checkJwt = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  console.log("token " + token);
  if (token) {
    console.log("token inside " + token);
    const decodedJwt = parseJwt(token);
    if (decodedJwt.exp * 1000 < Date.now()) {
      return true;
    }
  }
  return false;
};

const isJwtSet = () => {
  return JSON.parse(localStorage.getItem("token"));
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
    // .sub => email
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
  checkJwt,
  addAuthorization,
  isJwtSet,
  getUser,
};

export default JwtService;
