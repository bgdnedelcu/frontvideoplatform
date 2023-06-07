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
} from "react-bootstrap";
import Header from "./Header";
import JwtService from "../service/jwtservice";
import ClientVideo from "../service/clientVideo";
import ClientUser from "../service/clientUser";
import CustomModal from "./CustomModal";
import CustomAlert from "./CustomAlert";

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
  const [noPlaylistsYet, setNoPlaylistsYet] = useState(false);

  const { searchText } = useParams();
  const navigate = useNavigate();
  const size = 12;

  const handleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  const play = (e) => {
    const videoId = e.target.value;
    const videoPath = "/play/".concat(videoId);
    navigate(videoPath, { state: { videoId } });
  };

  let baseUrl = ClientVideo.VIDEO_MS_URL;

  const loadVideos = () => {
    const config = ClientVideo.defaultConfig;
    config["params"] = {
      size: size,
      page: page,
    };

    if (searchText == null) {
      baseUrl = baseUrl.concat("/home");
    } else {
      baseUrl = baseUrl.concat("/search/").concat(searchText);
    }

    if (hasMoreVideos) {
      ClientVideo.loadVideosForHome(baseUrl, config)
        .then((response) => {
          const newVideos = response.data;
          setVideos((prevVideos) => [...prevVideos, ...newVideos]);

          if (baseUrl.includes("search") && response.data.length === 0) {
            setNoResults(true);
          }

          if (response.data.length === 0) {
            setHasMoreVideos(false);
            return;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const getPlayListSet = () => {
    ClientUser.getPlaylistsByEmailFromToken()
      .then((response) => {
        setPlayListSet(response.data);
        if (response.data.length === 0) {
          setNoPlaylistsYet(true);
        }
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
        setTimeout(() => {
          setSuccesMessage(false);
        }, 2500);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setError(true);
          setSuccesMessage(false);
          setTimeout(() => {
            setError(false);
          }, 2500);
        }
        console.error(err);
      });
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
    if (baseUrl.includes("search")) {
      return;
    }
    if (
      window.innerHeight + document.documentElement.scrollTop ===
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
                  <tr className="videosTableTr">
                    <th className="responsive">Title</th>
                    <th className="responsive">Channel</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video, index) => {
                    return (
                      <tr key={index}>
                        <td className="responsive">{video.videoTitle}</td>
                        <td>
                          <Link
                            to={`/channel/${video.videoChannel}`}
                            state={{ channelVideo: video.videoChannel }}
                            className="responsive linkToChannel"
                          >
                            {video.videoChannel}
                          </Link>
                        </td>
                        <td className="actions">
                          <Button
                            className="button1 button-width"
                            value={video.videoId}
                            onClick={play}
                          >
                            Go to video
                          </Button>
                          <Dropdown as={ButtonGroup} className="button3">
                            <Dropdown.Toggle
                              variant="primary"
                              className="button-width"
                            >
                              Add to playlist
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {noPlaylistsYet ? (
                                <p className="noPlaylists">No playlists yet</p>
                              ) : (
                                playListSet.map((playList, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      data-id={
                                        playList.id + " " + video.videoId
                                      }
                                      onClick={addToPlaylist.bind(this)}
                                    >
                                      {playList.title}
                                    </Dropdown.Item>
                                  );
                                })
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                          {userRole === "admin" && (
                            <Button
                              className="button2 button-width"
                              variant="danger"
                              onClick={() => {
                                handleDeleteModal();
                                setVideoIdToDelete(video.videoId);
                              }}
                            >
                              Delete video
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
          <CustomModal
            show={showDeleteModal}
            onHide={handleDeleteModal}
            title={"Confirm delete"}
            body={"Are you sure you want to delete this video?"}
            onClick={handleDeleteModal}
            variant={"danger"}
            onClickConfirm={() => {
              deleteVideo(videoIdToDelete);
              handleDeleteModal();
            }}
            buttonMessage={"Delete"}
          />
          {succesMessage && (
            <CustomAlert
              className={"alertUser fixed-bottom alert-success"}
              variant={"success"}
              message={"The video has been successfully added to the playlist!"}
            />
          )}
          {errorVideoAlreadyInPlaylist && (
            <CustomAlert
              className={"alertUser fixed-bottom alert-danger"}
              variant={"danger"}
              message={"The video is already in this playlist!"}
            />
          )}
        </Container>
      ) : (
        <Container>
          <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
              <p className="fs-3">
                <span className="text-danger">Opps!</span> No results.
              </p>
              <p className="lead">There are no videos based on your search.</p>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

export default Home;
