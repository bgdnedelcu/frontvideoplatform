import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Register from "./components/user/Register";
import Login from "./components/user/Login";
import VideoPage from "./components/video/VideoPage";
import Home from "./components/video/Home";
import UploadVideo from "./components/video/UploadVideo";
import Playlist from "./components/playlist/Playlist";
import VideosFromPlayList from "./components/playlist/VideosFromPlaylist";
import Channel from "./components/user/Channel";
import NotFound from "./components/helpers/NotFound";
import EditAccount from "./components/user/EditAccount";
import ProtectedRoute from "./components/helpers/ProtectedRoute";
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

          <Route path="/play" element={<VideoPage />}>
            <Route path=":videoId" element={<VideoPage />} />
          </Route>

          <Route path="channel">
            <Route path="" element={<NotFound />} />
            <Route
              path=":channelName"
              element={
                <ProtectedRoute user={user}>
                  <Channel />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
