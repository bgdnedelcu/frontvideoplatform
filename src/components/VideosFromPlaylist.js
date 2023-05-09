import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Table, Modal } from "react-bootstrap";
import Header from "./Header";
import NotFound from "./NotFound";
import ClientVideo from "../service/clientVideo";
import ClientUser from "../service/clientUser";

const VideosFromPlayList = () => {
  const [videos, setVideos] = useState([]);
  const [numVideosFromPlaylist, setNumVideosFromPLaylist] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDeleteId, setVideoToDeleteId] = useState(null);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);

  const { playlistId } = useParams();
  const navigate = useNavigate();

  const handleShowModal = () => setShowDeleteModal(!showDeleteModal);

  const getVideosFromPlaylist = () => {
    ClientVideo.getAllVideosFromPlaylistById(playlistId)
      .then((response) => {
        setNumVideosFromPLaylist(response.data.length);
        setVideos(response.data);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 400) {
          setErrorStatus(true);
        }
      });
  };

  const getPlaylistTitle = () => {
    ClientUser.getPLaylistTitleByPlaylistId(playlistId)
      .then((response) => {
        setPlaylistTitle(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const goToVideo = (e) => {
    const videoId = e.target.value;
    const videoPath = "/play/".concat(videoId);
    navigate(videoPath, { state: { videoId } });
  };

  const deleteVideo = () => {
    const videoId = videoToDeleteId;

    const body = {
      idPlayList: playlistId,
      idVideo: videoId,
    };

    ClientVideo.deleteVideoFromPlaylist(body)
      .then(() => {
        setNumVideosFromPLaylist(
          (prevNumVideosFromPlaylist) => prevNumVideosFromPlaylist - 1
        );
        setVideoToDeleteId(null);
        handleShowModal();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getVideosFromPlaylist();
    getPlaylistTitle();
  }, [numVideosFromPlaylist]);

  return (
    <>
      <Header />
      {!errorStatus && (
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
                            onClick={() => {
                              handleShowModal();
                              setVideoToDeleteId(video.videoId);
                            }}
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
      )}
      {errorStatus && <NotFound />}

      <Modal show={showDeleteModal} onHide={handleShowModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this video from playlist?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleShowModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => deleteVideo(videoToDeleteId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VideosFromPlayList;
