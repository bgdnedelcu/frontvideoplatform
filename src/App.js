import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import VideoPage from "./components/VideoPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="mainContent">
          <Routes>
            <Route path="/home" element={<Header />}></Route>
            <Route path="/play" element={<VideoPage />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
      <BrowserRouter>
        <div className="nonProtectedRoutes">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
