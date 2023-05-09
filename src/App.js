import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./index.css";
import Register from "./components/Register";
import Login from "./components/Login";
import VideoPage from "./components/VideoPage";
import Home from "./components/Home";
import UploadVideo from "./components/UploadVideo";
import Playlist from "./components/Playlist";
import VideosFromPlayList from "./components/VideosFromPlaylist";
import Channel from "./components/Channel";
import NotFound from "./components/NotFound";
import EditAccount from "./components/EditAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import JwtService from "./service/jwtservice";

function App() {
  const user = JwtService.getUser();

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute user={user}>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editAccount"
            element={
              <ProtectedRoute user={user}>
                <EditAccount />
              </ProtectedRoute>
            }
          />

          <Route path="/play" element={<VideoPage />}>
            <Route path=":videoId" element={<VideoPage />} />
          </Route>

          <Route
            path="/upload"
            element={
              <ProtectedRoute user={user}>
                <UploadVideo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute user={user}>
                <Playlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlist"
            element={
              <ProtectedRoute user={user}>
                <VideosFromPlayList />
              </ProtectedRoute>
            }
          >
            <Route path=":playlistId" element={<VideosFromPlayList />} />
          </Route>

          <Route
            path="/search"
            element={
              <ProtectedRoute user={user}>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<Home />} />
            <Route path=":searchText" element={<Home />} />
          </Route>

          <Route
            path="/channel/:channelName"
            element={
              <ProtectedRoute user={user}>
                <Channel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
