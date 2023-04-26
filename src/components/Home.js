import React from "react";
import Header from "./Header";
import { useState, useEffect } from "react";
import JwtService from "../service/jwtservice";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import axios from "axios";

import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Dropdown,
  ButtonGroup,
  Modal,
} from "react-bootstrap";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [playListSet, setPlayListSet] = useState([]);
  const [succesMessage, setSuccesMessage] = useState(false);
  const [userRole, setUserRole] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [videoIdToDelete, setVideoIdToDelete] = useState(undefined);
  const size = 12;

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const navigate = useNavigate();

  const { searchText } = useParams();

  useEffect(() => {
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
      params: {
        size: size,
        page: page,
      },
    };

    let baseUrl = "http://localhost:8081/videoplatform/api/video/";
    if (searchText == null) {
      baseUrl = baseUrl.concat("home");
    } else {
      baseUrl = baseUrl.concat("search/").concat(searchText);
      console.log(baseUrl);
    }

    axios
      .get(baseUrl, config)
      .then((response) => {
        console.log(response.data);
        const newVideos = response.data;
        setVideos((prevVideos) => [...prevVideos, ...newVideos]);
        console.log(searchText);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [page]);

  const addToPlaylist = (e) => {
    const load = e.target.dataset.id;
    const params = load.split(" ");
    const idPlaylistList = params[0];
    const idVideo = params[1];

    const config = {
      headers: {
        Authorization: JwtService.addAuthorization(),
        "Content-Type": "application/json",
      },
    };

    const body = {
      idPlayList: idPlaylistList,
      idVideo: idVideo,
    };

    axios
      .post(
        `http://localhost:8081/videoplatform/api/video/insertToPlaylist`,
        body,
        config
      )
      .then(() => {
        setSuccesMessage(true);
      })
      .catch((err) => {
        console.error(err);
      });

    setTimeout(() => {
      setSuccesMessage(false);
    }, 1000);
  };

  useEffect(() => {
    const getPlayListSet = () => {
      const config = {
        headers: { Authorization: JwtService.addAuthorization() },
      };
      axios
        .get(
          `http://localhost:8080/videoplatform/api/account/playlistsByEmailFromToken`,
          config
        )
        .then((response) => {
          setPlayListSet(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getPlayListSet();
    const userRole = JwtService.getRole();
    setUserRole(userRole);
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const play = (e) => {
    const videoId = e.target.value;
    const videoPath = "/play/".concat(videoId);
    navigate(videoPath, { state: { videoId } });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const deleteVideo = (videoIdToDelete) => {
    const videoId = videoIdToDelete;
    const config = {
      headers: { Authorization: JwtService.addAuthorization() },
    };
    axios
      .delete(
        `http://localhost:8081/videoplatform/api/video/deleteVideoById/${videoId}`,
        config
      )
      .then(() => {
        console.log("Video deleted successfully");
        setVideos((prevVideos) =>
          prevVideos.filter((video) => video.videoId !== videoIdToDelete)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Header />
      <Container className="videosTable">
        <Row className="justify-content-md-center">
          <Col sm={4}>
            {succesMessage && (
              <>
                <Alert variant={"success"} className="customPlayer">
                  Successfully added to the playlist!
                </Alert>
              </>
            )}
          </Col>
        </Row>
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
                    <tr key={video.videoId} id="row + key">
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
                              handleShowModal();
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
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this video?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteVideo(videoIdToDelete);
              handleCloseModal();
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
