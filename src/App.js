import Register from "./components/Register";
import Login from "./components/Login";
import VideoPage from "./components/VideoPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import "./index.css";
import UploadVideo from "./components/UploadVideo";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="mainContent">
          <Routes>
            <Route path="/search" element={<Home />}>
              <Route path="" element={<Home />} />
              <Route path=":searchText" element={<Home />} />
            </Route>
            <Route path="/play" element={<VideoPage />}>
              <Route path=":videoId" element={<VideoPage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
      <BrowserRouter>
        <div className="nonProtectedRoutes">
          <Routes>
            <Route path="/upload" element={<UploadVideo />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
