import axios from "axios";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import Header from "./Header";
import JwtService from "../service/jwtservice";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const VideosFromPlayList = () => {
  const [videos, setVideos] = useState([]);
  const [numVideosFromPlaylist, setNumVideosFromPLaylist] = useState(0);

  const { playlistId } = useParams();
  const navigate = useNavigate();

  const loc = useLocation();
  const playlistTitle = loc.state.playlistTitle;

  useEffect(() => {
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
    };

    axios
      .get(
        `http://localhost:8081/videoplatform/api/video/playList/${playlistId}`,
        config
      )
      .then((response) => {
        setNumVideosFromPLaylist(response.data.length);
        setVideos(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [numVideosFromPlaylist]);

  const goToVideo = (e) => {
    const videoId = e.target.value;
    const videoPath = "/play/".concat(videoId);
    navigate(videoPath, { state: { videoId } });
  };

  const deleteVideo = (e) => {
    const videoId = e.target.value;

    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
    };

    const body = {
      idPlayList: playlistId,
      idVideo: videoId,
    };

    axios
      .post(
        `http://localhost:8081/videoplatform/api/video/removeVideoFromPlaylist`,
        body,
        config
      )
      .then(() => {
        setNumVideosFromPLaylist(
          (prevNumVideosFromPlaylist) => prevNumVideosFromPlaylist - 1
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <Header />
      <Container className="videosFromPlaylistTable">
        <Row className="justify-content-md-center">
          <Col>
            <h2
              style={{
                display: "inline-block",
                textAlign: "center",
                width: "100%",
              }}
            >
              Videos from{" "}
              <span className="playlistTitle" style={{ color: "blue" }}>
                {playlistTitle}{" "}
              </span>{" "}
              playlist
            </h2>
          </Col>
        </Row>

        <Row>
          <Col>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Channel Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video, key) => {
                  return (
                    <tr key={video.videoId}>
                      <td>{video.videoTitle}</td>
                      <td>{video.videoChannel}</td>
                      <td>
                        <Button
                          style={{ marginRight: "10px" }}
                          value={video.videoId}
                          onClick={goToVideo}
                        >
                          Go to video
                        </Button>
                        <Button
                          variant="danger"
                          style={{ marginRight: "10px" }}
                          value={video.videoId}
                          onClick={deleteVideo}
                        >
                          Delete from playlist
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VideosFromPlayList;
