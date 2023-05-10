import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Dropdown,
  ButtonGroup,
  Modal,
  Alert,
} from "react-bootstrap";
import Header from "./Header";
import JwtService from "../service/jwtservice";
import ClientVideo from "../service/clientVideo";
import ClientUser from "../service/clientUser";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [playListSet, setPlayListSet] = useState([]);
  const [succesMessage, setSuccesMessage] = useState(false);
  const [errorVideoAlreadyInPlaylist, setError] = useState(false);
  const [userRole, setUserRole] = useState(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoIdToDelete, setVideoIdToDelete] = useState(undefined);
  const [noResults, setNoResults] = useState(false);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);

  const { searchText } = useParams();
  const navigate = useNavigate();
  const size = 12;

  const handleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  const play = (e) => {
    const videoId = e.target.value;
    const videoPath = "/play/".concat(videoId);
    navigate(videoPath, { state: { videoId } });
    console.log(videoPath);
  };

  const loadVideos = () => {
    const config = ClientVideo.defaultConfig;
    config["params"] = {
      size: size,
      page: page,
    };

    let baseUrl = ClientVideo.VIDEO_MS_URL;
    if (searchText == null) {
      baseUrl = baseUrl.concat("/home");
    } else {
      baseUrl = baseUrl.concat("/search/").concat(searchText);
    }
    console.log(hasMoreVideos);
    if (hasMoreVideos) {
      ClientVideo.loadVideosForHome(baseUrl, config)
        .then((response) => {
          const newVideos = response.data;
          setVideos((prevVideos) => [...prevVideos, ...newVideos]);

          if (baseUrl.includes("search") && response.data.length === 0) {
            setNoResults(true);
          }
          console.log(response.data.length);
          if (response.data.length === 0) {
            setHasMoreVideos(false);
            return;
          }

          console.log(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    console.log(page);
  };

  const getPlayListSet = () => {
    ClientUser.getPlaylistsByEmailFromToken()
      .then((response) => {
        setPlayListSet(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addToPlaylist = (e) => {
    const load = e.target.dataset.id;
    const params = load.split(" ");
    const idPlaylistList = params[0];
    const idVideo = params[1];

    const body = {
      idPlayList: idPlaylistList,
      idVideo: idVideo,
    };

    ClientVideo.insertToPlaylist(body)
      .then(() => {
        setSuccesMessage(true);
        setError(false);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setError(true);
          setSuccesMessage(false);
        }
        console.error(err);
      });

    setTimeout(() => {
      setError(false);
    }, 5000);

    setTimeout(() => {
      setSuccesMessage(false);
    }, 5000);
  };

  const deleteVideo = (videoIdToDelete) => {
    const videoId = videoIdToDelete;
    ClientVideo.deleteVideoById(videoId)
      .then(() => {
        setVideos((prevVideos) =>
          prevVideos.filter((video) => video.videoId !== videoId)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop === //sau >=
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [page]);

  useEffect(() => {
    getPlayListSet();
    const userRole = JwtService.getRole();
    setUserRole(userRole);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Header />
      {!noResults ? (
        <Container className="videosTable">
          <Row>
            <Col>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Channel</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video, key) => {
                    return (
                      <tr key={video.videoId}>
                        <td>{video.videoTitle}</td>
                        <td>
                          <Link
                            to={`/channel/${video.videoChannel}`}
                            state={{ channelVideo: video.videoChannel }}
                            className="linkToChannel"
                          >
                            {video.videoChannel}
                          </Link>
                        </td>
                        <td>
                          <Button
                            style={{ marginRight: "10px" }}
                            value={video.videoId}
                            onClick={play}
                          >
                            Go to video
                          </Button>
                          <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle
                              variant="primary"
                              id="dropdown-basic"
                            >
                              Add in playlist
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {playListSet.map((playList, key) => {
                                return (
                                  <Dropdown.Item
                                    key={playList.id}
                                    data-id={playList.id + " " + video.videoId}
                                    onClick={addToPlaylist.bind(this)}
                                  >
                                    {playList.title}
                                  </Dropdown.Item>
                                );
                              })}
                            </Dropdown.Menu>
                          </Dropdown>
                          {userRole === "admin" && (
                            <Button
                              style={{ marginLeft: "10px" }}
                              variant="danger"
                              onClick={() => {
                                handleDeleteModal();
                                setVideoIdToDelete(video.videoId);
                              }}
                            >
                              Delete video{" "}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
          {succesMessage && (
            <div>
              <Alert
                className="alertUser fixed-bottom alert-success"
                variant="success"
              >
                The video has been successfully added to the playlist!
              </Alert>
            </div>
          )}
          {errorVideoAlreadyInPlaylist && (
            <div>
              <Alert
                className="alertUser fixed-bottom alert-danger"
                variant="danger"
              >
                The video is already in this playlist!
              </Alert>
            </div>
          )}
        </Container>
      ) : (
        <Container>
          <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
              <p className="fs-3">
                {" "}
                <span className="text-danger">Opps!</span> No results.
              </p>
              <p className="lead">There are no videos based on your search.</p>
            </div>
          </div>
        </Container>
      )}

      <Modal show={showDeleteModal} onHide={handleDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this video?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteVideo(videoIdToDelete);
              handleDeleteModal();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
