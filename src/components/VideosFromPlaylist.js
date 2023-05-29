import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Table, Alert } from "react-bootstrap";
import Header from "./Header";
import NotFound from "./NotFound";
import ClientVideo from "../service/clientVideo";
import ClientUser from "../service/clientUser";
import CustomModal from "./CustomModal";

const VideosFromPlayList = () => {
  const [videos, setVideos] = useState([]);
  const [numVideosFromPlaylist, setNumVideosFromPLaylist] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDeleteId, setVideoToDeleteId] = useState(null);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const [succesDelete, setSuccesDelete] = useState(false);
  const [noVideosYet, setNoVideos] = useState(false);

  const { playlistId } = useParams();
  const navigate = useNavigate();

  const handleShowModal = () => setShowDeleteModal(!showDeleteModal);

  const getVideosFromPlaylist = () => {
    ClientVideo.getAllVideosFromPlaylistById(playlistId)
      .then((response) => {
        setNumVideosFromPLaylist(response.data.length);
        setVideos(response.data);
        if (response.data.length === 0) {
          setNoVideos(true);
        }
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
        setSuccesDelete(true);
      })
      .catch((err) => {
        console.error(err);
      });

    setTimeout(() => {
      setSuccesDelete(false);
    }, 2500);
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
                {noVideosYet ? (
                  <p
                    style={{
                      display: "inline-block",
                      textAlign: "center",
                      width: "100%",
                      color: "red",
                    }}
                  >
                    {" "}
                    There are no videos in this playlist yet
                  </p>
                ) : (
                  <>
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
                    </tbody>{" "}
                  </>
                )}
              </Table>
            </Col>
          </Row>
          <CustomModal
            show={showDeleteModal}
            onHide={handleShowModal}
            title={"Confirm delete"}
            body={"Are you sure you want to delete this video from playlist?"}
            onClick={handleShowModal}
            variant={"danger"}
            onClickConfirm={() => deleteVideo(videoToDeleteId)}
            buttonMessage={"Delete"}
          />
          {succesDelete && (
            <div>
              <Alert
                className="alertUser fixed-bottom alert-success"
                variant="success"
              >
                The video has been deleted from playlist!
              </Alert>
            </div>
          )}
        </Container>
      )}
      {errorStatus && <NotFound />}
    </>
  );
};

export default VideosFromPlayList;
